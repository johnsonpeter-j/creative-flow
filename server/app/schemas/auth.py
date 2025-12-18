from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    """Signup request schema"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)  # Bcrypt has 72-byte limit


class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    """Forgot password request schema"""
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Reset password request schema"""
    token: str
    password: str = Field(..., min_length=6, max_length=72)  # Bcrypt has 72-byte limit


class UserResponse(BaseModel):
    """User response schema"""
    id: str
    name: str
    email: str


class AuthResponse(BaseModel):
    """Auth response schema"""
    token: Optional[str] = None
    user: Optional[UserResponse] = None
    message: Optional[str] = None


