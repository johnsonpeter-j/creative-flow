from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Any
from app.services import gemini_service
import logging

router = APIRouter(
    prefix="/execution",
    tags=["Execution"]
)

logger = logging.getLogger(__name__)

class GenerateExecutionRequest(BaseModel):
    idea: str
    formats: List[str]

class ScoreExecutionRequest(BaseModel):
    ad_content: str

@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate_execution(request: GenerateExecutionRequest):
    """
    Generate ad copy based on an idea and requested formats.
    """
    try:
        if not request.idea:
            raise HTTPException(status_code=400, detail="Idea cannot be empty")
        
        ad_copy = await gemini_service.generate_ad_copy(request.idea, request.formats)
        return {"ad_copy": ad_copy}
    except Exception as e:
        logger.error(f"Generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/score", status_code=status.HTTP_200_OK)
async def score_execution(request: ScoreExecutionRequest):
    """
    Score the quality of an ad execution.
    """
    try:
        if not request.ad_content:
            raise HTTPException(status_code=400, detail="Ad content cannot be empty")
            
        result = await gemini_service.score_execution(request.ad_content)
        return result
    except Exception as e:
        logger.error(f"Scoring failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
