from pydantic import BaseModel
from .models import UserRole


class UserBase(BaseModel):
    id: int
    email: str
    role: UserRole

    class Config:
        orm_mode = True


class CountryBase(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class CropBase(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
