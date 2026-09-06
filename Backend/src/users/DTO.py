from pydantic import BaseModel

class UserDTO(BaseModel):
    name: str | None = "xyz"
    email :str
    password: str
    # user_type : str
    # location :str