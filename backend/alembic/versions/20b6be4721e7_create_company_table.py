"""create_company_table

Revision ID: 20b6be4721e7
Revises: e1b58b9d8cbf
Create Date: 2021-08-05 04:22:07.472170

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20b6be4721e7'
down_revision = 'e1b58b9d8cbf'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'company', sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String()),
        sa.Column('country', sa.Integer(), sa.ForeignKey('country.id')),
        sa.Column('crop', sa.Integer(), sa.ForeignKey('crop.id')),
        sa.Column('land_size', sa.Float(), nullable=True),
        sa.Column('price', sa.Float(), nullable=True),
        sa.Column('yield', sa.Integer(), nullable=True),
        sa.Column('prod_cost', sa.Integer(), nullable=True),
        sa.Column('other_income', sa.Integer(), nullable=True),
        sa.Column('living_income', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id'), sa.UniqueConstraint('name'))
    op.create_index(op.f('ix_company_id'), 'company', ['id'], unique=True)


def downgrade():
    op.drop_index(op.f('ix_company_id'), table_name='company')
    op.drop_table('company')
