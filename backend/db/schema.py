from typing import Optional
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
    name: Optional[str] = None
    code: Optional[str] = None

    class Config:
        orm_mode = True


class CropBase(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


class CompanyBase(BaseModel):
    id: int
    name: str
    country: int
    crop: int
    land_size: Optional[float] = None
    price: Optional[float] = None
    yields: Optional[int] = None
    prod_cost: Optional[int] = None
    net_income: Optional[int] = None
    hh_income: Optional[int] = None
    other_income: Optional[int] = None
    living_income: Optional[int] = None
    living_income_gap: Optional[int] = None
    share_income: Optional[int] = None
    revenue: Optional[int] = None

    class Config:
        orm_mode = True
