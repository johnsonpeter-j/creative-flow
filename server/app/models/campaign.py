from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict, field_validator


class CampaignIdeaModel(BaseModel):
    """Individual campaign idea"""
    title: str
    description: str
    score: float
    reasoning: Optional[str] = None


class AdCopyModel(BaseModel):
    """Ad copy and visual direction model"""
    headline: str
    body: str
    call_to_action: str
    visual_direction: str
    image_url: Optional[str] = None


class CampaignModel(BaseModel):
    """Campaign database model"""
    id: str = Field(alias="_id")
    user_id: str
    campaign_brief: str
    objective: str
    target_audience: str
    ad_formats: List[str]
    
    # Generated ideas
    all_ideas: List[CampaignIdeaModel] = []
    top_ideas: List[CampaignIdeaModel] = []
    selected_idea_index: Optional[int] = None
    
    # Ad copy and visual direction
    ad_copy: Optional[AdCopyModel] = None
    
    # Metadata
    status: str = "draft"  # draft, ideas_generated, ad_copy_generated, completed
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator('id', mode='before')
    @classmethod
    def convert_objectid_to_str(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

