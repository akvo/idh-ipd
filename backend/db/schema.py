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


class CompanyBase(BaseModel):
    id: int
    name: str
    country: int
    crop: int
    land_size: float
    price: float
    yields: int
    prod_cost: int
    other_income: int
    living_income: int

    class Config:
        orm_mode = True


class CompanyResponse(BaseModel):
    id: int
    name: str
    country: int
    crop: int
    land_size: float
    price: float
    yields: int
    prod_cost: int
    other_income: int
    living_income: int
    living_income: int
    revenue: int
    total_prod_cost: int
    net_income: int
    actual_household_income: int
    living_income_gap: int
    share_income: float
