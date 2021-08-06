"""create_driver_income_table

Revision ID: 795dad6cc0ad
Revises: e881c8e171b6
Create Date: 2021-08-06 02:05:23.943466

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '795dad6cc0ad'
down_revision = 'e881c8e171b6'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'driver_income', sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('country', sa.Integer(), sa.ForeignKey('country.id')),
        sa.Column('crop', sa.Integer(), sa.ForeignKey('crop.id')),
        sa.Column('status', sa.Enum('current', 'feasible', name='di_status')),
        sa.Column('area', sa.Float(), nullable=True),
        sa.Column('price', sa.Float(), nullable=True),
        sa.Column('cop_pha', sa.Integer(), nullable=True),
        sa.Column('cop_pkg', sa.Float(), nullable=True),
        sa.Column('efficiency', sa.Integer(), nullable=True),
        sa.Column('yields', sa.Integer(), nullable=True),
        sa.Column('diversification', sa.Integer(), nullable=True),
        sa.Column('revenue', sa.Integer(), nullable=True),
        sa.Column('total_revenue', sa.Integer(), nullable=True),
        sa.Column('net_income', sa.Integer(), nullable=True),
        sa.Column('living_income', sa.Integer(), nullable=True),
        sa.Column('source', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id'), sa.UniqueConstraint('country', 'crop'))
    op.create_index(op.f('ix_driver_income_id'),
                    'driver_income', ['id'],
                    unique=True)


def downgrade():
    op.drop_index(op.f('ix_driver_income_id'), table_name='driver_income')
    op.drop_table('driver_income')
    op.execute('DROP TYPE di_status')
