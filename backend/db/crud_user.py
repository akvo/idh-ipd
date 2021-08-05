from typing import List
from sqlalchemy.orm import Session
from .models import User, UserRole, UserDict


def add_user(session: Session, email: str, role: UserRole) -> UserDict:
    user = User(role=role, email=email)
    session.add(user)
    session.commit()
    session.flush()
    session.refresh(user)
    return user


def get_user(session: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return session.query(User).offset(skip).limit(limit).all()


def get_user_by_id(session: Session, id: int) -> User:
    return session.query(User).filter(User.id == id).first()
