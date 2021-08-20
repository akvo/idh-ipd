from os import environ
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

TESTING = environ.get("TESTING")
print(TESTING)
DATABASE_URL = environ.get("DATABASE_URL")
DB_URL = f"{DATABASE_URL}_test" if TESTING else DATABASE_URL

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


