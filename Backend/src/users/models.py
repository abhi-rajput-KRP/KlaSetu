from sqlalchemy import Column,String,Integer,UUID
from utils.database import Base
import uuid

class UserModel(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    email = Column(String)
    hashed_password = Column(String)
    # location = Column(String)
    # user_type = Column(String)