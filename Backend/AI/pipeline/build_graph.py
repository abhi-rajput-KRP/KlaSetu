from utils.settings import settings
import json
import base64
import threading
import cv2
import numpy as np
import torch
import torchaudio
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from AI.config import llm, vlm, REMBG_MODEL_NAME, TARGET_SAMPLE_RATE, MODEL_NAME
from AI.pipeline.prompts import ANALYSIS_PROMPT, DESCRIPTION_PROMPT_TEMPLATE
from AI.pipeline.schema import ImageAnalysis, ListingDraft, PricingBreakdown, ProductState
from langchain_core.messages import HumanMessage
from rembg import remove
from transformers import AutoModel
from huggingface_hub import login
import io
import os
import shutil
import subprocess
from typing import Union

ffmpeg_dll_dir = r"C:\Users\ABHI RAJPUT\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin"
if hasattr(os, "add_dll_directory") and os.path.isdir(ffmpeg_dll_dir):
    try:
        os.add_dll_directory(ffmpeg_dll_dir)
    except Exception:
        pass

FFMPEG_CANDIDATE_PATHS = [
    shutil.which("ffmpeg"),
    os.path.join(ffmpeg_dll_dir, "ffmpeg.exe"),
    r"C:\ffmpeg\bin\ffmpeg.exe",
]
FFMPEG_BIN = next((p for p in FFMPEG_CANDIDATE_PATHS if p and os.path.isfile(p)), "ffmpeg")

load_dotenv()

CLAHE_CLIP_BY_SEVERITY = {"none": 1.0, "mild": 1.5, "moderate": 2.5, "severe": 4.0}

BG_COLOR_BY_TONE = {
    "white": (250, 250, 250),
    "light_gray": (235, 235, 235),
    "warm_beige": (220, 230, 240),
    "cool_gray": (230, 228, 220),
    "charcoal": (35, 33, 30),
    "black": (12, 12, 12),
    "deep crimson": (79, 1, 1),
    "canary yellow": (252, 243, 141),
    "light spring green": (110, 240, 130),
}

CATEGORY_MARGIN = {
    "textile": 0.35,
    "wood": 0.40,
    "metal": 0.45,
    "jewelry": 0.50,
    "pottery": 0.35,
    "other": 0.30,
}

SUPPORTED_LANGUAGES = {
    "hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "or",
    "as", "ur", "sa", "ks", "kok", "mai", "mni", "ne", "sd", "brx",
    "doi", "gom", "sat", "en",
}

def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def analyze_image_with_vlm(image_path: str) -> ImageAnalysis:
    try:
        base64_image = encode_image(image_path)
        message = HumanMessage(
            content=[
                {"type": "text", "text": ANALYSIS_PROMPT},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}},
            ]
        )
        structured_vlm = vlm.with_structured_output(ImageAnalysis, method="json_mode")
        return structured_vlm.invoke([message])
    except Exception as e:
        print(f"[WARN] VLM image analysis failed: {e}. Using fallback defaults.")
        return ImageAnalysis()


def blur_score(cv_img: np.ndarray) -> float:
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(gray, cv2.CV_64F).var()

_rembg_session = None
_rembg_lock = threading.Lock()
 
 
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

    tone_key = analysis.bg_tone.lower() if analysis.bg_tone else "white"
    bg_color = BG_COLOR_BY_TONE.get(tone_key, (250, 250, 250))
    composited_bgr = composite_on_background_cv(cutout_bgra, bg_color=bg_color)

    corrected = correct_brightness_contrast(composited_bgr, analysis.brightness_adjustment, analysis.contrast_adjustment)
    if analysis.lighting_severity and analysis.lighting_severity.lower() != "none":
        clip_limit = CLAHE_CLIP_BY_SEVERITY.get(analysis.lighting_severity.lower(), 1.5)
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


def load_audio_to_tensor(audio_input: Union[str, bytes], target_sr: int = TARGET_SAMPLE_RATE) -> torch.Tensor:
    """
    Decodes any audio format (ogg, mp3, wav, m4a, etc.) directly into a 16kHz
    mono float32 torch.Tensor of shape (1, T) using ffmpeg, avoiding torchaudio/torchcodec DLL issues.
    """
    cmd = [
        FFMPEG_BIN,
        "-y",
        "-i", audio_input if isinstance(audio_input, str) else "pipe:0",
        "-f", "f32le",
        "-ac", "1",
        "-ar", str(target_sr),
        "pipe:1"
    ]
    try:
        proc = subprocess.run(
            cmd,
            input=None if isinstance(audio_input, str) else audio_input,
            capture_output=True,
            check=True
        )
        arr = np.frombuffer(proc.stdout, dtype=np.float32).copy()
        if len(arr) == 0:
            return torch.zeros((1, target_sr), dtype=torch.float32)
        return torch.from_numpy(arr).unsqueeze(0)
    except Exception as e:
        print(f"[WARN] FFmpeg audio decoding failed ({e}). Attempting fallback decoding.")
        if isinstance(audio_input, bytes):
            buf = io.BytesIO(audio_input)
            wav, sr = torchaudio.load(buf)
        else:
            wav, sr = torchaudio.load(audio_input)
        wav = torch.mean(wav, dim=0, keepdim=True)
        if sr != target_sr:
            resampler = torchaudio.transforms.Resample(orig_freq=sr, new_freq=target_sr)
            wav = resampler(wav)
        return wav


