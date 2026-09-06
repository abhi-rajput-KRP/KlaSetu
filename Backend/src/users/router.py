from fastapi import APIRouter,status,Depends,HTTPException
from sqlalchemy.orm import Session
from utils.auth_helper import get_current_user , supabase
from utils.database import get_db
from src.users.models import UserModel
from src.users.DTO import UserDTO
from pwdlib import PasswordHash
import jwt
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta

user_router = APIRouter(prefix="/user")

ACCESS_TOKEN_EXPIRE_DAYS=5

password_hash = PasswordHash.recommended()

def verify_password(plain_password:str, hashed_password:str):
    return password_hash.verify(plain_password, hashed_password)

def get_password_hash(password:str):
    return password_hash.hash(password)

@user_router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data:UserDTO,db:Session = Depends(get_db)):
    one_user = db.query(UserModel).filter_by(email=data.email).first()
    if one_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Email already registered")
    hashed_password = get_password_hash(data.password)
    new_user = UserModel(name=data.name, email=data.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    return login(data=data,db=db)

@user_router.post("/login", status_code=status.HTTP_200_OK)
def login(data:UserDTO,db:Session = Depends(get_db)):
    user = db.query(UserModel).filter_by(email=data.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Incorrect email")
    elif not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    else:
        return user.name

@user_router.get("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(user = Depends(get_current_user)):
    return {"message":"Logged out"}