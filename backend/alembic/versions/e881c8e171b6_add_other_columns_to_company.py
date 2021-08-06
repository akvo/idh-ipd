"""add_other_columns_to_company

Revision ID: e881c8e171b6
Revises: ea4745e6041d
Create Date: 2021-08-06 02:00:42.394245

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'e881c8e171b6'
down_revision = 'ea4745e6041d'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('company',
                  sa.Column('net_income', sa.Integer(), nullable=True))
    op.add_column('company', sa.Column('hh_income',
                                       sa.Integer(),
                                       nullable=True))


def downgrade():
    op.drop_column('company', 'net_income')
    op.drop_column('company', 'hh_income')
