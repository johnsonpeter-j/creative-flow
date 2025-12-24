from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class CampaignIdeaSchema(BaseModel):
    """Individual campaign idea schema"""
    title: str
    description: str
    score: float
    reasoning: Optional[str] = None


class CreateCampaignRequest(BaseModel):
    """Create campaign request schema"""
    campaign_brief: str = Field(..., min_length=10, max_length=1000)
    objective: str = Field(..., min_length=2, max_length=100)
    target_audience: str = Field(..., min_length=5, max_length=500)
    ad_formats: List[str] = Field(..., min_items=1)


class GenerateIdeasRequest(BaseModel):
    """Generate campaign ideas request schema"""
    campaign_id: str


class CampaignResponse(BaseModel):
    """Campaign response schema"""
    id: str
    user_id: str
    campaign_brief: str
    objective: str
    target_audience: str
    ad_formats: List[str]
    all_ideas: List[CampaignIdeaSchema] = []
    top_ideas: List[CampaignIdeaSchema] = []
    status: str
    created_at: str
    updated_at: str


class GenerateIdeasResponse(BaseModel):
    """Generate ideas response schema"""
    campaign_id: str
    top_ideas: List[CampaignIdeaSchema]
    message: str


class TextLayerSchema(BaseModel):
    """Text layer schema for ad design"""
    text: str
    type: str
    fontSize: int
    fontFamily: str
    fill: str
    left: float
    top: float
    fontWeight: str
    fontStyle: str
    textAlign: str


class AdCopySchema(BaseModel):
    """Ad copy and visual direction schema"""
    headline: str
    body: str
    call_to_action: str
    visual_direction: str
    image_url: Optional[str] = None
    text_layers: Optional[List[Dict[str, Any]]] = None


class GenerateAdCopyRequest(BaseModel):
    """Generate ad copy request schema"""
    campaign_id: str
    selected_idea_index: int = Field(..., ge=0, description="Index of selected idea from top_ideas")


class GenerateAdCopyResponse(BaseModel):
    """Generate ad copy response schema"""
    campaign_id: str
    ad_copy: AdCopySchema
    message: str


class CampaignResponse(BaseModel):
    """Campaign response schema"""
    id: str
    user_id: str
    campaign_brief: str
    objective: str
    target_audience: str
    ad_formats: List[str]
    all_ideas: List[CampaignIdeaSchema] = []
    top_ideas: List[CampaignIdeaSchema] = []
    selected_idea_index: Optional[int] = None
    ad_copy: Optional[AdCopySchema] = None
    status: str
    created_at: str
    updated_at: str


