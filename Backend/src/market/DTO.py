from datetime import datetime
from typing import Optional, List, Any
from uuid import UUID
from pydantic import BaseModel, Field


class ProductCreateDTO(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    category: str = Field(...)
    maker: Optional[str] = "Master Artisan"
    location: Optional[str] = "India"
    price: float = Field(..., gt=0)
    original_price: Optional[float] = None
    material: Optional[str] = ""
    technique: Optional[str] = ""
    in_stock: Optional[int] = 12
    min_threshold: Optional[int] = 5
    status: Optional[str] = "active"
    rating: Optional[float] = 5.0
    reviews_count: Optional[int] = 0
    badge: Optional[str] = "Handcrafted"
    is_featured: Optional[bool] = True
    lead_time: Optional[str] = "Ready to ship in 2 days"
    image: str = Field(...)
    gallery: Optional[List[str]] = []
    description: Optional[str] = ""
    description_hi: Optional[str] = ""
    story: Optional[str] = ""
    dimensions: Optional[str] = ""
    weight: Optional[str] = ""
    tags: Optional[List[str]] = []


class ProductUpdateDTO(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    maker: Optional[str] = None
    location: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    material: Optional[str] = None
    technique: Optional[str] = None
    in_stock: Optional[int] = None
    min_threshold: Optional[int] = None
    status: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    badge: Optional[str] = None
    is_featured: Optional[bool] = None
    lead_time: Optional[str] = None
    image: Optional[str] = None
    gallery: Optional[List[str]] = None
    description: Optional[str] = None
    description_hi: Optional[str] = None
    story: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[str] = None
    tags: Optional[List[str]] = None


class ProductStockUpdateDTO(BaseModel):
    in_stock: int = Field(..., ge=0)


class ProductResponseDTO(BaseModel):
    id: UUID
    name: str
    category: str
    maker: str
    location: Optional[str] = "India"
    price: float
    original_price: Optional[float] = None
    material: Optional[str] = ""
    technique: Optional[str] = ""
    in_stock: int = 12
    min_threshold: int = 5
    status: str = "active"
    rating: float = 4.9
    reviews_count: int = 0
    badge: Optional[str] = "Handcrafted"
    is_featured: bool = True
    lead_time: Optional[str] = "Ready to ship in 2 days"
    image: str
    gallery: Optional[List[str]] = []
    description: Optional[str] = ""
    description_hi: Optional[str] = ""
    story: Optional[str] = ""
    dimensions: Optional[str] = ""
    weight: Optional[str] = ""
    tags: Optional[List[str]] = []
    artisan_id: Optional[UUID] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderItemDTO(BaseModel):
    id: Any
    name: str
    price: float
    quantity: int = 1
    image: Optional[str] = ""
    artisan_id: Optional[str] = None


class OrderCreateDTO(BaseModel):
    customer_name: str
    customer_email: str
    shipping_address: str
    city: Optional[str] = ""
    items: List[OrderItemDTO]
    total_amount: float


class OrderStatusUpdateDTO(BaseModel):
    status: str
    tracking_id: Optional[str] = None


class OrderResponseDTO(BaseModel):
    id: str
    customer_id: Optional[UUID] = None
    customer_name: str
    customer_email: str
    shipping_address: str
    city: Optional[str] = ""
    total_amount: float
    status: str
    tracking_id: Optional[str] = "PENDING"
    items: List[Any]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
