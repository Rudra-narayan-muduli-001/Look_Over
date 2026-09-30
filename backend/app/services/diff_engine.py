class DiffEngine:
    FIELDS = ("display_name", "bio", "avatar", "followers", "following", "posts_count")

    @staticmethod
    def compare(
        prev_profile: dict | None,
        new_profile: dict,
        prev_post_ids: set[str],
        new_posts: list[dict],
    ) -> list[dict]:
        """First-ever snapshot (prev None) = baseline, emits no changes."""
        if prev_profile is None:
            return []
        changes: list[dict] = []
        for f in DiffEngine.FIELDS:
            old, new = (prev_profile or {}).get(f), (new_profile or {}).get(f)
            if old != new:
                changes.append(
                    {
                        "type": "field_change",
                        "field": f,
                        "old_value": None if old is None else str(old),
                        "new_value": None if new is None else str(new),
                    }
                )
        for p in new_posts or []:
            pid = str(p.get("id"))
            if pid not in prev_post_ids:
                changes.append(
                    {"type": "new_post", "field": "post", "old_value": None, "new_value": pid}
                )
        # ponytail: `deleted` skipped — only emit with full-list confidence, adapters don't claim it yet.
        return changes
