from typing_extensions import TypedDict
import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Enum, DateTime
from .connection import Base


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


class CountryDict(TypedDict):
    id: int
    name: str


class Country(Base):
    __tablename__ = "country"
    id = Column(Integer, primary_key=True, index=True, nullable=True)
    name = Column(String, unique=True)

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


class Crop(Base):
    __tablename__ = "crop"
    id = Column(Integer, primary_key=True, index=True, nullable=True)
    name = Column(String, unique=True)

    def __init__(self, name: str):
        self.name = name

    def __repr__(self) -> int:
        return f"<Crop {self.id}>"

    @property
    def serialize(self) -> CropDict:
        return {"id": self.id, "name": self.name}
