from datetime import datetime, timedelta, timezone
from typing import Optional
import uuid
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from utils.database import get_db
from utils.settings import settings

security = HTTPBearer(auto_error=False)

ACCESS_TOKEN_EXPIRE_DAYS = 7


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except (jwt.PyJWTError, Exception):
        return None


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    from src.users.models import UserModel

    try:
        user_uuid = uuid.UUID(user_id_str)
    except ValueError:
        user_uuid = user_id_str

    user = db.query(UserModel).filter(UserModel.id == user_uuid).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
):
    if not credentials:
        return None

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        return None

    user_id_str = payload.get("sub")
    if not user_id_str:
        return None

    from src.users.models import UserModel

    try:
        user_uuid = uuid.UUID(user_id_str)
    except ValueError:
        user_uuid = user_id_str

    user = db.query(UserModel).filter(UserModel.id == user_uuid).first()
    return user


async def require_artisan(user=Depends(get_current_user)):
    if getattr(user, "user_type", "") != "artisan":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Artisan privileges required to access this resource",
        )
    return user