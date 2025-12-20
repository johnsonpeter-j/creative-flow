import json
import base64
from typing import Dict, Any, Optional
from pathlib import Path
import google.generativeai as genai
from datetime import datetime
import uuid


class AdCopyVisualAgent:
    """Agent for generating ad copy and visual direction with image generation"""
    
    def __init__(self, text_model: genai.GenerativeModel, image_model: genai.GenerativeModel, upload_dir: Path):
        """
        Initialize the Ad Copy & Visual Direction Agent
        
        Args:
            text_model: Pre-configured Gemini model for text generation
            image_model: Pre-configured Gemini model for image generation
            upload_dir: Directory to save generated images
        """
        self.text_model = text_model
        self.image_model = image_model
        self.upload_dir = upload_dir
        self.upload_dir.mkdir(parents=True, exist_ok=True)
    
    async def generate_ad_copy_and_image(
        self,
        campaign_brief: str,
        objective: str,
        target_audience: str,
        selected_idea_title: str,
        selected_idea_description: str,
        ad_formats: list[str]
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
            Dictionary with ad_copy (headline, body, cta) and image_url
        """
        # Step 1: Generate ad copy and visual direction description
        ad_copy_result = await self._generate_ad_copy(
            campaign_brief=campaign_brief,
            objective=objective,
            target_audience=target_audience,
            selected_idea_title=selected_idea_title,
            selected_idea_description=selected_idea_description,
            ad_formats=ad_formats
        )
        
        # Step 2: Generate image based on visual direction (optional, can return None)
        image_url = await self._generate_image(
            visual_direction=ad_copy_result.get("visual_direction", ""),
            headline=ad_copy_result.get("headline", ""),
            campaign_brief=campaign_brief
        )
        
        return {
            "headline": ad_copy_result.get("headline", ""),
            "body": ad_copy_result.get("body", ""),
            "call_to_action": ad_copy_result.get("call_to_action", ""),
            "visual_direction": ad_copy_result.get("visual_direction", ""),
            "image_url": image_url
        }
    
    async def _generate_ad_copy(
        self,
        campaign_brief: str,
        objective: str,
        target_audience: str,
        selected_idea_title: str,
        selected_idea_description: str,
        ad_formats: list[str]
    ) -> Dict[str, str]:
        """Generate ad copy text including headline, body, CTA, and visual direction"""
        
        prompt = f"""You are a Creative Copywriter and Art Director working on an advertising campaign. Your job is to create compelling ad copy and visual direction.

Campaign Brief: {campaign_brief}
Objective: {objective}
Target Audience: {target_audience}
Selected Campaign Idea: {selected_idea_title}
Idea Description: {selected_idea_description}
Ad Formats Needed: {', '.join(ad_formats)}

Create professional ad copy and visual direction. Focus on the selected campaign idea.

IMPORTANT for visual_direction: This will be used to generate a PURELY VISUAL image with NO TEXT. Describe only visual elements - objects, scenes, colors, mood, composition - that represent the product/service concept.

Return ONLY a valid JSON object with:
- "headline": A compelling headline (max 100 characters, catchy and attention-grabbing)
- "body": The main body copy (max 300 characters, persuasive and engaging)
- "call_to_action": A clear call-to-action (max 50 characters, action-oriented)
- "visual_direction": Detailed description of ONLY visual elements for a concept-based image with ABSOLUTELY NO TEXT. Describe: specific visual objects/scenes, colors, mood, composition, and visual metaphors that represent the product/service concept. Examples: For food delivery: "Colorful food items arranged attractively, delivery bag with food containers, happy diverse people enjoying meals, restaurant/kitchen background, warm inviting colors, energetic positive mood". For fashion: "Stylish clothing items displayed elegantly, models in fashionable settings, accessories, vibrant colors, sophisticated mood". DO NOT mention any text, words, letters, numbers, or typography. (max 280 characters)

Example format:
{{
  "headline": "Walk the Walk, Change the World",
  "body": "Your every step can make a difference. Our new eco-friendly sneakers are crafted from 100% recycled materials, combining sustainable style with unparalleled comfort. Join the movement.",
  "call_to_action": "Shop Now",
  "visual_direction": "Vibrant outdoor scene with diverse people walking in eco-friendly sneakers on a nature trail surrounded by lush green trees and clear blue sky, bright green and earth tones, optimistic mood, dynamic composition showing movement and nature connection, sneakers visible with eco-friendly design details"
}}

Return ONLY the JSON object, no additional text or markdown formatting."""

        try:
            response = self.text_model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean up markdown code blocks if present
            if response_text.startswith("```"):
                response_text = response_text.split("```")[1]
                if response_text.startswith("json"):
                    response_text = response_text[4:]
                response_text = response_text.strip()
            
            ad_copy_data = json.loads(response_text)
            return ad_copy_data
            
        except json.JSONDecodeError as e:
            print(f"Error parsing Ad Copy response: {e}")
            print(f"Response text: {response_text if 'response_text' in locals() else 'No response'}")
            # Return default ad copy
            return self._get_default_ad_copy()
        except Exception as e:
            print(f"Error generating ad copy: {e}")
            return self._get_default_ad_copy()
    
    async def _generate_image(
        self,
        visual_direction: str,
        headline: str,
        campaign_brief: str
    ) -> Optional[str]:
        """Generate an image based on visual direction using Gemini image generation"""
        return await self.generate_image_only(visual_direction, headline, campaign_brief)
    
    async def generate_image_only(
        self,
        visual_direction: str,
        headline: str,
        campaign_brief: str
    ) -> Optional[str]:
        """Generate an image based on visual direction using Gemini 2.5 Flash Image model"""
        
        # Create a detailed image generation prompt - CONCEPT-BASED, NO TEXT
        # Extract the core concept from campaign brief to represent it visually
        image_prompt = f"""Create a professional, concept-based advertising image. This is a PURELY VISUAL image with ABSOLUTELY NO TEXT.

Campaign Context: {campaign_brief}
Visual Style Guide: {visual_direction}

CRITICAL REQUIREMENTS:
1. NO TEXT AT ALL: Do not include any words, letters, numbers, typography, text overlays, labels, or written content in the image
2. CONCEPT-BASED: Extract the core product/service concept from the campaign brief and represent it through visual imagery only
3. VISUAL REPRESENTATION: Use visual elements that clearly communicate the concept:
   - For food delivery apps: Show food items, delivery bags/boxes, people enjoying meals, restaurant settings, delivery vehicles, happy customers with food
   - For fashion brands: Show clothing items, models wearing clothes, fashion accessories, style settings
   - For tech products: Show the product in use, modern environments, people using the product, technology scenes
   - Use relevant visual metaphors and imagery that instantly communicate the product/service type

4. VISUAL QUALITY:
   - Professional photography or illustration style
   - Vibrant, appealing colors that match the visual direction
   - Clear composition that draws attention
   - Suitable for social media and print advertising
   - High quality and visually striking

5. COMMUNICATION: The image must communicate the campaign concept purely through visual elements - no text needed to understand what the product/service is about

Generate a high-quality, professional advertising image that represents the campaign concept using ONLY visual imagery - absolutely NO text, words, letters, numbers, or typography of any kind."""

        try:
            model_name = getattr(self.image_model, 'model_name', None) or getattr(self.image_model, '_model_name', None) or 'unknown'
            print(f"\n{'='*60}")
            print(f"Generating image with model: {model_name}")
            print(f"Prompt length: {len(image_prompt)} characters")
            print(f"{'='*60}\n")
            
            # Generate content - try different approaches
            response = None
            
            # Try 1: With generation_config dict (if supported)
            try:
                print("Attempt 1: Trying with generation_config dict...")
                generation_config = {
                    'response_modalities': ['IMAGE'],
                }
                response = self.image_model.generate_content(
                    image_prompt,
                    generation_config=generation_config
                )
                print("✓ Success with generation_config dict")
            except Exception as e1:
                print(f"✗ Failed with generation_config: {e1}")
                
                # Try 2: With response_modalities as direct parameter
                try:
                    print("Attempt 2: Trying with response_modalities parameter...")
                    response = self.image_model.generate_content(
                        image_prompt,
                        response_modalities=['IMAGE']
                    )
                    print("✓ Success with response_modalities parameter")
                except Exception as e2:
                    print(f"✗ Failed with response_modalities: {e2}")
                    
                    # Try 3: Without any config (model might default to image)
                    try:
                        print("Attempt 3: Trying without any config...")
                        response = self.image_model.generate_content(image_prompt)
                        print("✓ Success without config")
                    except Exception as e3:
                        print(f"✗ All attempts failed. Last error: {e3}")
                        raise e3
            
            if not response:
                print("❌ No response received")
                return None
            
            print(f"Response type: {type(response)}")
            print(f"Response dir: {[attr for attr in dir(response) if not attr.startswith('_')]}")
            
            # Process response following JavaScript structure:
            # chunk.candidates[0].content.parts[0].inlineData
            if not hasattr(response, 'candidates'):
                print("❌ Response has no 'candidates' attribute")
                print(f"Available attributes: {dir(response)}")
                return None
            
            if not response.candidates:
                print("❌ Response.candidates is empty")
                return None
            
            print(f"Found {len(response.candidates)} candidate(s)")
            
            for candidate_idx, candidate in enumerate(response.candidates):
                print(f"\n--- Processing candidate {candidate_idx} ---")
                print(f"Candidate type: {type(candidate)}")
                print(f"Candidate attributes: {[attr for attr in dir(candidate) if not attr.startswith('_')]}")
                
                # Access candidate.content
                if not hasattr(candidate, 'content'):
                    print(f"✗ Candidate {candidate_idx} has no 'content' attribute")
                    continue
                
                content = candidate.content
                if not content:
                    print(f"✗ Candidate {candidate_idx} content is None")
                    continue
                
                print(f"Content type: {type(content)}")
                print(f"Content attributes: {[attr for attr in dir(content) if not attr.startswith('_')]}")
                
                # Access content.parts
                if not hasattr(content, 'parts'):
                    print(f"✗ Content has no 'parts' attribute")
                    continue
                
                parts = content.parts
                if not parts:
                    print(f"✗ Content.parts is empty")
                    continue
                
                print(f"Found {len(parts)} part(s)")
                
                for part_idx, part in enumerate(parts):
                    print(f"\n  Processing part {part_idx}")
                    print(f"  Part type: {type(part)}")
                    part_attrs = [attr for attr in dir(part) if not attr.startswith('_')]
                    print(f"  Part attributes: {part_attrs}")
                    
                    # Check for inline_data - try both snake_case and camelCase
                    inline_data = None
                    if 'inline_data' in part_attrs:
                        inline_data = getattr(part, 'inline_data', None)
                        if inline_data:
                            print(f"  ✓ Found inline_data (snake_case)")
                    elif 'inlineData' in part_attrs:
                        inline_data = getattr(part, 'inlineData', None)
                        if inline_data:
                            print(f"  ✓ Found inlineData (camelCase)")
                    
                    if inline_data:
                        print(f"  Inline data type: {type(inline_data)}")
                        inline_attrs = [attr for attr in dir(inline_data) if not attr.startswith('_')]
                        print(f"  Inline data attributes: {inline_attrs}")
                        
                        # Extract data
                        image_bytes = None
                        mime_type = "image/png"
                        
                        # Try to get data
                        if 'data' in inline_attrs:
                            data_attr = getattr(inline_data, 'data', None)
                            if data_attr:
                                if isinstance(data_attr, bytes):
                                    image_bytes = data_attr
                                    print(f"  ✓ Data is bytes: {len(image_bytes)} bytes")
                                elif isinstance(data_attr, str):
                                    try:
                                        image_bytes = base64.b64decode(data_attr)
                                        print(f"  ✓ Data is base64 string, decoded: {len(image_bytes)} bytes")
                                    except Exception as decode_err:
                                        print(f"  ✗ Failed to decode base64: {decode_err}")
                        
                        # Try to get mime_type
                        if 'mime_type' in inline_attrs:
                            mime_type = getattr(inline_data, 'mime_type', 'image/png') or "image/png"
                        elif 'mimeType' in inline_attrs:
                            mime_type = getattr(inline_data, 'mimeType', 'image/png') or "image/png"
                        
                        print(f"  MIME type: {mime_type}")
                        
                        if image_bytes:
                            # Determine file extension
                            extension = "png"
                            mime_lower = mime_type.lower()
                            if "jpeg" in mime_lower or "jpg" in mime_lower:
                                extension = "jpg"
                            elif "webp" in mime_lower:
                                extension = "webp"
                            
                            # Generate filename and save
                            filename = f"ad_poster_{uuid.uuid4().hex[:8]}.{extension}"
                            file_path = self.upload_dir / filename
                            
                            with open(file_path, "wb") as f:
                                f.write(image_bytes)
                            
                            print(f"\n{'='*60}")
                            print(f"✓✓✓ SUCCESS: Image saved as {filename}")
                            print(f"   Size: {len(image_bytes)} bytes")
                            print(f"   Path: {file_path}")
                            print(f"{'='*60}\n")
                            
                            return f"/uploads/{filename}"
                        else:
                            print(f"  ✗ No image bytes extracted from inline_data")
                    else:
                        # Check for text (for debugging)
                        if 'text' in part_attrs:
                            text_content = getattr(part, 'text', '')
                            if text_content:
                                print(f"  Part contains text: {text_content[:150]}...")
            
            print(f"\n{'='*60}")
            print("❌ No image data found in response")
            print(f"{'='*60}\n")
            return None
            
        except Exception as e:
            print(f"❌ Error generating image: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def _get_default_ad_copy(self) -> Dict[str, str]:
        """Return default ad copy if generation fails"""
        return {
            "headline": "Experience the Difference",
            "body": "Discover our innovative products designed to enhance your lifestyle. Quality meets style in every detail.",
            "call_to_action": "Learn More",
            "visual_direction": "Modern, clean design with vibrant colors, professional photography showcasing product visuals, optimistic mood, concept-based imagery with relevant visual elements representing the product or service"
        }

