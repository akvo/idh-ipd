"""seed_country

Revision ID: ea4745e6041d
Revises: f1d3936e20c2
Create Date: 2021-08-05 23:48:46.859505

"""
from alembic import op
import pandas as pd
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ea4745e6041d'
down_revision = 'f1d3936e20c2'
branch_labels = None
depends_on = None


def upgrade():
    file = pd.read_json('./data/country_list.json')
    df = pd.DataFrame(file)
    df = df.dropna(subset=['name'])
    df = df.drop_duplicates(subset=['name'])
    df = df.drop_duplicates(subset=['code'])
    df['code'] = df['code'].astype(int)
    df['code'] = df['code'].astype(str)
    df = df[['code', 'name']]
    df = df.to_dict("records")
    meta = sa.MetaData(bind=op.get_bind())
    services = sa.Table('country', meta, autoload=True)
    op.bulk_insert(services, df, multiinsert=True)


def downgrade():
    op.execute("TRUNCATE table country CASCADE")
    op.execute("ALTER SEQUENCE country_id_seq RESTART WITH 1")
