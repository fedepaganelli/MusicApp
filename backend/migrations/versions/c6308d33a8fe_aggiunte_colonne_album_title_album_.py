"""Aggiunte colonne album_title, album_cover e preview_url a Song

Revision ID: c6308d33a8fe
Revises: 
Create Date: 2025-04-01 15:29:53.995252

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c6308d33a8fe'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('song', schema=None) as batch_op:
        batch_op.add_column(sa.Column('album_cover', sa.String(length=255), nullable=False))
        batch_op.add_column(sa.Column('album_title', sa.String(length=255), nullable=False))
        batch_op.add_column(sa.Column('preview_url', sa.String(length=255), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('song', schema=None) as batch_op:
        batch_op.drop_column('preview_url')
        batch_op.drop_column('album_title')
        batch_op.drop_column('album_cover')

    # ### end Alembic commands ###
