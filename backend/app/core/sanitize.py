PROTOTYPE_POLLUTION_KEYS = {"__proto__", "constructor", "prototype", "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__"}


def sanitize_dict(obj: dict, path: str = "") -> dict:
    if not isinstance(obj, dict):
        return obj
    clean = {}
    for k, v in obj.items():
        if k in PROTOTYPE_POLLUTION_KEYS:
            continue
        new_path = f"{path}.{k}" if path else k
        if isinstance(v, dict):
            clean[k] = sanitize_dict(v, new_path)
        elif isinstance(v, list):
            clean[k] = [sanitize_dict(item, f"{new_path}[{i}]") if isinstance(item, dict) else item for i, item in enumerate(v)]
        else:
            clean[k] = v
    return clean


def sanitize_manual_snapshot(profile: dict, posts: list[dict]) -> tuple[dict, list[dict]]:
    clean_profile = sanitize_dict(profile)
    clean_posts = [sanitize_dict(post) for post in posts]
    return clean_profile, clean_posts