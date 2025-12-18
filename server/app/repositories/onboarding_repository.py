from typing import Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.onboarding import OnboardingModel
from datetime import datetime


class OnboardingRepository:
    """Repository for onboarding data access"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.onboarding
    
    async def create(self, onboarding_data: dict) -> OnboardingModel:
        """Create onboarding data"""
        result = await self.collection.insert_one(onboarding_data)
        onboarding = await self.collection.find_one({"_id": result.inserted_id})
        return OnboardingModel(**onboarding)
    
    async def get_by_user_id(self, user_id: str) -> Optional[OnboardingModel]:
        """Get onboarding data by user ID"""
        if not ObjectId.is_valid(user_id):
            return None
        onboarding = await self.collection.find_one({"user_id": ObjectId(user_id)})
        if onboarding:
            return OnboardingModel(**onboarding)
        return None
    
    async def update(self, user_id: str, update_data: dict) -> Optional[OnboardingModel]:
        """Update onboarding data"""
        update_data["updated_at"] = datetime.utcnow()
        result = await self.collection.update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": update_data},
            upsert=True
        )
        onboarding = await self.collection.find_one({"user_id": ObjectId(user_id)})
        if onboarding:
            return OnboardingModel(**onboarding)
        return None

