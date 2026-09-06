import shutil
import tempfile
from pathlib import Path

from fastapi import FastAPI,status, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from utils.database import Base,engine
from src.users.router import user_router
from src.users.models import UserModel

from AI.pipeline.build_graph import compiled_graph, calculate_price, get_rembg_session, TranscriptionService, SUPPORTED_LANGUAGES
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm up both heavy singletons before accepting traffic, so the
    # first real request doesn't pay the cold-load cost and risk timing
    # out the tunnel/proxy.
    get_rembg_session()
    TranscriptionService.get_service()
    yield


Base.metadata.create_all(engine)
app = FastAPI(title="KlaSetu Backend")
app.include_router(user_router)

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _save_upload_to_temp(upload: UploadFile, suffix: str) -> str:
    """
    The pipeline's node functions (run_enhancement, transcribe_audio_node)
    expect local file paths, not in-memory bytes -- so every uploaded file
    gets written to a temp path first. Caller is responsible for cleanup.
    """
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        shutil.copyfileobj(upload.file, tmp)
    finally:
        tmp.close()
    return tmp.name

@app.get("/health", status_code=status.HTTP_200_OK)
def health():
    return {"status": "ok"}


@app.post("/api/process-product")
async def process_product(
    image: UploadFile = File(...),
    audio: UploadFile = File(...),
    language: str = Form(...),
    material_cost: float = Form(...),
    labour_cost: float = Form(...),
):
    """
    Runs the full pipeline: enhance image -> transcribe audio -> generate
    listing draft -> calculate price. Returns everything the app needs to
    show a review screen to the artisan.
    """
    if language not in SUPPORTED_LANGUAGES:
        raise HTTPException(400, f"Unsupported language '{language}'. Must be one of: {sorted(SUPPORTED_LANGUAGES)}")
    if material_cost < 0 or labour_cost < 0:
        raise HTTPException(400, "material_cost and labour_cost must be non-negative")

    image_path = _save_upload_to_temp(image, suffix=Path(image.filename or "img.jpg").suffix)
    audio_path = _save_upload_to_temp(audio, suffix=Path(audio.filename or "audio.ogg").suffix)

    try:
        result =await compiled_graph.ainvoke({
            "raw_image_path": image_path,
            "audio_path": audio_path,
            "language": language,
            "material_cost": material_cost,
            "labour_cost": labour_cost,
        })
    except Exception as e:
        raise HTTPException(500, f"Pipeline failed: {e}")
    finally:
        Path(image_path).unlink(missing_ok=True)
        Path(audio_path).unlink(missing_ok=True)

    enhancement =result["enhancement_result"]
    listing =result["listing_draft"]
    pricing =result["pricing_breakdown"]

    return JSONResponse({
        "warnings": enhancement["warnings"],
        "blur_score": enhancement["blur_score"],
        "analysis": enhancement["analysis"].model_dump(),
        "enhanced_image_path": "output_image.webp",  # see note below re: serving this
        "listing": listing.model_dump(),
        "pricing": pricing.model_dump(),
    })


@app.post("/api/price-only")
def price_only(
    material_cost: float = Form(...),
    labour_cost: float = Form(...),
    category: str = Form(...),
):
    """
    Standalone pricing calculator -- lets your partner's app show a live
    price preview as the artisan types in cost fields, without re-running
    the whole image/audio pipeline every time.
    """
    if material_cost < 0 or labour_cost < 0:
        raise HTTPException(400, "material_cost and labour_cost must be non-negative")
    breakdown = calculate_price(material_cost, labour_cost, category)
    return breakdown.model_dump()