"""create_crop_table

Revision ID: e1b58b9d8cbf
Revises: 7c0a045820b7
Create Date: 2021-08-05 04:21:59.918859

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e1b58b9d8cbf'
down_revision = '7c0a045820b7'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'crop', sa.Column('id', sa.Integer()),
        sa.Column('name', sa.String()),
        sa.PrimaryKeyConstraint('id'), sa.UniqueConstraint('name'))
    op.create_index(op.f('ix_crop_id'), 'crop', ['id'], unique=True)


def downgrade():
    op.drop_index(op.f('ix_crop_id'), table_name='crop')
    op.drop_table('crop')
