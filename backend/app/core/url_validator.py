import ipaddress
import socket
from urllib.parse import urlparse

from fastapi import HTTPException


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


def validate_platform_url(platform: str, url: str) -> str:
    platform = platform.strip().lower()
    url = validate_url_no_ssrf(url.strip())
    return url