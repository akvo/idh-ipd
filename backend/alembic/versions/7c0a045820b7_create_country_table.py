"""create_country_table

Revision ID: 7c0a045820b7
Revises: f6f09f6c8494
Create Date: 2021-08-05 03:46:03.463768

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7c0a045820b7'
down_revision = 'f6f09f6c8494'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'country', sa.Column('id', sa.Integer()),
        sa.Column('name', sa.String()),
        sa.PrimaryKeyConstraint('id'), sa.UniqueConstraint('name'))
    op.create_index(op.f('ix_country_id'), 'country', ['id'], unique=True)


def downgrade():
    op.drop_index(op.f('ix_country_id'), table_name='country')
    op.drop_table('country')
