from typing import Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.user import UserModel
from app.core.exceptions import NotFoundError, ConflictError
from datetime import datetime


class UserRepository:
    """Repository for user data access"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.users
    
    async def create(self, user_data: dict) -> UserModel:
        """Create a new user"""
        # Check if user already exists
        existing_user = await self.collection.find_one({"email": user_data["email"]})
        if existing_user:
            raise ConflictError("User with this email already exists")
        
        result = await self.collection.insert_one(user_data)
        user = await self.collection.find_one({"_id": result.inserted_id})
        return UserModel(**user)
    
    async def get_by_email(self, email: str) -> Optional[UserModel]:
        """Get user by email"""
        user = await self.collection.find_one({"email": email})
        if user:
            return UserModel(**user)
        return None
    
    async def get_by_id(self, user_id: str) -> Optional[UserModel]:
        """Get user by ID"""
        if not ObjectId.is_valid(user_id):
            return None
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        if user:
            return UserModel(**user)
        return None
    
    async def update_password_reset_token(
        self, 
        email: str, 
        token: str, 
        expires_at: datetime
    ) -> bool:
        """Update password reset token"""
        result = await self.collection.update_one(
            {"email": email},
            {"$set": {
                "password_reset_token": token,
                "password_reset_expires": expires_at
            }}
        )
        return result.modified_count > 0
    
    async def get_by_reset_token(self, token: str) -> Optional[UserModel]:
        """Get user by password reset token"""
        user = await self.collection.find_one({
            "password_reset_token": token,
            "password_reset_expires": {"$gt": datetime.utcnow()}
        })
        if user:
            return UserModel(**user)
        return None
    
    async def update_password(self, user_id: str, hashed_password: str) -> bool:
        """Update user password"""
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "hashed_password": hashed_password,
                "password_reset_token": None,
                "password_reset_expires": None,
                "updated_at": datetime.utcnow()
            }}
        )
        return result.modified_count > 0
    
    async def update(self, user_id: str, update_data: dict) -> Optional[UserModel]:
        """Update user"""
        update_data["updated_at"] = datetime.utcnow()
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        if result.modified_count > 0:
            user = await self.collection.find_one({"_id": ObjectId(user_id)})
            if user:
                return UserModel(**user)
        return None

