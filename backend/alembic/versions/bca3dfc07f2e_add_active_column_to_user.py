"""add active column to user

Revision ID: bca3dfc07f2e
Revises: 113a4b4b1aef
Create Date: 2021-08-17 10:11:45.670548

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bca3dfc07f2e'
down_revision = '113a4b4b1aef'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user', sa.Column('active', sa.Boolean(), default=False))
    user = sa.table('user', sa.Column('active', sa.Boolean))
    op.execute(user.update().values({'active': True}))


def downgrade():
    op.drop_column('user', 'active')
