import enum
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Enum, DateTime

Base = declarative_base()


class UserRole(enum.Enum):
    user = 'user'
    admin = 'admin'


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    role = Column(Enum(UserRole))
    created = Column(DateTime, default=datetime.utcnow)
