from typing import List
from typing_extensions import TypedDict
import enum
from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, Enum, DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from .connection import Base


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

    def __init__(self, name: str, country: int, crop: int, land_size: float,
                 price: float, yields: int, prod_cost: int, other_income: int,
                 living_income: int):
        self.name = name
        self.country = country
        self.crop = crop
        self.land_size = land_size
        self.price = price
        self.yields = yields
        self.prod_cost = prod_cost
        self.other_income = other_income
        self.living_income = living_income

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
        }


class CountryDict(TypedDict):
    id: int
    name: str
    company: List[CompanyDict]


class Country(Base):
    __tablename__ = "country"
    id = Column(Integer, primary_key=True, index=True, nullable=True)
    name = Column(String, unique=True)
    company = relationship("Company",
                           cascade="all, delete",
                           passive_deletes=True)

    def __init__(self, name: str):
        self.name = name

    def __repr__(self) -> int:
        return f"<Country {self.id}>"

    @property
    def serialize(self) -> CountryDict:
        return {"id": self.id, "name": self.name}


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


class UserRole(enum.Enum):
    user = 'user'
    admin = 'admin'


class UserDict(TypedDict):
    id: int
    email: str
    role: UserRole


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True, nullable=True)
    email = Column(String, unique=True)
    role = Column(Enum(UserRole))
    created = Column(DateTime, default=datetime.utcnow)

    def __init__(self, email: str, role: UserRole):
        self.email = email
        self.role = role

    def __repr__(self) -> int:
        return f"<User {self.id}>"

    @property
    def serialize(self) -> UserDict:
        return {"id": self.id, "email": self.email, "role": self.role}
