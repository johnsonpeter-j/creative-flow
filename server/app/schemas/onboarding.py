from typing import Optional, List
from pydantic import BaseModel, Field


class OnboardingRequest(BaseModel):
    """Onboarding request schema"""
    brand_name: str = Field(..., min_length=2, max_length=100)
    industry: str = Field(..., min_length=1, max_length=100)
    logo_position: str
    typography: str
    color_palette: List[str] = Field(default_factory=list)


class OnboardingDataResponse(BaseModel):
    """Onboarding data response schema"""
    id: str
    brand_name: str
    industry: str
    logo_url: Optional[str] = None
    logo_position: str
    typography: str
    color_palette: List[str]


class OnboardingResponse(BaseModel):
    """Onboarding response schema"""
    message: Optional[str] = None
    data: Optional[OnboardingDataResponse] = None

