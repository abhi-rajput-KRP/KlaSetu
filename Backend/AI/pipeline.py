# # from transformers import AutoModel
# # import torch, torchaudio
# # from huggingface_hub import login
# # import os
# # from dotenv import load_dotenv

# # load_dotenv()
# # hf=os.getenv("HF_TOKEN_KEY")
# # login(token=hf)

# # # Load the model
# # model = AutoModel.from_pretrained("ai4bharat/indic-conformer-600m-multilingual", trust_remote_code=True)

# # # Load an audio file
# # wav, sr = torchaudio.load("00-09.mp3")
# # wav = torch.mean(wav, dim=0, keepdim=True)

# # target_sample_rate = 16000  # Expected sample rate
# # if sr != target_sample_rate:
# #     resampler = torchaudio.transforms.Resample(orig_freq=sr, new_freq=target_sample_rate)
# #     wav = resampler(wav)

# # # Perform ASR with CTC decoding
# # transcription_ctc = model(wav, "hi", "ctc")
# # print("CTC Transcription:", transcription_ctc)

# # # Perform ASR with RNNT decoding
# # transcription_rnnt = model(wav, "hi", "rnnt")
# # print("RNNT Transcription:", transcription_rnnt)


# import io
# import os
# import threading

# import torch
# import torchaudio

# TARGET_SAMPLE_RATE = 16000
# MODEL_NAME = "ai4bharat/indic-conformer-600m-multilingual"

# SUPPORTED_LANGUAGES = {
#     "hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "or",
#     "as", "ur", "sa", "ks", "kok", "mai", "mni", "ne", "sd", "brx",
#     "doi", "gom", "sat", "en",
# }


# class TranscriptionService:
#     """
#     Singleton wrapper around the IndicConformer model. Load it once (this
#     happens on first use, or explicitly at FastAPI startup via `get_service()`),
#     and reuse the same in-memory model across every request.
#     """
#     _instance = None
#     _lock = threading.Lock()

#     def __init__(self):
#         from transformers import AutoModel
#         from huggingface_hub import login

#         hf_token = os.environ.get("HF_TOKEN")
#         if hf_token:
#             login(token=hf_token)

#         self.device = "cuda" if torch.cuda.is_available() else "cpu"
#         self.model = AutoModel.from_pretrained(MODEL_NAME, trust_remote_code=True)
#         self.model = self.model.to(self.device)
#         self.model.eval()

#     @classmethod
#     def get_service(cls) -> "TranscriptionService":
#         """Thread-safe singleton accessor -- call this from your FastAPI
#         dependency/startup hook, not `TranscriptionService()` directly."""
#         if cls._instance is None:
#             with cls._lock:
#                 if cls._instance is None:
#                     cls._instance = cls()
#         return cls._instance

#     def _prepare_waveform(self, wav: torch.Tensor, sr: int) -> torch.Tensor:
#         """Mono-mix + resample to the model's expected 16kHz, moved to the
#         correct device. Shared by both the file-path and bytes entry points
#         so this logic only exists once."""
#         wav = torch.mean(wav, dim=0, keepdim=True)  # stereo -> mono
#         if sr != TARGET_SAMPLE_RATE:
#             resampler = torchaudio.transforms.Resample(orig_freq=sr, new_freq=TARGET_SAMPLE_RATE)
#             wav = resampler(wav)
#         return wav.to(self.device)

#     def transcribe_path(self, audio_path: str, language: str, decoding: str = "rnnt") -> str:
#         wav, sr = torchaudio.load(audio_path)
#         return self._transcribe(wav, sr, language, decoding)

#     def transcribe_bytes(self, audio_bytes: bytes, language: str, decoding: str = "rnnt") -> str:
#         """
#         This is the one you'll actually call from FastAPI -- the artisan's
#         recorded voice note arrives as bytes (e.g. from UploadFile.read()),
#         not a path on disk.
#         """
#         buffer = io.BytesIO(audio_bytes)
#         wav, sr = torchaudio.load(buffer)
#         return self._transcribe(wav, sr, language, decoding)

