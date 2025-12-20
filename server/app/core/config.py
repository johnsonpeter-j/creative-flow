from pydantic_settings import BaseSettings
from typing import Optional, List
from pydantic import Field, computed_field
import json
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from server directory
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class Settings(BaseSettings):
    """Application settings - All values are loaded from environment variables"""
    
    # Application
    APP_NAME: str = Field(default="Creative Flow API", description="Application name")
    APP_VERSION: str = Field(default="1.0.0", description="Application version")
    DEBUG: bool = Field(default=False, description="Debug mode")
    
    # API
    API_V1_PREFIX: str = Field(default="/api", description="API v1 prefix")
    
    # MongoDB
    MONGODB_URL: str = Field(default="mongodb://localhost:27017", description="MongoDB connection URL")
    DATABASE_NAME: str = Field(default="creative_flow", description="Database name")
    
    # JWT
    SECRET_KEY: str = Field(default="", description="Secret key for JWT token signing (REQUIRED)")
    ALGORITHM: str = Field(default="HS256", description="JWT algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=1440, description="Access token expiration time in minutes")
    
    # Password Reset
    PASSWORD_RESET_TOKEN_EXPIRE_HOURS: int = Field(default=24, description="Password reset token expiration in hours")
    
    # File Upload
    UPLOAD_DIR: str = Field(default="uploads", description="Directory for file uploads")
    MAX_UPLOAD_SIZE: int = Field(default=5242880, description="Maximum upload size in bytes (5MB)")
    ALLOWED_EXTENSIONS_STR: str = Field(
        default=".jpg,.jpeg,.png,.svg,.gif",
        description="Comma-separated list of allowed file extensions (from env)"
    )
    
    # CORS
    CORS_ORIGINS_STR: str = Field(
        default="http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000",
        description="Comma-separated list of allowed CORS origins (from env)"
    )
    
    # Gemini AI
    GEMINI_API_KEY: str = Field(default="", description="Google Gemini API key (REQUIRED for campaign generation)")
    
    @computed_field
    @property
    def ALLOWED_EXTENSIONS(self) -> List[str]:
        """Parse allowed extensions from comma-separated string - Returns list"""
        if not self.ALLOWED_EXTENSIONS_STR:
            return [".jpg", ".jpeg", ".png", ".svg", ".gif"]
        
        try:
            # Try JSON first
            parsed = json.loads(self.ALLOWED_EXTENSIONS_STR)
            if isinstance(parsed, list):
                return parsed
        except (json.JSONDecodeError, TypeError):
            pass
        
        # Parse as comma-separated string
        return [ext.strip() for ext in self.ALLOWED_EXTENSIONS_STR.split(',') if ext.strip()]
    
    @computed_field
    @property
    def CORS_ORIGINS(self) -> List[str]:
        """Parse CORS origins from comma-separated string - Returns list"""
        if not self.CORS_ORIGINS_STR:
            return [
                "http://localhost:3000",
                "http://localhost:3001",
                "http://127.0.0.1:3000",
            ]
        
        try:
            # Try JSON first
            parsed = json.loads(self.CORS_ORIGINS_STR)
            if isinstance(parsed, list):
                return parsed
        except (json.JSONDecodeError, TypeError):
            pass
        
        # Parse as comma-separated string
        return [origin.strip() for origin in self.CORS_ORIGINS_STR.split(',') if origin.strip()]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from .env that don't match model fields


settings = Settings()

