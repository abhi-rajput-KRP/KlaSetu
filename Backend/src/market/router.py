import os
import uuid
import shutil
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from utils.database import get_db
from utils.auth_helper import get_current_user, get_optional_user, require_artisan
from src.users.models import UserModel
from src.market.models import ProductModel, OrderModel
from src.market.DTO import (
    ProductCreateDTO,
    ProductUpdateDTO,
    ProductResponseDTO,
    ProductStockUpdateDTO,
    OrderCreateDTO,
    OrderStatusUpdateDTO,
    OrderResponseDTO,
)

market_router = APIRouter(prefix="/market", tags=["Market & Products"])

BUCKET_DIR = Path("bucket")
BUCKET_DIR.mkdir(exist_ok=True, parents=True)

@market_router.post("/upload-image")
async def upload_product_image(file: UploadFile = File(...)):
    """
    Saves an uploaded product photo directly to the Backend bucket folder
    and returns the relative URL to access it (/bucket/{filename}).
    """
    suffix = Path(file.filename or "photo.jpg").suffix or ".jpg"
    filename = f"prod_{uuid.uuid4().hex[:12]}{suffix}"
    filepath = BUCKET_DIR / filename

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "url": f"/bucket/{filename}",
        "filename": filename,
        "content_type": file.content_type,
    }


@market_router.get("/products", response_model=List[ProductResponseDTO])
def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    artisan_id: Optional[uuid.UUID] = None,
    db: Session = Depends(get_db),
):
    query = db.query(ProductModel)

    if category and category.lower() not in ("all", "all crafts"):
        query = query.filter(ProductModel.category.ilike(f"%{category}%"))

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ProductModel.name.ilike(term),
                ProductModel.maker.ilike(term),
                ProductModel.category.ilike(term),
                ProductModel.material.ilike(term),
                ProductModel.description.ilike(term),
            )
        )

    if artisan_id:
        query = query.filter(ProductModel.artisan_id == artisan_id)

    products = query.order_by(ProductModel.created_at.desc()).all()
    return products


@market_router.get("/products/{product_id}", response_model=ProductResponseDTO)
def get_product(product_id: uuid.UUID, db: Session = Depends(get_db)):
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@market_router.post("/products", response_model=ProductResponseDTO, status_code=status.HTTP_201_CREATED)
def create_product(
    data: ProductCreateDTO,
    user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Only artisans or authenticated users posting to their store
    product = ProductModel(
        name=data.name.strip(),
        category=data.category.strip(),
        maker=user.store_name or user.name or data.maker,
        location=user.location or data.location,
        price=data.price,
        original_price=data.original_price or round(data.price * 1.25, 2),
        material=data.material or "",
        technique=data.technique or "",
        in_stock=data.in_stock or 12,
        min_threshold=data.min_threshold or 5,
        status=data.status or "active",
        rating=data.rating or 5.0,
        reviews_count=data.reviews_count or 0,
        badge=data.badge or "New Craft",
        is_featured=data.is_featured if data.is_featured is not None else True,
        lead_time=data.lead_time or "Ready to ship in 2 days",
        image=data.image,
        gallery=data.gallery if data.gallery else [data.image],
        description=data.description or "",
        description_hi=data.description_hi or "",
        story=data.story or "",
        dimensions=data.dimensions or "",
        weight=data.weight or "",
        tags=data.tags or [],
        artisan_id=user.id,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@market_router.put("/products/{product_id}", response_model=ProductResponseDTO)
def update_product(
    product_id: uuid.UUID,
    data: ProductUpdateDTO,
    user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Update provided fields
    fields = data.model_dump(exclude_unset=True)
    for field, value in fields.items():
        if value is not None:
            setattr(product, field, value)

    if "in_stock" in fields and fields["in_stock"] is not None:
        product.status = "active" if fields["in_stock"] > 0 else "out_of_stock"

    db.commit()
    db.refresh(product)
    return product


@market_router.delete("/products/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(
    product_id: uuid.UUID,
    user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product removed successfully", "id": str(product_id)}


@market_router.put("/products/{product_id}/stock", response_model=ProductResponseDTO)
def update_product_stock(
    product_id: uuid.UUID,
    stock_data: ProductStockUpdateDTO,
    user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.in_stock = stock_data.in_stock
    product.status = "active" if stock_data.in_stock > 0 else "out_of_stock"
    db.commit()
    db.refresh(product)
    return product


# Orders APIs
@market_router.post("/orders", response_model=OrderResponseDTO, status_code=status.HTTP_201_CREATED)
def create_order(
    data: OrderCreateDTO,
    user: Optional[UserModel] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    order_num = f"KS-ORD-{uuid.uuid4().hex[:6].upper()}"
    new_order = OrderModel(
        id=order_num,
        customer_id=user.id if user else None,
        customer_name=data.customer_name.strip(),
        customer_email=data.customer_email.lower().strip(),
        shipping_address=data.shipping_address.strip(),
        city=data.city or "New Delhi",
        total_amount=data.total_amount,
        status="Processing",
        tracking_id=f"INDPOST-{uuid.uuid4().hex[:8].upper()}",
        items=[item.model_dump() for item in data.items],
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order


@market_router.get("/orders", response_model=List[OrderResponseDTO])
def get_orders(
    user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns relevant orders:
    - If user is a buyer: orders placed by them.
    - If user is an artisan: all store orders or orders placed by them.
    """
    if user.user_type == "artisan":
        # For an artisan, show all store orders so they can manage fulfillments
        orders = db.query(OrderModel).order_by(OrderModel.created_at.desc()).all()
    else:
        orders = (
            db.query(OrderModel)
            .filter(
                or_(
                    OrderModel.customer_id == user.id,
                    OrderModel.customer_email == user.email,
                )
            )
            .order_by(OrderModel.created_at.desc())
            .all()
        )
    return orders


@market_router.put("/orders/{order_id}/status", response_model=OrderResponseDTO)
def update_order_status(
    order_id: str,
    data: OrderStatusUpdateDTO,
    user: UserModel = Depends(require_artisan),
    db: Session = Depends(get_db),
):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = data.status
    if data.tracking_id:
        order.tracking_id = data.tracking_id

    db.commit()
    db.refresh(order)
    return order