#     def _transcribe(self, wav: torch.Tensor, sr: int, language: str, decoding: str) -> str:
#         if language not in SUPPORTED_LANGUAGES:
#             raise ValueError(
#                 f"Unsupported language code '{language}'. "
#                 f"Must be one of: {sorted(SUPPORTED_LANGUAGES)}"
#             )
#         if decoding not in ("ctc", "rnnt"):
#             raise ValueError(f"decoding must be 'ctc' or 'rnnt', got '{decoding}'")

#         wav = self._prepare_waveform(wav, sr)

#         with torch.no_grad():
#             transcription = self.model(wav, language, decoding)

#         return transcription


# def transcribe_audio(audio_bytes: bytes, language: str, decoding: str = "rnnt") -> str:
#     """
#     Entry point for the transcribe_audio_node in your product-listing graph.
#     Loads the model on first call (singleton), reuses it on every call after.
#     """
#     service = TranscriptionService.get_service()
#     return service.transcribe_bytes(audio_bytes, language=language, decoding=decoding)

# if __name__ == "__main__":
#     test_audio_path = "sheesham-rec3.mpeg.ogg"  # replace with a real test file
#     with open(test_audio_path, "rb") as f:
#         audio_bytes = f.read()

#     text = transcribe_audio(audio_bytes, language="hi", decoding="rnnt")
#     print("Transcription (RNNT):", text)

import os
import json
import base64
import threading
from typing import TypedDict, Literal, Optional, List, Any

import cv2
import numpy as np
import torch
import torchaudio
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from config import llm, vlm

ANALYSIS_PROMPT = """You are a photo quality inspector for a handicraft e-commerce listing.
Look at this product photo and return ONLY a JSON object, no extra text.

For "needs_bg_removal": set true unless the background is already a clean, flat,
seamless studio backdrop (solid color, no wrinkles, no shadows, no texture). Fabric,
wood tables, floors, wrinkled cloth, patterned surfaces, or anything with visible
shadow gradients all count as "needs removal" — a real background almost always does.

For "contains_extraneous_subject": true if a hand, arm, mannequin part, or any
non-product object is holding, touching, or overlapping the product itself
(not just present in the background). This matters even when the background
will be removed, because that hand/arm will remain in the cutout.

For "bg_tone": only relevant when needs_bg_removal is true. Pick whichever tone
will contrast well with the product. For metal items choose 'black' unless the piece itself is dark —
in that case prefer a light neutral instead so the piece doesn't disappear.

For "lighting_severity": "none" if lighting already looks even and well-lit,
"severe" only if it's badly patchy or very dark/harsh.

set_reflection: true If the product in the image is metal item with no 
extraneous_subject in the background. Also set the image bg_tone to black.
"""

CLAHE_CLIP_BY_SEVERITY = {"none": 1.0, "mild": 1.5, "moderate": 2.5, "severe": 4.0}

BG_COLOR_BY_TONE = {
    "white": (250, 250, 250),
    "light_gray": (235, 235, 235),
    "warm_beige": (225, 235, 245),
    "cool_gray": (230, 228, 220),
    "charcoal": (35, 33, 30),
    "black": (12, 12, 12),
}

REFLECTION_CATEGORIES = {"metal", "jewelry"}

load_dotenv()

class ImageAnalysis(BaseModel):
    needs_bg_removal: bool = Field(default=False)
    is_blurry: bool = Field(default=False)
    brightness_adjustment: int = Field(default=0)
    contrast_adjustment: float = Field(default=1.0)
    subject_category: Literal["textile", "wood", "metal", "jewelry", "pottery", "other"] = Field(default="other")
    crop_needed: bool = Field(default=True)
    lighting_severity: Literal["none", "mild", "moderate", "severe"] = Field(default="mild")
    bg_tone: Literal["white", "light_gray", "warm_beige", "cool_gray", "charcoal", "black"] = Field(default="light_gray")
    contains_extraneous_subject: bool = Field(default=False)
    set_reflection: bool =Field(default=False, description="Enables the reflection of metal item")
    notes: str = Field(default="")


def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def analyze_image_with_vlm(image_path: str) -> ImageAnalysis:
    from langchain_core.messages import HumanMessage

    base64_image = encode_image(image_path)
    message = HumanMessage(
        content=[
            {"type": "text", "text": ANALYSIS_PROMPT},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}},
        ]
    )
    structured_vlm = vlm.with_structured_output(ImageAnalysis, method="json_mode")
    return structured_vlm.invoke([message])


