"""create_access_table

Revision ID: 113a4b4b1aef
Revises: 975efe9e6a7a
Create Date: 2021-08-10 06:39:07.321295

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '113a4b4b1aef'
down_revision = '975efe9e6a7a'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'access', sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user', sa.Integer(), sa.ForeignKey('user.id')),
        sa.Column('company', sa.Integer(), sa.ForeignKey('company.id')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user', 'company'))
    op.create_index(op.f('ix_access_id'), 'access', ['id'], unique=True)


def downgrade():
    op.drop_index(op.f('ix_access_id'), table_name='access')
    op.drop_table('access')
