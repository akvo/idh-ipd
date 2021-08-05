"""add_column_code_on_country

Revision ID: f1d3936e20c2
Revises: a93d150ba6ba
Create Date: 2021-08-05 12:03:23.102982

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f1d3936e20c2'
down_revision = 'a93d150ba6ba'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('country', sa.Column('code', sa.String()))


def downgrade():
    op.drop_column('country', 'code')
