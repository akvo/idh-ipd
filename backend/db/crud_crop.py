from typing import List
from sqlalchemy.orm import Session
from .models import Crop, CropDict


def add_crop(session: Session, name: str) -> CropDict:
    crop = Crop(name=name)
    session.add(crop)
    session.commit()
    session.flush()
    session.refresh(crop)
    return crop


def get_crop(session: Session, skip: int = 0, limit: int = 100) -> List[Crop]:
    return session.query(Crop).offset(skip).limit(limit).all()


def get_crop_by_id(session: Session, id: int) -> Crop:
    return session.query(Crop).filter(Crop.id == id).first()


def get_company(session: Session) -> Crop:
    company = session.query(Crop).filter(Crop.company != None).all()
    return company


def get_name(session: Session, id: int) -> str:
    crop = session.query(Crop).filter(Crop.id == id).one()
    return crop.name