def blur_score(cv_img: np.ndarray) -> float:
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(gray, cv2.CV_64F).var()

_rembg_session = None
_rembg_lock = threading.Lock()
 
# u2net (~176MB) instead of bria-rmbg-2.0 (~1GB) -- much lighter, good
# general-purpose quality. Only switch to a heavier/higher-quality model
# once you've confirmed your deployment target actually has the RAM for it.
REMBG_MODEL_NAME = "u2net"
 
 
def get_rembg_session():
    global _rembg_session
    if _rembg_session is None:
        with _rembg_lock:
            if _rembg_session is None:
                from rembg import new_session
                _rembg_session = new_session(
                    model_name=REMBG_MODEL_NAME,
                    providers=["CPUExecutionProvider"],
                )
    return _rembg_session

def remove_background_cv(bgr_img: np.ndarray) -> np.ndarray:
    from rembg import remove
    rgb_img = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2RGB)
    result_rgba = remove(rgb_img, session=get_rembg_session())
    bgr = cv2.cvtColor(result_rgba[:, :, :3], cv2.COLOR_RGB2BGR)
    alpha = result_rgba[:, :, 3]
    return cv2.merge([bgr[:, :, 0], bgr[:, :, 1], bgr[:, :, 2], alpha])


def auto_crop_to_subject_cv(bgra_img: np.ndarray, padding: int = 20) -> np.ndarray:
    alpha = bgra_img[:, :, 3]
    ys, xs = np.where(alpha > 0)
    if len(xs) == 0 or len(ys) == 0:
        return bgra_img
    h, w = bgra_img.shape[:2]
    left = max(int(xs.min()) - padding, 0)
    right = min(int(xs.max()) + padding, w)
    top = max(int(ys.min()) - padding, 0)
    bottom = min(int(ys.max()) + padding, h)
    return bgra_img[top:bottom, left:right]


def composite_on_background_cv(bgra_img: np.ndarray, bg_color) -> np.ndarray:
    h, w = bgra_img.shape[:2]
    bgr = bgra_img[:, :, :3].astype(float)
    alpha = (bgra_img[:, :, 3].astype(float) / 255.0)[:, :, None]
    background = np.full((h, w, 3), bg_color, dtype=float)
    blended = bgr * alpha + background * (1 - alpha)
    return blended.astype(np.uint8)


def correct_brightness_contrast(cv_img: np.ndarray, brightness: int, contrast: float) -> np.ndarray:
    return cv2.convertScaleAbs(cv_img, alpha=contrast, beta=brightness)


def apply_clahe(cv_img: np.ndarray, clip_limit: float = 2.0) -> np.ndarray:
    lab = cv2.cvtColor(cv_img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(8, 8))
    l_corrected = clahe.apply(l)
    merged = cv2.merge((l_corrected, a, b))
    return cv2.cvtColor(merged, cv2.COLOR_LAB2BGR)


def sharpen(cv_img: np.ndarray) -> np.ndarray:
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
    return cv2.filter2D(cv_img, -1, kernel)


def add_reflection_cv(composited_bgr, cutout_alpha, bg_color, fade_ratio: float = 0.35, start_opacity: float = 0.45) -> np.ndarray:
    h, w = composited_bgr.shape[:2]
    strip_h = max(1, int(h * fade_ratio * 1.5))
    flipped_img = cv2.flip(composited_bgr, 0)[:strip_h]
    flipped_alpha = cv2.flip(cutout_alpha, 0)[:strip_h].astype(float) / 255.0
    gradient = np.linspace(start_opacity, 0.0, strip_h).reshape(-1, 1)
    blend_alpha = (flipped_alpha * gradient)[:, :, None]
    flipped_img = cv2.GaussianBlur(flipped_img, (0, 0), sigmaX=2)
    bg_strip = np.full((strip_h, w, 3), bg_color, dtype=float)
    reflection_strip = (flipped_img.astype(float) * blend_alpha + bg_strip * (1 - blend_alpha)).astype(np.uint8)
    return np.vstack([composited_bgr, reflection_strip])


