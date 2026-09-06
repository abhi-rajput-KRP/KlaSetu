from datetime import datetime
import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, JSON, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from utils.database import Base


class ProductModel(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    maker = Column(String(255), nullable=False)
    location = Column(String(255), default="India", nullable=True)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    material = Column(String(255), nullable=True)
    technique = Column(String(255), nullable=True)
    in_stock = Column(Integer, default=12, nullable=False)
    min_threshold = Column(Integer, default=5, nullable=False)
    status = Column(String(50), default="active", nullable=False)  # 'active', 'out_of_stock', 'archived'
    rating = Column(Float, default=4.9, nullable=False)
    reviews_count = Column(Integer, default=0, nullable=False)
    badge = Column(String(100), default="Handcrafted", nullable=True)
    is_featured = Column(Boolean, default=True, nullable=False)
    lead_time = Column(String(100), default="Ready to ship in 2 days", nullable=True)
    image = Column(String(500), nullable=False)
    gallery = Column(JSON, default=list, nullable=True)
    description = Column(Text, nullable=True)
    description_hi = Column(Text, nullable=True)
    story = Column(Text, nullable=True)
    dimensions = Column(String(100), nullable=True)
    weight = Column(String(100), nullable=True)
    tags = Column(JSON, default=list, nullable=True)

    artisan_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class OrderModel(Base):
    __tablename__ = "orders"

    id = Column(String(100), primary_key=True)  # e.g. "KS-ORD-89421"
    customer_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    shipping_address = Column(Text, nullable=False)
    city = Column(String(100), default="", nullable=True)
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="Processing", nullable=False)  # 'Processing', 'Ready to Ship', 'In Transit', 'Delivered'
    tracking_id = Column(String(100), default="PENDING", nullable=True)
    items = Column(JSON, nullable=False)  # [{ id, name, price, quantity, image, artisan_id }]
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
