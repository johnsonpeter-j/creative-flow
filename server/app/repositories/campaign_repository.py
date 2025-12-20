from typing import Optional, List
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.campaign import CampaignModel
from app.core.exceptions import NotFoundError
from datetime import datetime


class CampaignRepository:
    """Repository for campaign data access"""
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db.campaigns
    
    async def create(self, campaign_data: dict) -> CampaignModel:
        """Create a new campaign"""
        result = await self.collection.insert_one(campaign_data)
        campaign = await self.collection.find_one({"_id": result.inserted_id})
        return CampaignModel(**campaign)
    
    async def get_by_id(self, campaign_id: str) -> Optional[CampaignModel]:
        """Get campaign by ID"""
        if not ObjectId.is_valid(campaign_id):
            return None
        campaign = await self.collection.find_one({"_id": ObjectId(campaign_id)})
        if campaign:
            return CampaignModel(**campaign)
        return None
    
    async def get_by_user_id(self, user_id: str) -> List[CampaignModel]:
        """Get all campaigns for a user"""
        campaigns = []
        cursor = self.collection.find({"user_id": user_id})
        async for campaign in cursor:
            campaigns.append(CampaignModel(**campaign))
        return campaigns
    
    async def update(self, campaign_id: str, update_data: dict) -> Optional[CampaignModel]:
        """Update campaign"""
        if not ObjectId.is_valid(campaign_id):
            return None
        
        update_data["updated_at"] = datetime.utcnow()
        result = await self.collection.update_one(
            {"_id": ObjectId(campaign_id)},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            campaign = await self.collection.find_one({"_id": ObjectId(campaign_id)})
            if campaign:
                return CampaignModel(**campaign)
        return None
    
    async def delete(self, campaign_id: str) -> bool:
        """Delete campaign"""
        if not ObjectId.is_valid(campaign_id):
            return False
        
        result = await self.collection.delete_one({"_id": ObjectId(campaign_id)})
        return result.deleted_count > 0

