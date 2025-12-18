from typing import Optional
import os
import shutil
from pathlib import Path
from fastapi import UploadFile
from app.repositories.onboarding_repository import OnboardingRepository
from app.schemas.onboarding import OnboardingRequest
from app.core.config import settings
from app.core.exceptions import ValidationError
from datetime import datetime
import uuid


class OnboardingService:
    """Service for onboarding business logic"""
    
    def __init__(self, onboarding_repository: OnboardingRepository):
        self.onboarding_repository = onboarding_repository
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.upload_dir.mkdir(exist_ok=True)
    
    async def save_logo(self, file: UploadFile, user_id: str) -> str:
        """Save uploaded logo file"""
        # Validate file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in settings.ALLOWED_EXTENSIONS:
            raise ValidationError(f"File type not allowed. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}")
        
        # Validate file size
        file_content = await file.read()
        if len(file_content) > settings.MAX_UPLOAD_SIZE:
            raise ValidationError(f"File size exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB")
        
        # Generate unique filename
        filename = f"{user_id}_{uuid.uuid4()}{file_ext}"
        file_path = self.upload_dir / filename
        
        # Save file
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        # Return relative URL
        return f"/uploads/{filename}"
    
    async def create_or_update_onboarding(
        self,
        user_id: str,
        onboarding_data: OnboardingRequest,
        logo_file: Optional[UploadFile] = None
    ) -> dict:
        """Create or update onboarding data"""
        logo_url = None
        
        # Handle logo upload if provided
        if logo_file:
            logo_url = await self.save_logo(logo_file, user_id)
        
        # Check if onboarding data already exists
        existing = await self.onboarding_repository.get_by_user_id(user_id)
        
        onboarding_dict = {
            "user_id": user_id,
            "brand_name": onboarding_data.brand_name,
            "industry": onboarding_data.industry,
            "logo_position": onboarding_data.logo_position,
            "typography": onboarding_data.typography,
            "color_palette": onboarding_data.color_palette,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        if logo_url:
            onboarding_dict["logo_url"] = logo_url
        
        if existing:
            # Update existing
            onboarding = await self.onboarding_repository.update(user_id, onboarding_dict)
        else:
            # Create new
            onboarding = await self.onboarding_repository.create(onboarding_dict)
        
        return {
            "message": "Brand setup completed successfully",
            "data": {
                "id": str(onboarding.id),
                "brand_name": onboarding.brand_name,
                "industry": onboarding.industry,
                "logo_url": onboarding.logo_url,
                "logo_position": onboarding.logo_position,
                "typography": onboarding.typography,
                "color_palette": onboarding.color_palette
            }
        }
    
    async def get_onboarding(self, user_id: str) -> Optional[dict]:
        """Get onboarding data for user"""
        onboarding = await self.onboarding_repository.get_by_user_id(user_id)
        
        if not onboarding:
            return None
        
        return {
            "data": {
                "id": str(onboarding.id),
                "brand_name": onboarding.brand_name,
                "industry": onboarding.industry,
                "logo_url": onboarding.logo_url,
                "logo_position": onboarding.logo_position,
                "typography": onboarding.typography,
                "color_palette": onboarding.color_palette
            }
        }

