from typing import List, Dict, Any, Optional
from pathlib import Path
import google.generativeai as genai
from app.core.config import settings
from app.schemas.campaign import CampaignIdeaSchema, AdCopySchema
from app.services.agent import CreativeTeamAgent, CreativeDirectorAgent
from app.services.agent.ad_copy_visual_agent import AdCopyVisualAgent


class CampaignService:
    """Service for campaign operations using multi-agent system"""
    
    def __init__(self):
        # Initialize Gemini API
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables. Please add it to your .env file.")
        
        genai.configure(api_key=api_key)
        self.text_model_name = "gemini-flash-latest"
        self.image_model_name = "gemini-2.5-flash-image"  # Model for image generation
        
        # Initialize text model for idea generation
        text_model = genai.GenerativeModel(self.text_model_name)
        self.creative_team_agent = CreativeTeamAgent(text_model)
        self.creative_director_agent = CreativeDirectorAgent(text_model)
        
        # Initialize image model for ad copy generation
        try:
            image_model = genai.GenerativeModel(self.image_model_name)
            print(f"Successfully initialized image model: {self.image_model_name}")
        except Exception as e:
            print(f"Warning: Could not initialize image model {self.image_model_name}: {e}")
            print("Falling back to text model for image generation")
            image_model = text_model
        
        # Initialize upload directory
        upload_dir = Path(settings.UPLOAD_DIR)
        self.ad_copy_visual_agent = AdCopyVisualAgent(text_model, image_model, upload_dir)
    
    async def generate_campaign_ideas(
        self,
        campaign_brief: str,
        objective: str,
        target_audience: str,
        ad_formats: List[str],
        threshold: float = 7.0
    ) -> Dict[str, Any]:
        """
        Generate campaign ideas using multi-agent system
        
        Args:
            campaign_brief: The campaign brief
            objective: Campaign objective (Awareness, Sales, Launch)
            target_audience: Target audience description
            ad_formats: List of ad formats (Instagram Post, Story, Poster)
            threshold: Minimum score threshold (default: 7.0)
        
        Returns:
            Dictionary with all_ideas and top_ideas
        """
        # Step 1: Creative Team generates 10 campaign ideas
        all_ideas = await self.creative_team_agent.generate_ideas(
            campaign_brief=campaign_brief,
            objective=objective,
            target_audience=target_audience,
            ad_formats=ad_formats
        )
        
        # Step 2: Creative Director evaluates and filters ideas
        top_ideas = await self.creative_director_agent.evaluate_ideas(
            ideas=all_ideas,
            campaign_brief=campaign_brief,
            objective=objective,
            target_audience=target_audience,
            threshold=threshold
        )
        
        # Ensure we always have at least some ideas
        if not top_ideas or len(top_ideas) == 0:
            # If evaluation failed, use first 3 from all_ideas
            top_ideas = all_ideas[:3] if all_ideas else []
        
        return {
            "all_ideas": all_ideas if all_ideas else [],
            "top_ideas": top_ideas[:3] if top_ideas else []  # Return top 3 ideas
        }
    
    async def generate_ad_copy_and_visual(
        self,
        campaign_brief: str,
        objective: str,
        target_audience: str,
        selected_idea_title: str,
        selected_idea_description: str,
        ad_formats: List[str]
    ) -> Dict[str, Any]:
        """
        Generate ad copy and visual direction with image
        
        Args:
            campaign_brief: The campaign brief
            objective: Campaign objective
            target_audience: Target audience description
            selected_idea_title: Title of selected campaign idea
            selected_idea_description: Description of selected campaign idea
            ad_formats: List of ad formats needed
        
        Returns:
            Dictionary with headline, body, call_to_action, visual_direction, and image_url
        """
        result = await self.ad_copy_visual_agent.generate_ad_copy_and_image(
            campaign_brief=campaign_brief,
            objective=objective,
            target_audience=target_audience,
            selected_idea_title=selected_idea_title,
            selected_idea_description=selected_idea_description,
            ad_formats=ad_formats
        )
        
        return result
    
    async def generate_image_only(
        self,
        visual_direction: str,
        headline: str,
        campaign_brief: str,
        bake_text: bool = False,
        text_content: Optional[Dict[str, str]] = None
    ) -> Optional[str]:
        """
        Generate image only (without ad copy generation)
        
        Args:
            visual_direction: Visual direction description
            headline: Campaign headline
            campaign_brief: Campaign brief
        
        Returns:
            Image URL or None if generation fails
        """
        return await self.ad_copy_visual_agent.generate_image_only(
            visual_direction=visual_direction,
            headline=headline,
            campaign_brief=campaign_brief,
            bake_text=bake_text,
            text_content=text_content
        )


# Create singleton instance (lazy initialization)
_campaign_service_instance = None

def get_campaign_service() -> CampaignService:
    """Get or create campaign service singleton"""
    global _campaign_service_instance
    if _campaign_service_instance is None:
        _campaign_service_instance = CampaignService()
    return _campaign_service_instance

# For backward compatibility
campaign_service = None  # Will be initialized on first use


