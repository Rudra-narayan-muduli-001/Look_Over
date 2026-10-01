from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Change(Base):
    __tablename__ = "changes"
    __table_args__ = (Index("ix_changes_person_seen_detected", "person_id", "seen", "detected_at"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    person_id: Mapped[int] = mapped_column(ForeignKey("persons.id", ondelete="CASCADE"), nullable=False)
    link_id: Mapped[int | None] = mapped_column(
        ForeignKey("profile_links.id", ondelete="CASCADE"), nullable=True, default=None
    )
    type: Mapped[str] = mapped_column(String(30), nullable=False)  # field_change | new_post | deleted
    field: Mapped[str | None] = mapped_column(String(100), nullable=True, default=None)
    old_value: Mapped[str | None] = mapped_column(Text, nullable=True, default=None)
    new_value: Mapped[str | None] = mapped_column(Text, nullable=True, default=None)
    detected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    seen: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
