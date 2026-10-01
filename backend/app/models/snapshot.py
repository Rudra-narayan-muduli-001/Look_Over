from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Snapshot(Base):
    __tablename__ = "snapshots"
    __table_args__ = (Index("ix_snapshots_person_link_taken", "person_id", "link_id", "taken_at"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    person_id: Mapped[int] = mapped_column(ForeignKey("persons.id", ondelete="CASCADE"), nullable=False)
    link_id: Mapped[int | None] = mapped_column(
        ForeignKey("profile_links.id", ondelete="CASCADE"), nullable=True, default=None
    )
    platform: Mapped[str] = mapped_column(String(20), nullable=False)
    raw_json: Mapped[str] = mapped_column(Text, nullable=False, default="{}")
    hash: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    taken_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    trigger: Mapped[str] = mapped_column(String(20), nullable=False, default="manual")
