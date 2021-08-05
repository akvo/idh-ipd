from pydantic import BaseModel
from .models import UserRole


class UserBase(BaseModel):
    id: int
    email: str
    role: UserRole

    class Config:
        orm_mode = True
