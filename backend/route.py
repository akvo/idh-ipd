from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import crud, models
from db.connection import SessionLocal, engine
from db.schema import UserBase
from db.models import UserRole

models.Base.metadata.create_all(bind=engine)
routes = APIRouter()


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@routes.get("/health-check")
def health_check():
    return "OK"


@routes.get("/")
def read_main():
    return {"message": "Hello World"}


@routes.post("/user/", response_model=UserBase, summary="add new user")
def add_user(email: str,
             role: UserRole,
             session: Session = Depends(get_session)):
    user = crud.add_user(session=session, email=email, role=role)
    return user


@routes.get("/user/", response_model=List[UserBase], summary="get all users")
def get_user(skip: int = 0,
             limit: int = 100,
             session: Session = Depends(get_session)):
    user = crud.get_user(session=session, skip=skip, limit=limit)
    return [i.serialize for i in user]


@routes.get("/user/{id:path}",
            response_model=UserBase,
            summary="get user detail")
def get_user_by_id(id: int, session: Session = Depends(get_session)):
    user = crud.get_user_by_id(session=session, id=id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user.serialize
