from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict, field_validator


class OnboardingModel(BaseModel):
    """Onboarding database model"""
    id: str = Field(alias="_id")
    user_id: str
    brand_name: str
    industry: str
    logo_url: Optional[str] = None
    logo_position: str
    typography: str
    color_palette: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @field_validator('id', 'user_id', mode='before')
    @classmethod
    def convert_objectid_to_str(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

