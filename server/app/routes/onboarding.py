from fastapi import APIRouter, Depends, Form, File, UploadFile
from typing import Optional, List
from app.schemas.onboarding import OnboardingResponse
from app.services.onboarding_service import OnboardingService
from app.utils.dependencies import get_onboarding_service, get_current_user_id

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.post("", response_model=OnboardingResponse)
async def create_or_update_onboarding(
    brand_name: str = Form(...),
    industry: str = Form(...),
    logo_position: str = Form(...),
    typography: str = Form(...),
    color_palette: str = Form(...),  # JSON string
    font_type: Optional[str] = Form(None),
    address_line1: Optional[str] = Form(None),
    address_line2: Optional[str] = Form(None),
    city: Optional[str] = Form(None),
    zip: Optional[str] = Form(None),
    business_address_type: Optional[str] = Form(None),
    business_type: Optional[str] = Form(None),
    logo: Optional[UploadFile] = File(None),
    font_file: Optional[UploadFile] = File(None),
    user_id: str = Depends(get_current_user_id),
    onboarding_service: OnboardingService = Depends(get_onboarding_service)
):
    """Create or update onboarding data"""
    import json
    
    # Parse color palette JSON string
    try:
        color_palette_list = json.loads(color_palette)
        if not isinstance(color_palette_list, list):
            color_palette_list = []
    except (json.JSONDecodeError, TypeError):
        color_palette_list = []
    
    from app.schemas.onboarding import OnboardingRequest
    onboarding_data = OnboardingRequest(
        brand_name=brand_name,
        industry=industry,
        logo_position=logo_position,
        typography=typography,
        font_type=font_type,
        color_palette=color_palette_list,
        address_line1=address_line1,
        address_line2=address_line2,
        city=city,
        zip=zip,
        business_address_type=business_address_type,
        business_type=business_type
    )
    
    result = await onboarding_service.create_or_update_onboarding(
        user_id=user_id,
        onboarding_data=onboarding_data,
        logo_file=logo,
        font_file=font_file
    )
    
    return OnboardingResponse(**result)


@router.get("", response_model=OnboardingResponse)
async def get_onboarding(
    user_id: str = Depends(get_current_user_id),
    onboarding_service: OnboardingService = Depends(get_onboarding_service)
):
    """Get onboarding data for current user"""
    result = await onboarding_service.get_onboarding(user_id)
    
    if not result:
        return OnboardingResponse(message="No onboarding data found")
    
    return OnboardingResponse(**result)


