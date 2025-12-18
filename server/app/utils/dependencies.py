from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.security import decode_access_token
from app.repositories.user_repository import UserRepository
from app.repositories.onboarding_repository import OnboardingRepository
from app.services.auth_service import AuthService
from app.services.onboarding_service import OnboardingService
from app.core.exceptions import UnauthorizedError

security = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Get current user ID from JWT token"""
    try:
        payload = decode_access_token(credentials.credentials)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise UnauthorizedError("Invalid token")
        return user_id
    except Exception as e:
        raise UnauthorizedError("Invalid or expired token")


def get_user_repository(db: AsyncIOMotorDatabase = Depends(get_database)) -> UserRepository:
    """Get user repository instance"""
    return UserRepository(db)


def get_onboarding_repository(db: AsyncIOMotorDatabase = Depends(get_database)) -> OnboardingRepository:
    """Get onboarding repository instance"""
    return OnboardingRepository(db)


def get_auth_service(
    user_repo: UserRepository = Depends(get_user_repository)
) -> AuthService:
    """Get auth service instance"""
    return AuthService(user_repo)


def get_onboarding_service(
    onboarding_repo: OnboardingRepository = Depends(get_onboarding_repository)
) -> OnboardingService:
    """Get onboarding service instance"""
    return OnboardingService(onboarding_repo)

