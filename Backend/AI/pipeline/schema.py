from typing import TypedDict, Literal, Optional, List, Any
from pydantic import BaseModel, Field, field_validator


class ImageAnalysis(BaseModel):
    needs_bg_removal: bool = Field(default=False)
    is_blurry: bool = Field(default=False)
    brightness_adjustment: int = Field(default=0)
    contrast_adjustment: float = Field(default=1.0)
    subject_category: str = Field(default="other")
    crop_needed: bool = Field(default=True)
    lighting_severity: str = Field(default="none")
    bg_tone: Optional[str] = Field(default="white")
    contains_extraneous_subject: bool = Field(default=False)
    set_reflection: bool = Field(default=False, description="Enables the reflection of metal item")

    @field_validator("bg_tone", mode="before")
    @classmethod
    def validate_bg_tone(cls, v):
        if not v or not isinstance(v, str):
            return "white"
        v_clean = v.strip().lower()
        valid_tones = {
            "white", "cool_gray", "light_gray", "warm_beige", "charcoal", "black",
            "deep crimson", "canary yellow", "light spring green"
        }
        return v_clean if v_clean in valid_tones else "white"

    @field_validator("lighting_severity", mode="before")
    @classmethod
    def validate_lighting(cls, v):
        if not v or not isinstance(v, str):
            return "none"
        v_clean = v.strip().lower()
        return v_clean if v_clean in {"none", "mild", "moderate", "severe"} else "none"

    @field_validator("subject_category", mode="before")
    @classmethod
    def validate_category(cls, v):
        if not v or not isinstance(v, str):
            return "other"
        v_clean = v.strip().lower()
        return v_clean if v_clean in {"textile", "wood", "metal", "jewelry", "pottery", "other"} else "other"

    @field_validator("brightness_adjustment", mode="before")
    @classmethod
    def validate_brightness(cls, v):
        if v is None:
            return 0
        try:
            return int(v)
        except (ValueError, TypeError):
            return 0

    @field_validator("contrast_adjustment", mode="before")
    @classmethod
    def validate_contrast(cls, v):
        if v is None:
            return 1.0
        try:
            return float(v)
        except (ValueError, TypeError):
            return 1.0

    @field_validator("needs_bg_removal", "is_blurry", "crop_needed", "contains_extraneous_subject", "set_reflection", mode="before")
    @classmethod
    def validate_booleans(cls, v):
        if v is None:
            return False
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.strip().lower() in ("true", "1", "yes")
        return bool(v)


class ListingDraft(BaseModel):
    product_name_en: str = Field(description="Complete name of the product in english")
    product_name_hi: str = Field(description="Complete name of the product in natural Hindi (not a literal word-for-word translation)")
    description_en: str = Field(description="Bulleted description of the product in english")
    description_hi: str = Field(description="Bulleted description of the product in hindi")
    tags: List[str] = Field(description="5-8 SEO keywords, English -- used for search/discovery")
    detected_category: str = Field(description="e.g. 'wood', 'textile', 'jewelry', 'pottery', 'other'")
    detected_material: str = Field(description="Product material-- from the transcript")


class PricingBreakdown(BaseModel):
    material_cost: float
    labour_cost: float
    base_cost: float
    category: str
    margin_pct: float
    final_price: float


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
    pricing_breakdown: Optional[PricingBreakdown]