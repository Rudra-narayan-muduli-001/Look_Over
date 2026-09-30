from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import models so tables register on Base.metadata (keep last).
from app.models import person as _person  # noqa: F401,E402
from app.models import profile_link as _profile_link  # noqa: F401,E402
from app.models import snapshot as _snapshot  # noqa: F401,E402
from app.models import post as _post  # noqa: F401,E402
from app.models import change as _change  # noqa: F401,E402
from app.models import check_run as _check_run  # noqa: F401,E402
