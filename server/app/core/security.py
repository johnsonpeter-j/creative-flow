from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from app.core.config import settings
from app.core.exceptions import UnauthorizedError
import secrets


def _truncate_password_for_bcrypt(password: str) -> str:
    """
    Truncate password to ensure it's within bcrypt's 72-byte limit.
    Truncates character by character until byte length is <= 72.
    """
    if not password:
        return password
    
    # Check byte length
    password_bytes = password.encode('utf-8')
    
    # If already within limit, return as-is
    if len(password_bytes) <= 72:
        return password
    
    # Truncate character by character until we're under 72 bytes
    # This ensures we don't cut UTF-8 characters in the middle
    truncated = password
    while len(truncated.encode('utf-8')) > 72:
        if len(truncated) <= 1:
            # Safety: if we've truncated everything, return a single character
            return password[0] if password else "a"
        truncated = truncated[:-1]
    
    # Final verification
    final_bytes = truncated.encode('utf-8')
    if len(final_bytes) > 72:
        # Emergency: truncate bytes directly
        final_bytes = final_bytes[:72]
        # Remove incomplete UTF-8 sequences
        while final_bytes:
            try:
                return final_bytes.decode('utf-8')
            except UnicodeDecodeError:
                final_bytes = final_bytes[:-1]
        return password[0] if password else "a"
    
    return truncated


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    # Bcrypt has a 72-byte limit, so truncate if necessary
    plain_password = _truncate_password_for_bcrypt(plain_password)
    # Use bcrypt directly
    password_bytes = plain_password.encode('utf-8')
    hash_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hash_bytes)


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt"""
    # Bcrypt has a 72-byte limit, so truncate if necessary
    password = _truncate_password_for_bcrypt(password)
    
    # Encode to bytes for bcrypt
    password_bytes = password.encode('utf-8')
    
    # Final safety check: ensure password is definitely <= 72 bytes
    if len(password_bytes) > 72:
        # Emergency fallback: truncate bytes directly
        password_bytes = password_bytes[:72]
    
    # Use bcrypt directly instead of passlib to avoid initialization issues
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        raise UnauthorizedError("Invalid or expired token")


def generate_password_reset_token() -> str:
    """Generate a secure password reset token"""
    return secrets.token_urlsafe(32)


