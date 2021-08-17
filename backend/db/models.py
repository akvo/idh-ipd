from typing import List
from typing_extensions import TypedDict
import enum
from datetime import datetime
from sqlalchemy import Column, Integer, Boolean, Float, String, Text, Enum, DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from .connection import Base

# BEGIN DRIVER INCOME


class DriverIncomeStatus(enum.Enum):
    feasible = 'feasible'
    current = 'current'


class DriverIncomeDict(TypedDict):
    id: int
    country: int
    crop: int
    status: DriverIncomeStatus
    area: float
    price: float
    cop_pha: int
    cop_pkg: float
    efficiency: int
    yields: int
    diversification: int
    revenue: int
    total_revenue: int
    net_income: int
    living_income: int
    source: str


class DriverIncome(Base):
    __tablename__ = "driver_income"
    id = Column(Integer, primary_key=True, index=True, nullable=True)
    country = Column(Integer, ForeignKey('country.id'))
    crop = Column(Integer, ForeignKey('crop.id'))
    status = Column(Enum(DriverIncomeStatus))
    area = Column(Float, nullable=True)
    price = Column(Float, nullable=True)
    cop_pha = Column(Integer, nullable=True)
    cop_pkg = Column(Float, nullable=True)
    efficiency = Column(Integer, nullable=True)
    yields = Column(Integer, nullable=True)
    diversification = Column(Integer, nullable=True)
    revenue = Column(Integer, nullable=True)
    total_revenue = Column(Integer, nullable=True)
    net_income = Column(Integer, nullable=True)
    living_income = Column(Integer, nullable=True)
    source = Column(Text, nullable=True)

    def __init__(
        self,
        country: int,
        crop: int,
        status: DriverIncomeStatus,
        area: float,
        price: float,
        cop_pha: int,
        cop_pkg: float,
        efficiency: int,
        yields: int,
        diversification: int,
        revenue: int,
        total_revenue: int,
        net_income: int,
        living_income: int,
        source: str,
    ):
        self.country = country
        self.crop = crop
        self.status = status
        self.area = area
        self.price = price
        self.cop_pha = cop_pha
        self.cop_pkg = cop_pkg
        self.efficiency = efficiency
        self.yields = yields
        self.diversification = diversification
        self.revenue = revenue
        self.total_revenue = total_revenue
        self.net_income = net_income
        self.living_income = living_income
        self.source = source

    def __repr__(self) -> int:
        return f"<DriverIncome {self.id}>"

    @property
    def serialize(self) -> DriverIncomeDict:
        return {
            "id": self.id,
            "country": self.country,
            "crop": self.crop,
            "status": self.status,
            "area": self.area,
            "price": self.price,
            "cop_pha": self.cop_pha,
            "cop_pkg": self.cop_pkg,
            "efficiency": self.efficiency,
            "yields": self.yields,
            "diversification": self.diversification,
            "revenue": self.revenue,
            "total_revenue": self.total_revenue,
            "net_income": self.net_income,
            "living_income": self.living_income,
            "source": self.source,
        }


# BEGIN COMPANY


class CompanyDict(TypedDict):
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


class Company(Base):
    __tablename__ = "company"
    id = Column(Integer, primary_key=True, index=True, nullable=True)
    name = Column(String, unique=True)
    country = Column(Integer, ForeignKey('country.id'))
    crop = Column(Integer, ForeignKey('crop.id'))
    land_size = Column(Float, nullable=True)
    price = Column(Float, nullable=True)
    yields = Column(Integer, nullable=True)
    prod_cost = Column(Integer, nullable=True)
    other_income = Column(Integer, nullable=True)
    living_income = Column(Integer, nullable=True)
    hh_income = Column(Integer, nullable=True)
    net_income = Column(Integer, nullable=True)

    def __init__(self, name: str, country: int, crop: int, land_size: float,
                 price: float, yields: int, prod_cost: int, other_income: int,
                 living_income: int, hh_income: int, net_income: int):
        self.name = name
        self.country = country
        self.crop = crop
        self.land_size = land_size
        self.price = price
        self.yields = yields
        self.prod_cost = prod_cost
        self.other_income = other_income
        self.living_income = living_income
        self.hh_income = hh_income
        self.net_income = net_income

    def __repr__(self) -> int:
        return f"<Company {self.id}>"

    @property
    def serialize(self) -> CompanyDict:
        return {
            "id": self.id,
            "name": self.name,
            "country": self.country,
            "crop": self.crop,
            "land_size": self.land_size,
            "price": self.price,
            "yields": self.yields,
            "prod_cost": self.prod_cost,
            "other_income": self.other_income,
            "living_income": self.living_income,
            "hh_income": self.hh_income,
            "net_income": self.net_income,
        }


# BEGIN COUNTRY


class CountryDict(TypedDict):
    id: int
    name: str
    code: str
    company: List[CompanyDict]


class Country(Base):
    __tablename__ = "country"
    id = Column(Integer, primary_key=True, index=True, nullable=True)
    name = Column(String, unique=True)
    code = Column(String)
    company = relationship("Company",
                           cascade="all, delete",
                           passive_deletes=True,
                           backref="company")

    def __init__(self, name: str, code: str):
        self.name = name
        self.code = code

    def __repr__(self) -> int:
        return f"<Country {self.id}>"

    @property
    def serialize(self) -> CountryDict:
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "company": self.company
        }


# BEGIN CROP


class CropDict(TypedDict):
    id: int
    name: str
    company: List[CompanyDict]


class Crop(Base):
    __tablename__ = "crop"
    id = Column(Integer, primary_key=True, index=True, nullable=True)
    name = Column(String, unique=True)
    company = relationship("Company",
                           cascade="all, delete",
                           passive_deletes=True)

    def __init__(self, name: str):
        self.name = name

    def __repr__(self) -> int:
        return f"<Crop {self.id}>"

    @property
    def serialize(self) -> CropDict:
        return {"id": self.id, "name": self.name, "company": self.company}


# BEGIN ACCESS


class AccessDict(TypedDict):
    id: int
    user: int
    company: int


class Access(Base):
    __tablename__ = "access"
    id = Column(Integer, primary_key=True, index=True, nullable=True)
    user = Column(Integer, ForeignKey('user.id'))
    company = Column(Integer, ForeignKey('company.id'))

    def __init__(self, user: int, company: int):
        self.user = user
        self.company = company

    def __repr__(self) -> int:
        return f"<Access {self.id}>"

    @property
    def serialize(self) -> AccessDict:
        return {"id": self.id, "user": self.user, "company": self.company}


# BEGIN USER


class UserRole(enum.Enum):
    user = 'user'
    admin = 'admin'


class UserDict(TypedDict):
    id: int
    email: str
    role: UserRole
    active: bool
    access: List[AccessDict]


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True, nullable=True)
    email = Column(String, unique=True)
    role = Column(Enum(UserRole))
    active = Column(Boolean, nullable=True, default=True)
    created = Column(DateTime, default=datetime.utcnow)
    access = relationship("Access",
                          cascade="all, delete",
                          passive_deletes=True,
                          backref="access")

    def __init__(self, email: str, role: UserRole, active: bool):
        self.email = email
        self.active = active
        self.role = role

    def __repr__(self) -> int:
        return f"<User {self.id}>"

    @property
    def serialize(self) -> UserDict:
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "active": self.active,
            "access": self.access
        }