def add_canvas_margin_cv(img: np.ndarray, bg_color, margin_ratio: float = 0.12) -> np.ndarray:
    h, w = img.shape[:2]
    margin = max(1, int(min(h, w) * margin_ratio))
    # NOTE: left/right padding is 3x top/bottom here (3*margin vs margin) --
    # kept exactly as you had it since it looks like a deliberate asymmetric
    # framing choice, just flagging it in case it wasn't intentional.
    return cv2.copyMakeBorder(img, margin, margin, 3 * margin, 3 * margin, borderType=cv2.BORDER_CONSTANT, value=bg_color)


def run_enhancement(image_path: str) -> dict:
    warnings = []
    analysis = analyze_image_with_vlm(image_path)

    with open(image_path, "rb") as f:
        raw_bytes = f.read()
    file_bytes = np.frombuffer(raw_bytes, dtype=np.uint8)
    original_bgr = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    score = blur_score(original_bgr)
    if analysis.is_blurry or score < 100:
        warnings.append("Photo looks blurry — consider retaking with better focus/lighting.")

    if analysis.needs_bg_removal:
        cutout_bgra = remove_background_cv(original_bgr)
    else:
        alpha = np.full(original_bgr.shape[:2], 255, dtype=np.uint8)
        cutout_bgra = cv2.merge([original_bgr[:, :, 0], original_bgr[:, :, 1], original_bgr[:, :, 2], alpha])

    if analysis.crop_needed:
        cutout_bgra = auto_crop_to_subject_cv(cutout_bgra)

    bg_color = BG_COLOR_BY_TONE[analysis.bg_tone]
    composited_bgr = composite_on_background_cv(cutout_bgra, bg_color=bg_color)

    corrected = correct_brightness_contrast(composited_bgr, analysis.brightness_adjustment, analysis.contrast_adjustment)
    if analysis.lighting_severity != "none":
        clip_limit = CLAHE_CLIP_BY_SEVERITY[analysis.lighting_severity]
        corrected = apply_clahe(corrected, clip_limit=clip_limit)
    corrected = sharpen(corrected)

    should_add_reflection = (
        analysis.set_reflection
        and analysis.crop_needed
        and not analysis.contains_extraneous_subject
    )
    if should_add_reflection:
        corrected = add_reflection_cv(corrected, cutout_bgra[:, :, 3], bg_color=bg_color)

    if analysis.crop_needed:
        corrected = add_canvas_margin_cv(corrected, bg_color=bg_color)
    cv2.imwrite('output_image.webp', corrected)
    return {
        "enhanced_image": corrected,
        "analysis": analysis,
        "blur_score": score,
        "warnings": warnings,
    }


# ---------------------------------------------------------------------------
# PART 6 -- Transcription (your IndicConformer service, unchanged in logic)
# ---------------------------------------------------------------------------

TARGET_SAMPLE_RATE = 16000
MODEL_NAME = "ai4bharat/indic-conformer-600m-multilingual"

SUPPORTED_LANGUAGES = {
    "hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "or",
    "as", "ur", "sa", "ks", "kok", "mai", "mni", "ne", "sd", "brx",
    "doi", "gom", "sat", "en",
}


class TranscriptionService:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        from transformers import AutoModel
        from huggingface_hub import login

        hf_token = os.environ.get("HF_TOKEN")
        if hf_token:
            login(token=hf_token)

        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = AutoModel.from_pretrained(MODEL_NAME, trust_remote_code=True)
        self.model = self.model.to(self.device)
        self.model.eval()

    @classmethod
    def get_service(cls) -> "TranscriptionService":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    def _prepare_waveform(self, wav: torch.Tensor, sr: int) -> torch.Tensor:
        wav = torch.mean(wav, dim=0, keepdim=True)
        if sr != TARGET_SAMPLE_RATE:
            resampler = torchaudio.transforms.Resample(orig_freq=sr, new_freq=TARGET_SAMPLE_RATE)
            wav = resampler(wav)
        return wav.to(self.device)

    def transcribe_bytes(self, audio_bytes: bytes, language: str, decoding: str = "rnnt") -> str:
        import io
        buffer = io.BytesIO(audio_bytes)
        wav, sr = torchaudio.load(buffer)
        return self._transcribe(wav, sr, language, decoding)

    def _transcribe(self, wav: torch.Tensor, sr: int, language: str, decoding: str) -> str:
        if language not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported language code '{language}'. Must be one of: {sorted(SUPPORTED_LANGUAGES)}")
        if decoding not in ("ctc", "rnnt"):
            raise ValueError(f"decoding must be 'ctc' or 'rnnt', got '{decoding}'")
        wav = self._prepare_waveform(wav, sr)
        with torch.no_grad():
            transcription = self.model(wav, language, decoding)
        return transcription


