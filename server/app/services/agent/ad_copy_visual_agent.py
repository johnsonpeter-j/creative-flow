import json
import base64
from typing import Dict, Any, Optional, List
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
        # NOTE: Image generation is now manual - user clicks "Generate Image" button in UI
        # So we don't generate image here initially
        image_url = None  # Don't generate image initially - user will generate it manually
        
        # Ensure text_layers is always present, even if AI didn't generate it
        # Keep it minimal - only headline and CTA to avoid clutter
        text_layers = ad_copy_result.get("text_layers", [])
        if not text_layers or len(text_layers) == 0:
            # Create minimal default text_layers - only headline and CTA (skip body to avoid clutter)
            headline_text = ad_copy_result.get("headline", "")
            cta_text = ad_copy_result.get("call_to_action", "")
            
            # Truncate if too long to avoid visual clutter
            if len(headline_text) > 60:
                headline_text = headline_text[:57] + "..."
            if len(cta_text) > 30:
                cta_text = cta_text[:27] + "..."
            
            text_layers = [
                {
                    "text": headline_text,
                    "type": "headline",
                    "fontSize": 36,
                    "fontFamily": "Impact",
                    "fill": "#1a1a1a",
                    "left": 50,
                    "top": 10,
                    "fontWeight": "bold",
                    "fontStyle": "normal",
                    "textAlign": "center"
                },
                {
                    "text": cta_text,
                    "type": "cta",
                    "fontSize": 26,
                    "fontFamily": "Arial",
                    "fill": "#FFFFFF",
                    "left": 50,
                    "top": 90,
                    "fontWeight": "bold",
                    "fontStyle": "normal",
                    "textAlign": "center"
                }
            ]
        else:
            # Filter out body text layers if present - keep only headline and CTA
            text_layers = [layer for layer in text_layers if layer.get("type") != "body"]
        
        return {
            "headline": ad_copy_result.get("headline", ""),
            "body": ad_copy_result.get("body", ""),
            "call_to_action": ad_copy_result.get("call_to_action", ""),
            "visual_direction": ad_copy_result.get("visual_direction", ""),
            "image_url": image_url,
            "text_layers": text_layers
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
- "text_layers": An array of text layer objects with design properties. Each text layer should have:
  - "text": The text content (headline, body, or call_to_action)
  - "type": "headline", "body", or "cta"
  - "fontSize": Number between 24-72 for headline, 16-32 for body, 18-36 for CTA
  - "fontFamily": One of: "Inter", "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana", "Courier New", "Comic Sans MS", "Impact", "Trebuchet MS"
  - "fill": Hex color code (e.g., "#000000" for black, "#FFFFFF" for white, or a brand-appropriate color)
  - "left": X position as percentage of canvas width (0-100, e.g., 10 for 10% from left, 50 for center)
  - "top": Y position as percentage of canvas height (0-100, e.g., 10 for 10% from top, 50 for middle)
  - "fontWeight": "normal" or "bold"
  - "fontStyle": "normal" or "italic"
  - "textAlign": "left", "center", or "right"

CRITICAL REQUIREMENTS for text_layers positioning - KEEP IT SIMPLE AND CLEAN:
1. MINIMAL TEXT LAYERS: Only create 2 text layers maximum - Headline and CTA. Skip Body text to avoid clutter and overlap.

2. CONSERVATIVE POSITIONING - AVOID CENTER AT ALL COSTS:
   - Headline: Place at VERY TOP (top: 8-12%) - center aligned (left: 50, textAlign: "center"). Keep it small and unobtrusive.
   - CTA: Place at VERY BOTTOM (top: 88-92%) - center aligned (left: 50, textAlign: "center"). Keep it compact.
   - NEVER place text in the center area (top: 30-70%) where main subjects are

3. SMALLER FONT SIZES - LESS IS MORE:
   - Headline: Use fontSize 32-40 (not too large, avoid dominating the image)
   - CTA: Use fontSize 24-28 (compact and readable)
   - Smaller fonts = less overlap risk

4. MAXIMUM SPACING:
   - Headline at top: 8-12%
   - CTA at bottom: 88-92%
   - This creates 76-84% gap between them - plenty of space for the image

5. COLOR CONTRAST - USE HIGH CONTRAST:
   - For light/bright images: Use dark text (#000000 or #1a1a1a)
   - For dark images: Use white text (#FFFFFF)
   - Always ensure maximum readability

6. HORIZONTAL CENTERING:
   - Both text layers should be center-aligned (left: 50, textAlign: "center")
   - This ensures text doesn't cover important side elements

7. TEXT CONTENT - KEEP IT SHORT:
   - Headline: Maximum 60 characters (shorter = less visual clutter)
   - CTA: Maximum 30 characters (short and punchy)

IMPORTANT: Only return 2 text_layers (headline and cta). Do NOT include body text layer to avoid overcrowding.

Example format:
{{
  "headline": "Walk the Walk, Change the World",
  "body": "Your every step can make a difference. Our new eco-friendly sneakers are crafted from 100% recycled materials, combining sustainable style with unparalleled comfort. Join the movement.",
  "call_to_action": "Shop Now",
  "visual_direction": "Vibrant outdoor scene with diverse people walking in eco-friendly sneakers on a nature trail surrounded by lush green trees and clear blue sky, bright green and earth tones, optimistic mood, dynamic composition showing movement and nature connection, sneakers visible with eco-friendly design details",
  "text_layers": [
    {{
      "text": "Walk the Walk, Change the World",
      "type": "headline",
      "fontSize": 36,
      "fontFamily": "Impact",
      "fill": "#1a1a1a",
      "left": 50,
      "top": 10,
      "fontWeight": "bold",
      "fontStyle": "normal",
      "textAlign": "center"
    }},
    {{
      "text": "Shop Now",
      "type": "cta",
      "fontSize": 26,
      "fontFamily": "Arial",
      "fill": "#FFFFFF",
      "left": 50,
      "top": 90,
      "fontWeight": "bold",
      "fontStyle": "normal",
      "textAlign": "center"
    }}
  ]
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
        campaign_brief: str,
        bake_text: bool = False,
        text_content: Optional[Dict[str, str]] = None
    ) -> Optional[str]:
        """Generate an image based on visual direction using Gemini 2.5 Flash Image model"""
        
        if bake_text and text_content:
            # AI has FULL creative control - professional designer makes all decisions
            # Only headline in image - body and CTA are for social media content
            headline = text_content.get('headline', '')
            
            image_prompt = f"""You are an award-winning professional advertising poster designer with 20+ years of experience creating iconic campaigns for Fortune 500 companies. You have complete creative freedom and artistic control.

YOUR MISSION: Design a stunning, professional advertising poster that would win design awards and be featured in design magazines.

CAMPAIGN BRIEF:
{campaign_brief}

VISUAL DIRECTION:
{visual_direction}

HEADLINE TO INCLUDE IN THE IMAGE (You have full creative control over how to design this):
"{headline}"

NOTE: Only the headline goes in the image. Body text and CTA are for social media captions, not in the visual.

YOUR CREATIVE FREEDOM - YOU DECIDE EVERYTHING:

1. TYPOGRAPHY & TEXT DESIGN (Your Choice):
   - Choose the perfect font (display fonts, serif, sans-serif - whatever works best)
   - Decide text size, weight, and style
   - Determine text color (you choose what looks best)
   - Apply your own text treatments: shadows, outlines, gradients, glows, 3D effects
   - Position the headline wherever it looks best (you're the designer)
   - Make typography decisions like a master designer

2. COLOR PALETTE (Your Choice):
   - Select colors that enhance the message and visual impact
   - Choose text color that creates maximum contrast and readability
   - Use color psychology to support the campaign message
   - Create a cohesive color scheme throughout

3. COMPOSITION & LAYOUT (Your Choice):
   - Design the layout using professional composition principles
   - Decide where the headline should go for maximum impact
   - Create visual flow and hierarchy
   - Use negative space strategically
   - Balance all elements perfectly

4. VISUAL BACKGROUND (Your Creation):
   - Design a background that complements and enhances the headline
   - Use photography, illustration, or graphic elements - your choice
   - Create depth, atmosphere, and mood
   - Ensure background supports the message without competing

5. OVERALL DESIGN EXCELLENCE:
   - Create a premium, polished, professional design
   - Make it magazine-worthy, billboard-worthy, award-worthy
   - Every element should be intentional and well-designed
   - The final result should look like it came from a top-tier design agency

REMEMBER: You are the professional designer. You have complete creative control. Make all design decisions - colors, fonts, positions, styles, effects - everything. Create something beautiful, impactful, and professionally designed.

Design this poster as if your reputation depends on it. Make it exceptional."""
        else:
            # Generate image WITHOUT text (original behavior)
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
    
    def _get_default_ad_copy(self) -> Dict[str, Any]:
        """Return default ad copy if generation fails"""
        return {
            "headline": "Experience the Difference",
            "body": "Discover our innovative products designed to enhance your lifestyle. Quality meets style in every detail.",
            "call_to_action": "Learn More",
            "visual_direction": "Modern, clean design with vibrant colors, professional photography showcasing product visuals, optimistic mood, concept-based imagery with relevant visual elements representing the product or service",
            "text_layers": [
                {
                    "text": "Experience the Difference",
                    "type": "headline",
                    "fontSize": 36,
                    "fontFamily": "Impact",
                    "fill": "#1a1a1a",
                    "left": 50,
                    "top": 10,
                    "fontWeight": "bold",
                    "fontStyle": "normal",
                    "textAlign": "center"
                },
                {
                    "text": "Learn More",
                    "type": "cta",
                    "fontSize": 26,
                    "fontFamily": "Arial",
                    "fill": "#FFFFFF",
                    "left": 50,
                    "top": 90,
                    "fontWeight": "bold",
                    "fontStyle": "normal",
                    "textAlign": "center"
                }
            ]
        }


