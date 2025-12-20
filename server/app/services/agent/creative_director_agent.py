import json
from typing import List
import google.generativeai as genai
from app.schemas.campaign import CampaignIdeaSchema


class CreativeDirectorAgent:
    """Creative Director Agent: Evaluates and scores campaign ideas"""
    
    def __init__(self, model: genai.GenerativeModel):
        """
        Initialize the Creative Director Agent
        
        Args:
            model: Pre-configured Gemini model instance
        """
        self.model = model
    
    async def evaluate_ideas(
        self,
        ideas: List[CampaignIdeaSchema],
        campaign_brief: str,
        objective: str,
        target_audience: str,
        threshold: float = 7.0
    ) -> List[CampaignIdeaSchema]:
        """
        Evaluate and score campaign ideas
        
        Args:
            ideas: List of campaign ideas to evaluate
            campaign_brief: The campaign brief
            objective: Campaign objective
            target_audience: Target audience description
            threshold: Minimum score threshold (default: 7.0)
        
        Returns:
            List of scored and filtered CampaignIdeaSchema objects
        """
        ideas_text = "\n".join([
            f"{i+1}. Title: {idea.title}\n   Description: {idea.description}"
            for i, idea in enumerate(ideas)
        ])
        
        prompt = f"""You are a Creative Director evaluating campaign ideas. Your job is to critically assess each idea and assign a quality score from 1-10.

Campaign Brief: {campaign_brief}
Objective: {objective}
Target Audience: {target_audience}

Campaign Ideas to Evaluate:
{ideas_text}

Evaluate each idea based on:
- Creativity and originality (30%)
- Alignment with campaign brief and objective (30%)
- Appeal to target audience (25%)
- Feasibility and clarity (15%)

For each of the {len(ideas)} ideas, provide:
- "id": The idea number (1-{len(ideas)})
- "score": A numerical score from 1.0 to 10.0 (use decimals for precision)
- "reasoning": Brief explanation of the score (max 150 characters)

Return ONLY a valid JSON array with {len(ideas)} objects.

Example format:
[
  {{"id": 1, "score": 8.5, "reasoning": "Strong creative concept with clear target audience appeal."}},
  {{"id": 2, "score": 6.0, "reasoning": "Good idea but lacks originality and impact."}}
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
            
            evaluations = json.loads(response_text)
            
            # Apply scores to ideas
            scored_ideas = []
            for eval_data in evaluations:
                idea_id = eval_data.get("id", 0) - 1  # Convert to 0-based index
                if 0 <= idea_id < len(ideas):
                    idea = ideas[idea_id]
                    idea.score = float(eval_data.get("score", 0.0))
                    idea.reasoning = eval_data.get("reasoning", "")
                    scored_ideas.append(idea)
            
            # Filter by threshold and sort by score
            filtered_ideas = [idea for idea in scored_ideas if idea.score >= threshold]
            filtered_ideas.sort(key=lambda x: x.score, reverse=True)
            
            # If less than 3 ideas meet threshold, lower threshold gradually
            if len(filtered_ideas) < 3:
                all_scored = sorted(scored_ideas, key=lambda x: x.score, reverse=True)
                filtered_ideas = all_scored[:3]
            
            return filtered_ideas
            
        except json.JSONDecodeError as e:
            print(f"Error parsing Creative Director response: {e}")
            print(f"Response text: {response_text if 'response_text' in locals() else 'No response'}")
            # Return ideas with default scores
            for i, idea in enumerate(ideas):
                idea.score = 8.0 - (i * 0.5)  # Descending scores
                idea.reasoning = "Default scoring due to evaluation error"
            return sorted(ideas, key=lambda x: x.score, reverse=True)[:3]
        except Exception as e:
            print(f"Error in Creative Director evaluation: {e}")
            for i, idea in enumerate(ideas):
                idea.score = 8.0 - (i * 0.5)
                idea.reasoning = "Default scoring due to evaluation error"
            return sorted(ideas, key=lambda x: x.score, reverse=True)[:3]

