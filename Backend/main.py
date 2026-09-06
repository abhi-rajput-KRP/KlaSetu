import shutil
import tempfile
import uuid
from pathlib import Path
import traceback
from contextlib import asynccontextmanager

from fastapi import FastAPI, status, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from utils.database import Base, engine
from src.users.router import user_router
from src.users.models import UserModel
from src.market.router import market_router
from src.market.models import ProductModel, OrderModel

from AI.pipeline.build_graph import (
    compiled_graph,
    calculate_price,
    get_rembg_session,
    TranscriptionService,
    SUPPORTED_LANGUAGES,
)

# Ensure bucket directory exists
BUCKET_DIR = Path("bucket")
BUCKET_DIR.mkdir(exist_ok=True, parents=True)


def ensure_db_schema():
    """
    Creates tables if not present and applies necessary ALTER TABLE statements
    for any missing columns on existing PostgreSQL tables.
    """
    Base.metadata.create_all(engine)
    with engine.connect() as conn:
        # Check and add columns to users if missing
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'buyer'"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(255) DEFAULT ''"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT ''"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS craft_discipline VARCHAR(255) DEFAULT ''"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT ''"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS store_name VARCHAR(255) DEFAULT ''"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(500) DEFAULT ''"))
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"))
        conn.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is migrated/created
    try:
        ensure_db_schema()
    except Exception as e:
        print(f"[WARN] Database schema sync: {e}")

    # Warm up heavy singletons in background/lifespan
    try:
        get_rembg_session()
        TranscriptionService.get_service()
    except Exception as e:
        print(f"[WARN] Model warm-up skipped: {e}")
    yield


app = FastAPI(title="KlaSetu Backend API", lifespan=lifespan)

# Allow all development origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for bucket images
app.mount("/bucket", StaticFiles(directory="bucket"), name="bucket")

# Register routers
app.include_router(user_router)
app.include_router(market_router)


def _save_upload_to_temp(upload: UploadFile, suffix: str) -> str:
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        shutil.copyfileobj(upload.file, tmp)
    finally:
        tmp.close()
    return tmp.name


@app.get("/health", status_code=status.HTTP_200_OK)
def health():
    return {"status": "ok", "service": "KlaSetu Backend"}


@app.post("/api/process-product")
async def process_product(
    image: UploadFile = File(...),
    audio: UploadFile = File(...),
    language: str = Form("hi"),
    material_cost: float = Form(0.0),
    labour_cost: float = Form(0.0),
    title: str = Form(""),
    category: str = Form(""),
):
    """
    Runs the full artisan listing pipeline:
    1. Enhances the craft image and persists it into the bucket folder.
    2. Transcribes voice description in any Indian regional language.
    3. Generates curated English & Hindi product title, bullet points, tags.
    4. Calculates fair pricing with fair artisan margins.
    """
    if language not in SUPPORTED_LANGUAGES:
        language = "hi"
    if material_cost < 0 or labour_cost < 0:
        raise HTTPException(400, "material_cost and labour_cost must be non-negative")

    image_path = _save_upload_to_temp(image, suffix=Path(image.filename or "img.jpg").suffix)
    audio_path = _save_upload_to_temp(audio, suffix=Path(audio.filename or "audio.ogg").suffix)

    try:
        result = await compiled_graph.ainvoke({
            "raw_image_path": image_path,
            "audio_path": audio_path,
            "language": language,
            "material_cost": material_cost,
            "labour_cost": labour_cost,
        })
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"Pipeline failed: {e}")
    finally:
        Path(image_path).unlink(missing_ok=True)
        Path(audio_path).unlink(missing_ok=True)

    enhancement = result.get("enhancement_result", {})
    listing = result.get("listing_draft")
    pricing = result.get("pricing_breakdown")

    # Persist enhanced image to bucket with unique filename
    unique_name = f"enhanced_{uuid.uuid4().hex[:12]}.webp"
    bucket_target = BUCKET_DIR / unique_name
    src_webp = Path("output_image.webp")

    if src_webp.exists():
        shutil.copyfile(src_webp, bucket_target)
        enhanced_rel_path = f"/bucket/{unique_name}"
    else:
        enhanced_rel_path = "/bucket/placeholder.webp"

    return JSONResponse({
        "warnings": enhancement.get("warnings", []),
        "blur_score": enhancement.get("blur_score", 0.0),
        "analysis": enhancement.get("analysis", {}).model_dump() if hasattr(enhancement.get("analysis"), "model_dump") else {},
        "enhanced_image_path": enhanced_rel_path,
        "enhanced_image_url": enhanced_rel_path,
        "listing": listing.model_dump() if listing else {},
        "pricing": pricing.model_dump() if pricing else {},
    })


@app.get("/output_image.webp")
def get_output_image():
    image_path = Path("output_image.webp")
    if not image_path.exists():
        raise HTTPException(404, "Enhanced image not found")
    return FileResponse("output_image.webp", media_type="image/webp")


@app.post("/api/price-only")
def price_only(
    material_cost: float = Form(...),
    labour_cost: float = Form(...),
    category: str = Form("other"),
):
    if material_cost < 0 or labour_cost < 0:
        raise HTTPException(400, "material_cost and labour_cost must be non-negative")
    breakdown = calculate_price(material_cost, labour_cost, category)
    return breakdown.model_dump()