def transcribe_audio(audio_bytes: bytes, language: str, decoding: str = "rnnt") -> str:
    service = TranscriptionService.get_service()
    return service.transcribe_bytes(audio_bytes, language=language, decoding=decoding)


# ---------------------------------------------------------------------------
# PART 8 -- Description generation (your Gemini-based code, unchanged in logic)
# ---------------------------------------------------------------------------

class ListingDraft(BaseModel):
    product_name_en: str = Field(description="Complete name of the product in english")
    product_name_hi: str = Field(description="Complete name of the product in natural Hindi (not a literal word-for-word translation)")
    description_en: str = Field(description="Bulleted description of the product in english")
    description_hi: str = Field(description="Bulleted description of the product in hindi")
    tags: List[str] = Field(description="5-8 SEO keywords, English -- used for search/discovery")
    detected_category: str = Field(description="e.g. 'wood', 'textile', 'jewelry', 'pottery', 'other'")
    detected_material: str = Field(description="Product material-- from the transcript")


DESCRIPTION_PROMPT_TEMPLATE = """You are helping a rural Indian artisan create an online product listing.
The artisan recorded a voice note describing their handmade product, which has been transcribed into text below. The text is in hindi.
Read the transcript directly --understand it in its original language and then generate the bulleted listing description in english and hindi.
Transcript:
\"\"\"{transcript}\"\"\"
Return ONLY a JSON object, no extra text.
"""

def generate_listing_draft_llm(transcript: str) -> ListingDraft:
    prompt = DESCRIPTION_PROMPT_TEMPLATE.format(transcript=transcript)
    structured_output_llm = llm.with_structured_output(ListingDraft)
    return structured_output_llm.invoke(prompt)


# ---------------------------------------------------------------------------
# PART 10-12 -- Pricing -- STUB ONLY, not built yet
# ---------------------------------------------------------------------------

CATEGORY_MARGIN = {
    "textile": 0.35,
    "wood": 0.40,
    "metal": 0.45,
    "jewelry": 0.50,
    "pottery": 0.35,
    "other": 0.30,
}


class PricingBreakdown(BaseModel):
    material_cost: float
    labour_cost: float
    base_cost: float
    category: str
    margin_pct: float
    final_price: float


def calculate_price(material_cost: float, labour_cost: float, category: str) -> PricingBreakdown:
    if material_cost < 0 or labour_cost < 0:
        raise ValueError("material_cost and labour_cost must be non-negative")

    normalized_category = category.strip().lower()
    margin = CATEGORY_MARGIN.get(normalized_category, CATEGORY_MARGIN["other"])

    base_cost = material_cost + labour_cost
    final_price = round(base_cost * (1 + margin), 2)

    return PricingBreakdown(
        material_cost=material_cost,
        labour_cost=labour_cost,
        base_cost=base_cost,
        category=normalized_category if normalized_category in CATEGORY_MARGIN else "other",
        margin_pct=margin * 100,
        final_price=final_price,
    )



# # ---------------------------------------------------------------------------
# # Graph state + nodes
# # ---------------------------------------------------------------------------

# class ProductState(TypedDict, total=False):
#     raw_image_path: str        # local file path -- see note (2) at top of file
#     audio_path: str            # local file path to the artisan's recorded voice note
#     language: str               # ISO code, e.g. "hi" -- from artisan's profile/selection
#     enhancement_result: dict    # output of run_enhancement: enhanced_image, analysis, blur_score, warnings
#     transcribed_text: str
#     listing_draft: ListingDraft
#     requires_approval: bool
#     predicted_price: Optional[float]


# def enhance_image_node(state: ProductState) -> dict:
#     result = run_enhancement(state["raw_image_path"])
#     return {"enhancement_result": result}


