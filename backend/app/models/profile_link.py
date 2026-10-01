from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

PLATFORMS = ("github", "x", "instagram", "facebook", "linkedin", "other")


class ProfileLink(Base):
    __tablename__ = "profile_links"
    __table_args__ = (
        CheckConstraint(f"platform IN {PLATFORMS}", name="ck_profile_links_platform"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    person_id: Mapped[int] = mapped_column(
        ForeignKey("persons.id", ondelete="CASCADE"), nullable=False, index=True
    )
    platform: Mapped[str] = mapped_column(String(20), nullable=False)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    handle: Mapped[str | None] = mapped_column(String(200), nullable=True, default=None)
    last_status: Mapped[str] = mapped_column(String(30), default="never", nullable=False)
    last_checked_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, default=None)

    person: Mapped["Person"] = relationship(back_populates="links")
