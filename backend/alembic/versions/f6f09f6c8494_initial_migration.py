"""Initial migration

Revision ID: f6f09f6c8494
Revises:
Create Date: 2021-08-04 21:45:12.551875

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'f6f09f6c8494'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'user', sa.Column('id', sa.Integer()),
        sa.Column('email', sa.String()),
        sa.Column('role', sa.Enum('user', 'admin', name='userrole')),
        sa.Column('created', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'), sa.UniqueConstraint('email'))
    op.create_index(op.f('ix_user_id'), 'user', ['id'], unique=True)


def downgrade():
    op.drop_index(op.f('ix_user_id'), table_name='user')
    op.drop_table('user')
    op.execute('DROP TYPE userrole')
