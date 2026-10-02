from app.services.diff_engine import DiffEngine

BASE = {
    "display_name": "Ada",
    "bio": "hello",
    "avatar": "a.png",
    "followers": 10,
    "following": 5,
    "posts_count": 3,
}


def test_baseline_emits_no_changes():
    assert DiffEngine.compare(None, dict(BASE), set(), [{"id": "p1"}]) == []


def test_field_change():
    new = dict(BASE, bio="world")
    changes = DiffEngine.compare(dict(BASE), new, set(), [])
    bio = [c for c in changes if c["type"] == "field_change" and c["field"] == "bio"]
    assert len(bio) == 1
    assert bio[0]["old_value"] == "hello" and bio[0]["new_value"] == "world"


def test_count_change():
    changes = DiffEngine.compare(dict(BASE), dict(BASE, followers=11), set(), [])
    assert any(c["type"] == "field_change" and c["field"] == "followers"
               and c["new_value"] == "11" for c in changes)


def test_new_post():
    changes = DiffEngine.compare(dict(BASE), dict(BASE), {"p1"}, [{"id": "p1"}, {"id": "p2"}])
    fresh = [c for c in changes if c["type"] == "new_post"]
    assert [c["new_value"] for c in fresh] == ["p2"]


def test_no_change():
    assert DiffEngine.compare(dict(BASE), dict(BASE), {"p1"}, [{"id": "p1"}]) == []
