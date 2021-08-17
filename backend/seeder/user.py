import os
import sys
from db.connection import SessionLocal, engine
from db import models
from db import crud_user, crud_company
from faker import Faker

if len(sys.argv) < 2:
    print("You should provide number of fake user")

if len(sys.argv) == 2:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.append(BASE_DIR)

    models.Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    fake = Faker()
    for i in range(int(sys.argv[1])):
        user = crud_user.add_user(session=session,
                                  email=fake.email(),
                                  role="user")
        print(f"{user.email} added")
        company = crud_company.get_company(session=session)
        access = []
        for c in [c.serialize for c in company]:
            access.append(models.Access(user=user.id, company=c['id']))
        session.add_all(access)
        session.commit()
    session.close()
