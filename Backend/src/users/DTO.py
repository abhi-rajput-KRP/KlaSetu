from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field


class UserRegisterDTO(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6)
    user_type: str = Field(default="buyer")  # 'buyer' or 'artisan'
    location: Optional[str] = ""
    phone: Optional[str] = ""
    craft_discipline: Optional[str] = ""
    store_name: Optional[str] = ""
    bio: Optional[str] = ""


class UserLoginDTO(BaseModel):
    email: EmailStr
    password: str


class UserUpdateDTO(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    craft_discipline: Optional[str] = None
    store_name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None


class UserResponseDTO(BaseModel):
    id: UUID
    name: str
    email: str
    user_type: str
    location: Optional[str] = ""
    phone: Optional[str] = ""
    craft_discipline: Optional[str] = ""
    store_name: Optional[str] = ""
    bio: Optional[str] = ""
    avatar: Optional[str] = ""
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AuthResponseDTO(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponseDTO