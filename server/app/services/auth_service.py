import os
from datetime import datetime, timedelta
from typing import Optional
from app.repositories.user_repository import UserRepository
from app.schemas.auth import SignupRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    generate_password_reset_token
)
from app.core.exceptions import UnauthorizedError, NotFoundError, ValidationError
from app.core.config import settings
from app.utils.email import send_email, FORGOT_PASSWORD


class AuthService:
    """Service for authentication business logic"""
    
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    async def signup(self, signup_data: SignupRequest) -> dict:
        """Register a new user"""
        user_data = {
            "name": signup_data.name,
            "email": signup_data.email,
            "hashed_password": get_password_hash(signup_data.password),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        user = await self.user_repository.create(user_data)
        
        # Create access token
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        
        return {
            "token": access_token,
            "user": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email
            }
        }
    
    async def login(self, login_data: LoginRequest) -> dict:
        """Authenticate user and return token"""
        user = await self.user_repository.get_by_email(login_data.email)
        
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise UnauthorizedError("Invalid email or password")
        
        if not user.is_active:
            raise UnauthorizedError("User account is inactive")
        
        # Create access token
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        
        return {
            "token": access_token,
            "user": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email
            }
        }
    
    async def forgot_password(self, forgot_password_data: ForgotPasswordRequest) -> dict:
        """Generate password reset token"""
        user = await self.user_repository.get_by_email(forgot_password_data.email)
        
        if not user:
            # Don't reveal if email exists for security
            return {"message": "If the email exists, a password reset link has been sent"}
        
        # Generate reset token
        reset_token = generate_password_reset_token()
        expires_at = datetime.utcnow() + timedelta(hours=settings.PASSWORD_RESET_TOKEN_EXPIRE_HOURS)
        
        await self.user_repository.update_password_reset_token(
            user.email,
            reset_token,
            expires_at
        )
        
        # Build reset password URL
        client_url = os.getenv("CLIENT_URL", "http://localhost:3000")
        reset_link = f"{client_url}/reset-password/{reset_token}"
        
        # Prepare email message data
        message_data = [
            {"key": "user_name", "value": user.name},
            {"key": "RESET_LINK", "value": reset_link}
        ]
        
        # Send password reset email
        try:
            send_email(
                to_address=user.email,
                subject="Reset Your Password - Creative Flow",
                body_type=FORGOT_PASSWORD,
                message_data=message_data
            )
        except Exception as e:
            # Log error but don't fail the request
            # In production, you might want to use a proper logging system
            print(f"Failed to send password reset email: {str(e)}")

        return {"message": "If the email exists, a password reset link has been sent"}
    
    async def reset_password(self, reset_password_data: ResetPasswordRequest) -> dict:
        """Reset user password using token"""
        user = await self.user_repository.get_by_reset_token(reset_password_data.token)
        
        if not user:
            raise ValidationError("Invalid or expired reset token")
        
        # Update password
        hashed_password = get_password_hash(reset_password_data.password)
        await self.user_repository.update_password(str(user.id), hashed_password)
        
        return {"message": "Password reset successfully"}
    
    async def verify_token(self, user_id: str) -> dict:
        """Verify token and return user info"""
        user = await self.user_repository.get_by_id(user_id)
        
        if not user:
            raise UnauthorizedError("User not found")
        
        if not user.is_active:
            raise UnauthorizedError("User account is inactive")
        
        return {
            "user": {
                "id": str(user.id),
                "name": user.name,
                "email": user.email
            }
        }
    
    async def update_profile(self, user_id: str, name: str) -> dict:
        """Update user profile"""
        user = await self.user_repository.get_by_id(user_id)
        
        if not user:
            raise UnauthorizedError("User not found")
        
        if not user.is_active:
            raise UnauthorizedError("User account is inactive")
        
        # Update user name
        updated_user = await self.user_repository.update(user_id, {"name": name, "updated_at": datetime.utcnow()})
        
        if not updated_user:
            raise NotFoundError("Failed to update user profile")
        
        return {
            "user": {
                "id": str(updated_user.id),
                "name": updated_user.name,
                "email": updated_user.email
            }
        }

