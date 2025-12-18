from typing import Optional
import os
import shutil
from pathlib import Path
from fastapi import UploadFile
from bson import ObjectId
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
    
    async def save_font_file(self, file: UploadFile, user_id: str) -> str:
        """Save uploaded font file"""
        # Validate file extension
        file_ext = Path(file.filename).suffix.lower()
        allowed_font_extensions = ['.woff', '.woff2', '.ttf', '.otf']
        if file_ext not in allowed_font_extensions:
            raise ValidationError(f"Font file type not allowed. Allowed types: {', '.join(allowed_font_extensions)}")
        
        # Validate file size (10MB for fonts)
        file_content = await file.read()
        max_font_size = 10 * 1024 * 1024  # 10MB
        if len(file_content) > max_font_size:
            raise ValidationError(f"Font file size exceeds maximum allowed size of 10MB")
        
        # Generate unique filename
        filename = f"{user_id}_font_{uuid.uuid4()}{file_ext}"
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
        logo_file: Optional[UploadFile] = None,
        font_file: Optional[UploadFile] = None
    ) -> dict:
        """Create or update onboarding data"""
        logo_url = None
        font_file_url = None
        
        # Handle logo upload if provided
        if logo_file:
            logo_url = await self.save_logo(logo_file, user_id)
        
        # Handle font file upload if provided
        if font_file:
            font_file_url = await self.save_font_file(font_file, user_id)
        
        # Check if onboarding data already exists
        existing = await self.onboarding_repository.get_by_user_id(user_id)
        
        onboarding_dict = {
            "user_id": ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id,
            "brand_name": onboarding_data.brand_name,
            "industry": onboarding_data.industry,
            "logo_position": onboarding_data.logo_position,
            "typography": onboarding_data.typography,
            "font_type": onboarding_data.font_type,
            "color_palette": onboarding_data.color_palette,
            "address_line1": onboarding_data.address_line1,
            "address_line2": onboarding_data.address_line2,
            "city": onboarding_data.city,
            "zip": onboarding_data.zip,
            "business_address_type": onboarding_data.business_address_type,
            "business_type": onboarding_data.business_type,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        if logo_url:
            onboarding_dict["logo_url"] = logo_url
        
        if font_file_url:
            onboarding_dict["font_file_url"] = font_file_url
        
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
                "font_type": onboarding.font_type,
                "font_file_url": onboarding.font_file_url,
                "color_palette": onboarding.color_palette,
                "address_line1": onboarding.address_line1,
                "address_line2": onboarding.address_line2,
                "city": onboarding.city,
                "zip": onboarding.zip,
                "business_address_type": onboarding.business_address_type,
                "business_type": onboarding.business_type
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
                "font_type": onboarding.font_type,
                "font_file_url": onboarding.font_file_url,
                "color_palette": onboarding.color_palette,
                "address_line1": onboarding.address_line1,
                "address_line2": onboarding.address_line2,
                "city": onboarding.city,
                "zip": onboarding.zip,
                "business_address_type": onboarding.business_address_type,
                "business_type": onboarding.business_type
            }
        }


