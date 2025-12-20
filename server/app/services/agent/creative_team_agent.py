import json
from typing import List
import google.generativeai as genai
from app.schemas.campaign import CampaignIdeaSchema


class CreativeTeamAgent:
    """Creative Team Agent: Generates diverse and creative campaign ideas"""
    
    def __init__(self, model: genai.GenerativeModel):
        """
        Initialize the Creative Team Agent
        
        Args:
            model: Pre-configured Gemini model instance
        """
        self.model = model
    
    async def generate_ideas(
        self,
        campaign_brief: str,
        objective: str,
        target_audience: str,
        ad_formats: List[str]
    ) -> List[CampaignIdeaSchema]:
        """
        Generate 10 creative campaign ideas
        
        Args:
            campaign_brief: The campaign brief
            objective: Campaign objective (Awareness, Sales, Launch)
            target_audience: Target audience description
            ad_formats: List of ad formats (Instagram Post, Story, Poster)
        
        Returns:
            List of CampaignIdeaSchema objects with title and description
        """
        prompt = f"""You are a Creative Team working on an advertising campaign. Your job is to generate 10 diverse and creative campaign ideas.

Campaign Brief: {campaign_brief}
Objective: {objective}
Target Audience: {target_audience}
Ad Formats: {', '.join(ad_formats)}

Generate 10 unique campaign ideas. Each idea should be creative, relevant, and aligned with the campaign objective.

Return ONLY a valid JSON array with 10 objects, each containing:
- "title": A catchy campaign title (max 60 characters)
- "description": A detailed description of the campaign concept (max 200 characters)

Example format:
[
  {{"title": "Summer Vibes Campaign", "description": "A vibrant campaign showcasing summer activities with bright colors and energetic content."}},
  {{"title": "Eco Warriors Unite", "description": "Focus on sustainability and environmental consciousness with green-themed visuals."}}
]

Return ONLY the JSON array, no additional text or markdown formatting."""

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean up markdown code blocks if present
            if response_text.startswith("```"):
                response_text = response_text.split("```")[1]
                if response_text.startswith("json"):
                    response_text = response_text[4:]
                response_text = response_text.strip()
            
            ideas_data = json.loads(response_text)
            
            # Convert to CampaignIdeaSchema objects with default score
            ideas = []
            for idea in ideas_data[:10]:  # Ensure we only take 10 ideas
                ideas.append(CampaignIdeaSchema(
                    title=idea.get("title", "Untitled Campaign"),
                    description=idea.get("description", "No description provided"),
                    score=0.0,  # Score will be assigned by Creative Director
                    reasoning=None
                ))
            
            return ideas
            
        except json.JSONDecodeError as e:
            print(f"Error parsing Creative Team response: {e}")
            print(f"Response text: {response_text if 'response_text' in locals() else 'No response'}")
            # Return default ideas if parsing fails
            return self._get_default_ideas()
        except Exception as e:
            print(f"Error in Creative Team generation: {e}")
            return self._get_default_ideas()
    
    def _get_default_ideas(self) -> List[CampaignIdeaSchema]:
        """Return default campaign ideas if generation fails"""
        return [
            CampaignIdeaSchema(
                title="Brand Awareness Campaign",
                description="A comprehensive campaign focused on increasing brand visibility through engaging content and strategic messaging.",
                score=0.0,
                reasoning=None
            ),
            CampaignIdeaSchema(
                title="Product Launch Campaign",
                description="An exciting campaign designed to introduce new products with compelling visuals and clear value propositions.",
                score=0.0,
                reasoning=None
            ),
            CampaignIdeaSchema(
                title="Customer Engagement Campaign",
                description="Interactive campaign focused on building relationships with customers through personalized content and experiences.",
                score=0.0,
                reasoning=None
            ),
            CampaignIdeaSchema(
                title="Social Media Blitz",
                description="High-energy social media campaign with trending content and influencer partnerships for maximum reach.",
                score=0.0,
                reasoning=None
            ),
            CampaignIdeaSchema(
                title="Storytelling Campaign",
                description="Emotional campaign that tells authentic brand stories to create deeper connections with the audience.",
                score=0.0,
                reasoning=None
            ),
            CampaignIdeaSchema(
                title="Limited-Time Offer",
                description="Urgency-driven campaign promoting exclusive deals and time-sensitive offers to drive immediate action.",
                score=0.0,
                reasoning=None
            ),
            CampaignIdeaSchema(
                title="Community Building Campaign",
                description="Campaign focused on creating a sense of belonging and fostering a loyal brand community.",
                score=0.0,
                reasoning=None
            ),
            CampaignIdeaSchema(
                title="Innovation Showcase",
                description="Campaign highlighting cutting-edge features and innovations that set the brand apart from competitors.",
                score=0.0,
                reasoning=None
            ),
            CampaignIdeaSchema(
                title="Customer Testimonials",
                description="Trust-building campaign featuring real customer success stories and authentic reviews.",
                score=0.0,
                reasoning=None
            ),
            CampaignIdeaSchema(
                title="Seasonal Campaign",
                description="Timely campaign aligned with seasonal trends and holidays to maximize relevance and engagement.",
                score=0.0,
                reasoning=None
            ),
        ]