# def transcribe_audio_node(state: ProductState) -> dict:
#     with open(state["audio_path"], "rb") as f:
#         audio_bytes = f.read()
#     text = transcribe_audio(audio_bytes, language=state["language"], decoding="rnnt")
#     return {"transcribed_text": text}


# def generate_description_node(state: ProductState) -> dict:
#     draft = generate_listing_draft_llm(state["transcribed_text"])
#     return {"listing_draft": draft, "requires_approval": True}


# def predict_price_node(state: ProductState) -> dict:
#     price = pricing_model.predict(state)
#     return {"predicted_price": price}


# # ---------------------------------------------------------------------------
# # Compile the graph
# # ---------------------------------------------------------------------------

# graph = StateGraph(ProductState)
# graph.add_node("enhance_image", enhance_image_node)
# graph.add_node("transcribe_audio", transcribe_audio_node)
# graph.add_node("generate_description", generate_description_node)
# graph.add_node("predict_price", predict_price_node)

# graph.set_entry_point("enhance_image")
# graph.add_edge("enhance_image", "transcribe_audio")
# graph.add_edge("transcribe_audio", "generate_description")
# graph.add_edge("generate_description", "predict_price")
# graph.add_edge("predict_price", END)

# app = graph.compile()

# if __name__ == "__main__":
#     result = app.invoke({
#         "raw_image_path": "jhumka-img.jpeg",   # replace with a real local path
#         "audio_path": "jhumka-rec.ogg",     # replace with a real local path
#         "language": "hi",
#     })
#     print("Enhancement warnings:", result["enhancement_result"]["warnings"])
#     print("Transcribed text:", result["transcribed_text"])
#     print("Listing draft:", result["listing_draft"])
#     print("Predicted price:", result["predicted_price"])

class ProductState(TypedDict, total=False):
    raw_image_path: str
    audio_path: str
    language: str
    material_cost: float        
    labour_cost: float          
    enhancement_result: dict
    transcribed_text: str
    listing_draft: ListingDraft
    requires_approval: bool
    predicted_price: Optional[float]
    pricing_breakdown: Optional[PricingBreakdown]   # NEW


def enhance_image_node(state: ProductState) -> dict:
    result = run_enhancement(state["raw_image_path"])
    return {"enhancement_result": result}


def transcribe_audio_node(state: ProductState) -> dict:
    with open(state["audio_path"], "rb") as f:
        audio_bytes = f.read()
    text = transcribe_audio(audio_bytes, language=state["language"], decoding="rnnt")
    return {"transcribed_text": text}


def generate_description_node(state: ProductState) -> dict:
    draft = generate_listing_draft_llm(state["transcribed_text"])
    return {"listing_draft": draft, "requires_approval": True}


def predict_price_node(state: ProductState) -> dict:
    breakdown = calculate_price(
        material_cost=state["material_cost"],
        labour_cost=state["labour_cost"],
        category=state["listing_draft"].detected_category,
    )
    return {"predicted_price": breakdown.final_price, "pricing_breakdown": breakdown}


graph = StateGraph(ProductState)
graph.add_node("enhance_image", enhance_image_node)
graph.add_node("transcribe_audio", transcribe_audio_node)
graph.add_node("generate_description", generate_description_node)
graph.add_node("predict_price", predict_price_node)

graph.set_entry_point("enhance_image")
graph.add_edge("enhance_image", "transcribe_audio")
graph.add_edge("transcribe_audio", "generate_description")
# graph.add_edge("transcribe_audio", "predict_price")
graph.add_edge("generate_description", "predict_price")
graph.add_edge("predict_price", END)

compiled_graph = graph.compile()

if __name__ == "__main__":
    result = compiled_graph.invoke({
        "raw_image_path": "jhumka-img.jpeg",   
        "audio_path": "jhumka-rec.ogg",     
        "language": "hi",
        "material_cost": 500.0,
        "labour_cost": 50.0
    })
    print("Enhancement warnings:", result["enhancement_result"]["warnings"])
    print("Transcribed text:", result["transcribed_text"])
    print("Listing draft:", result["listing_draft"])
    print("Predicted price:", result["predicted_price"])