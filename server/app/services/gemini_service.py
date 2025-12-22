import google.generativeai as genai
from app.core.config import settings
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Initialize Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

async def generate_ad_copy(idea: str, formats: List[str]) -> str:
    """
    Generate ad copy for the given idea and formats using Gemini.
    """
    try:
        prompt = f"""
        Create ad copy for these formats: {", ".join(formats)}.
        
        For each format, provide:
        - Headline
        - Body
        - Call to Action (CTA)
        
        Idea: {idea}
        
        Format the output clearly for each ad format.
        """
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"Error generating ad copy: {str(e)}")
        raise e

async def score_execution(ad_content: str) -> Dict[str, Any]:
    """
    Score the quality of the generated ad content (Creative Director).
    Returns a score out of 10 and a decision (APPROVE/REJECT).
    """
    try:
        prompt = f"""
        Act as a strict Creative Director. Evaluate the following ad copy quality on a scale of 1 to 10.
        
        Criteria:
        - Clarity
        - Persuasiveness
        - Alignment with standard ad formats
        
        Ad Copy:
        {ad_content}
        
        Output stricly in this JSON format:
        {{
            "score": <number>,
            "reasoning": "<short explanation>"
        }}
        """
        
        response = model.generate_content(prompt)
        # Simple parsing logic - in production we'd want more robust JSON parsing
        # This assumes the model follows instructions well.
        
        text_response = response.text.strip()
        # Clean up code blocks if present
        if text_response.startswith("```json"):
            text_response = text_response.replace("```json", "").replace("```", "")
        
        import json
        result = json.loads(text_response)
        
        score = result.get("score", 0)
        status = "APPROVED" if score >= 8 else "REJECTED"
        
        return {
            "score": score,
            "status": status,
            "reasoning": result.get("reasoning", "")
        }
            
    except Exception as e:
        logger.error(f"Error scoring execution: {str(e)}")
        # Fallback in case of parsing error
        return {
            "score": 0,
            "status": "ERROR",
            "reasoning": f"Failed to score: {str(e)}"
        }
