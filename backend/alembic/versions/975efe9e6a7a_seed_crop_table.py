"""seed_crop_table

Revision ID: 975efe9e6a7a
Revises: 795dad6cc0ad
Create Date: 2021-08-06 06:05:17.497914

"""
from alembic import op
import sqlalchemy as sa
import json


# revision identifiers, used by Alembic.
revision = '975efe9e6a7a'
down_revision = '795dad6cc0ad'
branch_labels = None
depends_on = None


def upgrade():
    with open('./data/crop_list.json') as d:
        data = json.load(d)
    meta = sa.MetaData(bind=op.get_bind())
    services = sa.Table('crop', meta, autoload=True)
    op.bulk_insert(services, [{"name": d} for d in data], multiinsert=True)


def downgrade():
    op.execute("TRUNCATE table crop CASCADE")
    op.execute("ALTER SEQUENCE crop_id_seq RESTART WITH 1")
