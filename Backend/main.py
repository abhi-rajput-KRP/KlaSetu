from fastapi import FastAPI,status
from fastapi.middleware.cors import CORSMiddleware
from utils.database import Base,engine
from src.users.router import user_router
from src.users.models import UserModel

Base.metadata.create_all(engine)
app = FastAPI(title="KlaSetu Backend")
app.include_router(user_router)

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/status_detail", status_code=status.HTTP_200_OK)
def status_detail():
    return {"system":"alive"}