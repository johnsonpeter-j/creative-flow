from pydantic_settings import BaseSettings
from typing import Optional, List
from pydantic import computed_field
import json
import os


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Creative Flow API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # API
    API_V1_PREFIX: str = "/api"
    
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "creative_flow"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Password Reset
    PASSWORD_RESET_TOKEN_EXPIRE_HOURS: int = 24
    
    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB
    
    # Store as strings to avoid JSON parsing issues - these will be parsed in computed properties
    ALLOWED_EXTENSIONS_STR: str = ".jpg,.jpeg,.png,.svg,.gif"
    CORS_ORIGINS_STR: str = "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000"
    
    @computed_field
    @property
    def ALLOWED_EXTENSIONS(self) -> List[str]:
        """Parse allowed extensions from string"""
        # Try to get from environment variable first, then from model field
        value = os.getenv('ALLOWED_EXTENSIONS') or getattr(self, 'ALLOWED_EXTENSIONS_STR', ".jpg,.jpeg,.png,.svg,.gif")
        if isinstance(value, str):
            try:
                # Try JSON first
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return parsed
            except (json.JSONDecodeError, TypeError):
                pass
            # Parse as comma-separated string
            return [ext.strip() for ext in value.split(',') if ext.strip()]
        return value if isinstance(value, list) else [".jpg", ".jpeg", ".png", ".svg", ".gif"]
    
    @computed_field
    @property
    def CORS_ORIGINS(self) -> List[str]:
        """Parse CORS origins from string"""
        # Try to get from environment variable first, then from model field
        value = os.getenv('CORS_ORIGINS') or getattr(self, 'CORS_ORIGINS_STR', "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000")
        if isinstance(value, str):
            try:
                # Try JSON first
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return parsed
            except (json.JSONDecodeError, TypeError):
                pass
            # Parse as comma-separated string
            return [origin.strip() for origin in value.split(',') if origin.strip()]
        return value if isinstance(value, list) else [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
        ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from .env that don't match model fields


settings = Settings()

