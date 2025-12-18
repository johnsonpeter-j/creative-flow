from fastapi import APIRouter, Depends
from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthResponse
)
from app.services.auth_service import AuthService
from app.utils.dependencies import get_auth_service, get_current_user_id

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse)
async def signup(
    signup_data: SignupRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user"""
    result = await auth_service.signup(signup_data)
    return AuthResponse(**result)


@router.post("/login", response_model=AuthResponse)
async def login(
    login_data: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Login user"""
    result = await auth_service.login(login_data)
    return AuthResponse(**result)


@router.post("/forgot-password")
async def forgot_password(
    forgot_password_data: ForgotPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Request password reset"""
    result = await auth_service.forgot_password(forgot_password_data)
    return result


@router.post("/reset-password")
async def reset_password(
    reset_password_data: ResetPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Reset password using token"""
    result = await auth_service.reset_password(reset_password_data)
    return result


@router.get("/verify", response_model=AuthResponse)
async def verify_token(
    user_id: str = Depends(get_current_user_id),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Verify JWT token and return user info"""
    result = await auth_service.verify_token(user_id)
    return AuthResponse(**result)


@router.post("/logout")
async def logout():
    """Logout user (client-side token removal)"""
    return {"message": "Logged out successfully"}

