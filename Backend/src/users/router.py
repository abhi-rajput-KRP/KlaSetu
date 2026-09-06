from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import Session
from pwdlib import PasswordHash

from utils.database import get_db
from utils.auth_helper import create_access_token, get_current_user
from src.users.models import UserModel
from src.users.DTO import (
    UserRegisterDTO,
    UserLoginDTO,
    UserUpdateDTO,
    UserResponseDTO,
    AuthResponseDTO,
)

user_router = APIRouter(prefix="/user", tags=["Users"])

password_hash = PasswordHash.recommended()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return password_hash.hash(password)


@user_router.post("/register", response_model=AuthResponseDTO, status_code=status.HTTP_201_CREATED)
def register(data: UserRegisterDTO, db: Session = Depends(get_db)):
    existing_user = db.query(UserModel).filter(UserModel.email == data.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered. Please sign in instead.",
        )

    # Validate role
    role = data.user_type.lower().strip() if data.user_type else "buyer"
    if role not in ("buyer", "artisan"):
        role = "buyer"

    hashed = get_password_hash(data.password)
    new_user = UserModel(
        name=data.name.strip(),
        email=data.email.lower().strip(),
        hashed_password=hashed,
        user_type=role,
        location=data.location or "",
        phone=data.phone or "",
        craft_discipline=data.craft_discipline or "",
        store_name=data.store_name or (f"{data.name.strip()}'s Atelier" if role == "artisan" else ""),
        bio=data.bio or "",
        avatar=f"https://api.dicebear.com/7.x/bottts/svg?seed={data.name.strip()}",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": str(new_user.id), "role": new_user.user_type})
    return AuthResponseDTO(
        access_token=token,
        token_type="bearer",
        user=UserResponseDTO.model_validate(new_user),
    )


@user_router.post("/login", response_model=AuthResponseDTO, status_code=status.HTTP_200_OK)
def login(data: UserLoginDTO, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == data.email.lower().strip()).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(data={"sub": str(user.id), "role": user.user_type})
    return AuthResponseDTO(
        access_token=token,
        token_type="bearer",
        user=UserResponseDTO.model_validate(user),
    )


@user_router.get("/me", response_model=UserResponseDTO, status_code=status.HTTP_200_OK)
def get_current_user_profile(user: UserModel = Depends(get_current_user)):
    return UserResponseDTO.model_validate(user)


@user_router.put("/me", response_model=UserResponseDTO, status_code=status.HTTP_200_OK)
def update_profile(
    data: UserUpdateDTO,
    user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.name is not None:
        user.name = data.name.strip()
    if data.location is not None:
        user.location = data.location.strip()
    if data.phone is not None:
        user.phone = data.phone.strip()
    if data.craft_discipline is not None:
        user.craft_discipline = data.craft_discipline.strip()
    if data.store_name is not None:
        user.store_name = data.store_name.strip()
    if data.bio is not None:
        user.bio = data.bio.strip()
    if data.avatar is not None:
        user.avatar = data.avatar.strip()

    db.commit()
    db.refresh(user)
    return UserResponseDTO.model_validate(user)


@user_router.get("/logout", status_code=status.HTTP_200_OK)
def logout():
    return {"message": "Logged out successfully"}