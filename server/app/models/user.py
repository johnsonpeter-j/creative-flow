from datetime import datetime
from typing import Optional
from bson import ObjectId
from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator


class UserModel(BaseModel):
    """User database model"""
    id: str = Field(alias="_id")
    name: str
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    password_reset_token: Optional[str] = None
    password_reset_expires: Optional[datetime] = None

    @field_validator('id', mode='before')
    @classmethod
    def convert_objectid_to_str(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

