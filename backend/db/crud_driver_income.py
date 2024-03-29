from typing import List
from sqlalchemy.orm import Session
from .models import DriverIncome, DriverIncomeDict


def add_driver_income(session, data) -> DriverIncomeDict:
    session.add(data)
    session.commit()
    session.flush()
    session.refresh(data)
    return data


def get_driver_income(session: Session,
                      skip: int = 0,
                      limit: int = 100) -> List[DriverIncome]:
    return session.query(DriverIncome).offset(skip).limit(limit).all()


def get_driver_income_by_crop_country(session: Session, crop: int,
                                      country: int) -> DriverIncome:
    return session.query(DriverIncome).filter(
        DriverIncome.crop == crop and DriverIncome.country == country).first()