class TranscriptionService:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        hf_token = settings.HF_TOKEN
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

    def transcribe(self, audio_input: Union[str, bytes], language: str, decoding: str = "rnnt") -> str:
        if language not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported language code '{language}'. Must be one of: {sorted(SUPPORTED_LANGUAGES)}")
        if decoding not in ("ctc", "rnnt"):
            raise ValueError(f"decoding must be 'ctc' or 'rnnt', got '{decoding}'")
        wav = load_audio_to_tensor(audio_input, TARGET_SAMPLE_RATE).to(self.device)
        with torch.no_grad():
            transcription = self.model(wav, language, decoding)
        return transcription

    def transcribe_bytes(self, audio_bytes: bytes, language: str, decoding: str = "rnnt") -> str:
        return self.transcribe(audio_bytes, language=language, decoding=decoding)


def transcribe_audio(audio_input: Union[str, bytes], language: str, decoding: str = "rnnt") -> str:
    service = TranscriptionService.get_service()
    return service.transcribe(audio_input, language=language, decoding=decoding)

def generate_listing_draft_llm(transcript: str) -> ListingDraft:
    prompt = DESCRIPTION_PROMPT_TEMPLATE.format(transcript=transcript)
    structured_output_llm = llm.with_structured_output(ListingDraft)
    return structured_output_llm.invoke(prompt)


def calculate_price(material_cost: float, labour_cost: float, category: str) -> PricingBreakdown:
    if material_cost < 0 or labour_cost < 0:
        raise ValueError("material_cost and labour_cost must be non-negative")

    normalized_category = (category or "").strip().lower()
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


def enhance_image_node(state: ProductState) -> dict:
    result = run_enhancement(state["raw_image_path"])
    return {"enhancement_result": result}


def transcribe_audio_node(state: ProductState) -> dict:
    audio_path = state.get("audio_path")
    try:
        text = transcribe_audio(audio_path, language=state.get("language", "hi"), decoding="rnnt")
    except Exception as e:
        print(f"[WARN] Transcription failed: {e}. Defaulting to empty transcript.")
        text = ""
    return {"transcribed_text": text}


def generate_description_node(state: ProductState) -> dict:
    transcript = state.get("transcribed_text", "")
    try:
        draft = generate_listing_draft_llm(transcript)
    except Exception as e:
        print(f"[WARN] LLM draft generation failed: {e}. Using fallback draft.")
        draft = ListingDraft(
            product_name_en="Handcrafted Artisan Product",
            product_name_hi="हस्तनिर्मित उत्पाद",
            description_en="Beautiful handcrafted product created with traditional techniques.",
            description_hi="पारंपरिक तकनीकों से बना सुंदर हस्तशिल्प उत्पाद।",
            tags=["handicraft", "handmade", "artisan", "traditional", "indian art"],
            detected_category="other",
            detected_material="traditional"
        )
    return {"listing_draft": draft, "requires_approval": True}


def predict_price_node(state: ProductState) -> dict:
    listing = state.get("listing_draft")
    category = getattr(listing, "detected_category", "other") if listing else "other"
    breakdown = calculate_price(
        material_cost=state.get("material_cost", 0.0),
        labour_cost=state.get("labour_cost", 0.0),
        category=category,
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
graph.add_edge("generate_description", "predict_price")
graph.add_edge("predict_price", END)

compiled_graph = graph.compile()

# if __name__ == "__main__":
#     result = compiled_graph.invoke({
#         "raw_image_path": "jhumka-img.jpeg",   
#         "audio_path": "jhumka-rec.ogg",     
#         "language": "hi",
#         "material_cost": 500.0,
#         "labour_cost": 50.0
#     })
#     print("Enhancement warnings:", result["enhancement_result"]["warnings"])
#     print("Transcribed text:", result["transcribed_text"])
#     print("Listing draft:", result["listing_draft"])
#     print("Predicted price:", result["predicted_price"])