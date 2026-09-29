"""Manual adapter: normalizes user-pasted {profile, posts} through the same pipeline."""

PROFILE_KEYS = ("display_name", "bio", "avatar", "followers", "following", "posts_count")


def normalize_snapshot(profile: dict | None, posts: list[dict] | None) -> tuple[dict, list[dict]]:
    prof = {k: (profile or {}).get(k) for k in PROFILE_KEYS}
    norm_posts = []
    for p in posts or []:
        if not isinstance(p, dict) or "id" not in p:
            continue
        norm_posts.append(
            {
                "id": str(p["id"]),
                "text": p.get("text"),
                "media": p.get("media") or [],
                "posted_at": p.get("posted_at"),
            }
        )
    return prof, norm_posts
