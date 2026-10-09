import ipaddress
import re
import socket
from urllib.parse import urlparse

from fastapi import HTTPException

from app.models.profile_link import PLATFORMS


PRIVATE_IP_BLOCKLIST = [
    ipaddress.IPv4Network("10.0.0.0/8"),
    ipaddress.IPv4Network("172.16.0.0/12"),
    ipaddress.IPv4Network("192.168.0.0/16"),
    ipaddress.IPv4Network("127.0.0.0/8"),
    ipaddress.IPv4Network("169.254.0.0/16"),
    ipaddress.IPv6Network("::1/128"),
    ipaddress.IPv6Network("fc00::/7"),
    ipaddress.IPv6Network("fe80::/10"),
]

LOCAL_HOSTNAMES = {"localhost", "localhost.localdomain", "broadcasthost"}

_PATTERNS: dict[str, tuple[re.Pattern, int | None]] = {
    "github": (re.compile(r"^https?://(www\.)?github\.com/([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)/?\s*$", re.I), 2),
    "x": (re.compile(r"^https?://(www\.)?(x\.com|twitter\.com)/([A-Za-z0-9_]{1,15})/?\s*$", re.I), 3),
    "instagram": (re.compile(r"^https?://(www\.)?instagram\.com/([A-Za-z0-9._]{1,30})/?\s*$", re.I), 2),
    "facebook": (re.compile(r"^https?://(www\.)?facebook\.com/([A-Za-z0-9._-]+)/?\s*$", re.I), 2),
    "linkedin": (re.compile(r"^https?://(www\.)?linkedin\.com/in/([A-Za-z0-9_%-]+)/?\s*$", re.I), 2),
    "other": (re.compile(r"^https?://.+\..+", re.I), None),
}


def is_private_ip(host: str) -> bool:
    try:
        ip = ipaddress.ip_address(host)
        return any(ip in network for network in PRIVATE_IP_BLOCKLIST)
    except ValueError:
        return False


def resolve_to_private_ip(hostname: str) -> bool:
    try:
        for info in socket.getaddrinfo(hostname, None):
            ip = info[4][0]
            if is_private_ip(ip):
                return True
    except socket.gaierror:
        pass
    return False


def validate_url_no_ssrf(url: str) -> str:
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise HTTPException(422, "URL must use http or https scheme")
    if not parsed.hostname:
        raise HTTPException(422, "URL must have a hostname")
    hostname = parsed.hostname.lower()
    if hostname in LOCAL_HOSTNAMES:
        raise HTTPException(422, "URL points to a private/internal address")
    if is_private_ip(hostname):
        raise HTTPException(422, "URL points to a private/internal address")
    if resolve_to_private_ip(hostname):
        raise HTTPException(422, "URL resolves to a private/internal address")
    return url


def extract_handle(platform: str, url: str) -> str | None:
    pat, group = _PATTERNS[platform]
    m = pat.match(url.strip())
    if not m:
        return None
    return m.group(group) if group else None


def validate_link(platform: str, url: str) -> str:
    platform = platform.strip().lower()
    if platform not in PLATFORMS:
        raise HTTPException(422, f"platform must be one of {list(PLATFORMS)}")
    url = validate_url_no_ssrf(url.strip())
    if platform not in _PATTERNS or not _PATTERNS[platform][0].match(url):
        raise HTTPException(422, f"URL does not look like a {platform} profile URL")
    return platform