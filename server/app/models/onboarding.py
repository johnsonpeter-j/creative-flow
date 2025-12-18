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
    font_type: Optional[str] = None  # 'dropdown' | 'google' | 'upload'
    font_file_url: Optional[str] = None  # URL to uploaded font file
    color_palette: List[str] = Field(default_factory=list)
    # Address fields
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    zip: Optional[str] = None
    business_address_type: Optional[str] = None  # 'registered' | 'operating'
    business_type: Optional[str] = None  # 'sole' | 'partnership' | 'llc' | 'corporation'
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


