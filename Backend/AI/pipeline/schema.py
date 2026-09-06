from typing import TypedDict, Literal, Optional, List, Any
from pydantic import BaseModel, Field


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