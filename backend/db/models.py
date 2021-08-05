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
