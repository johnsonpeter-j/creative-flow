from typing import Optional, List
from pydantic import BaseModel, Field


class OnboardingRequest(BaseModel):
    """Onboarding request schema"""
    brand_name: str = Field(..., min_length=2, max_length=100)
    industry: str = Field(..., min_length=1, max_length=100)
    logo_position: str
    typography: str
    font_type: Optional[str] = None  # 'dropdown' | 'google' | 'upload'
    color_palette: List[str] = Field(default_factory=list)
    # Address fields
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    zip: Optional[str] = None
    business_address_type: Optional[str] = None  # 'registered' | 'operating'
    business_type: Optional[str] = None  # 'sole' | 'partnership' | 'llc' | 'corporation'


class OnboardingDataResponse(BaseModel):
    """Onboarding data response schema"""
    id: str
    brand_name: str
    industry: str
    logo_url: Optional[str] = None
    logo_position: str
    typography: str
    font_type: Optional[str] = None
    font_file_url: Optional[str] = None
    color_palette: List[str]
    # Address fields
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    zip: Optional[str] = None
    business_address_type: Optional[str] = None
    business_type: Optional[str] = None


class OnboardingResponse(BaseModel):
    """Onboarding response schema"""
    message: Optional[str] = None
    data: Optional[OnboardingDataResponse] = None


