from datetime import datetime
import uuid
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from utils.database import Base


class UserModel(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    user_type = Column(String(50), default="buyer", nullable=False)  # 'buyer' or 'artisan'
    location = Column(String(255), default="", nullable=True)
    phone = Column(String(50), default="", nullable=True)
    craft_discipline = Column(String(255), default="", nullable=True)
    bio = Column(Text, default="", nullable=True)
    store_name = Column(String(255), default="", nullable=True)
    avatar = Column(String(500), default="", nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)