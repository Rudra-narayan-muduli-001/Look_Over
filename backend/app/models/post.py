from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Post(Base):
    __tablename__ = "posts"
    __table_args__ = (
        UniqueConstraint("link_id", "external_id", name="uq_posts_link_external"),
        Index("ix_posts_link_seen", "link_id", "first_seen_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    person_id: Mapped[int] = mapped_column(ForeignKey("persons.id", ondelete="CASCADE"), nullable=False)
    link_id: Mapped[int] = mapped_column(ForeignKey("profile_links.id", ondelete="CASCADE"), nullable=False)
    platform: Mapped[str] = mapped_column(String(20), nullable=False)
    external_id: Mapped[str] = mapped_column(String(200), nullable=False)
    text: Mapped[str | None] = mapped_column(Text, nullable=True, default=None)
    media_urls: Mapped[str] = mapped_column(Text, nullable=False, default="[]")  # JSON list
    posted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, default=None)
    first_seen_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
