from typing import List
from sqlalchemy.orm import Session
from .models import User, UserRole, UserDict


def add_user(session: Session,
             email: str,
             role: UserRole,
             active: bool = False) -> UserDict:
    user = User(role=role, email=email, active=active)
    session.add(user)
    session.commit()
    session.flush()
    session.refresh(user)
    return user


def count(session: Session) -> int:
    return session.query(User).count()


def get_user(session: Session, skip: int = 0, limit: int = 10) -> List[User]:
    return session.query(User).offset(skip).limit(limit).all()


def get_user_by_id(session: Session, id: int) -> User:
    return session.query(User).filter(User.id == id).first()


def get_user_by_email(session: Session, email: str) -> User:
    return session.query(User).filter(User.email == email).first()
