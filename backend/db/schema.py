from typing import Optional, List
from pydantic import BaseModel
from .models import UserRole, DriverIncomeStatus


class AccessBase(BaseModel):
    id: int
    user: int
    company: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    id: int
    email: str
    role: UserRole
    active: Optional[bool] = False
    email_verified: Optional[bool] = False
    picture: Optional[str] = None
    name: Optional[str] = None

    class Config:
        orm_mode = True


class UserResponse(BaseModel):
    current: int
    data: List[UserBase]
    total: int
    total_page: int


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
    total_prod_cost: Optional[int] = None
    net_income: Optional[int] = None
    hh_income: Optional[int] = None
    other_income: Optional[int] = None
    living_income: Optional[int] = None
    living_income_gap: Optional[int] = None
    share_income: Optional[int] = None
    revenue: Optional[int] = None

    class Config:
        orm_mode = True


class DriverIncomeBase(BaseModel):
    id: int
    country: int
    crop: int
    status: DriverIncomeStatus
    area: Optional[float] = None
    price: Optional[float] = None
    cop_pha: Optional[int] = None
    cop_pkg: Optional[float] = None
    efficiency: Optional[int] = None
    yields: Optional[int] = None
    diversification: Optional[int] = None
    revenue: Optional[int] = None
    total_revenue: Optional[int] = None
    net_income: Optional[int] = None
    living_income: Optional[int] = None
    source: Optional[str] = None

    class Config:
        orm_mode = True


class CountryCompanyBase(BaseModel):
    id: int
    name: str
    code: str
    company: List[CompanyBase]


class CropCompanyBase(BaseModel):
    id: int
    name: str
    company: List[CompanyBase]


class UserAccessBase(BaseModel):
    id: int
    email: str
    role: UserRole
    active: Optional[bool] = False
    access: List[AccessBase]

    class Config:
        orm_mode = True
