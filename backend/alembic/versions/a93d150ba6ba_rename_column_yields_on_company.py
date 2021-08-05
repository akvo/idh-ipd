"""rename_column_yields_on_company

Revision ID: a93d150ba6ba
Revises: 20b6be4721e7
Create Date: 2021-08-05 06:02:49.905106

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = 'a93d150ba6ba'
down_revision = '20b6be4721e7'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('company', 'yield', new_column_name='yields')


def downgrade():
    op.alter_column('company', 'yields', new_column_name='yield')
