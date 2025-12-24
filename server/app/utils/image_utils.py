from PIL import Image, ImageDraw, ImageFont
from typing import List, Dict, Any
from pathlib import Path
import requests
from io import BytesIO


def bake_text_into_image(
    image_path: str,
    text_layers: List[Dict[str, Any]],
    output_path: str
) -> str:
    """
    Bake text layers into an image using PIL
    
    Args:
        image_path: Path to the source image (can be URL or local path)
        text_layers: List of text layer dictionaries with positioning and styling
        output_path: Path to save the output image
    
    Returns:
        Path to the saved image
    """
    # Load image
    print(f"Loading image from: {image_path}")
    if image_path.startswith('http://') or image_path.startswith('https://'):
        print("Loading from URL")
        response = requests.get(image_path, timeout=30)
        response.raise_for_status()  # Raise exception for bad status codes
        img = Image.open(BytesIO(response.content))
        print(f"Loaded image from URL, size: {img.size}")
    else:
        # Local path - handle relative paths like /uploads/...
        from app.core.config import settings
        if image_path.startswith('/uploads/'):
            # Relative path from server root
            image_path = str(Path(settings.UPLOAD_DIR) / image_path.replace('/uploads/', ''))
        elif not Path(image_path).is_absolute():
            # Relative path - prepend upload dir
            image_path = str(Path(settings.UPLOAD_DIR) / image_path.lstrip('/'))
        
        print(f"Loading from local path: {image_path}")
        if not Path(image_path).exists():
            raise FileNotFoundError(f"Image file not found: {image_path}")
        img = Image.open(image_path)
        print(f"Loaded image from local path, size: {img.size}")
    
    # Convert to RGB if needed (for JPEG compatibility)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    img_width, img_height = img.size
    
    # Create drawing context
    draw = ImageDraw.Draw(img)
    
    # Draw each text layer
    print(f"Drawing {len(text_layers)} text layers")
    for idx, layer in enumerate(text_layers):
        text = layer.get('text', '')
        if not text:
            print(f"Layer {idx}: Empty text, skipping")
            continue
        
        print(f"Layer {idx}: Drawing text '{text[:50]}...'")
        
        # Get text properties
        base_font_size = layer.get('fontSize', 32)
        # Scale font size based on image dimensions (use average of width/height for better scaling)
        scale_factor = min(img_width, img_height) / 800
        fontSize = max(20, int(base_font_size * scale_factor))  # Minimum 20px
        fontFamily = layer.get('fontFamily', 'Arial')
        fill = layer.get('fill', '#000000')
        fontWeight = layer.get('fontWeight', 'normal')
        fontStyle = layer.get('fontStyle', 'normal')
        textAlign = layer.get('textAlign', 'center')
        left = layer.get('left', 50)  # Percentage
        top = layer.get('top', 50)  # Percentage
        
        print(f"  Text: '{text[:30]}...', FontSize: {fontSize}, Position: ({left}%, {top}%), Color: {fill}")
        
        # Convert hex color to RGB
        try:
            if fill.startswith('#'):
                fill_rgb = tuple(int(fill[i:i+2], 16) for i in (1, 3, 5))
            elif fill.lower() == 'white' or fill == '#FFFFFF' or fill == '#ffffff':
                fill_rgb = (255, 255, 255)
            elif fill.lower() == 'black' or fill == '#000000' or fill == '#000':
                fill_rgb = (0, 0, 0)
            else:
                fill_rgb = (0, 0, 0)  # Default to black
        except Exception as e:
            print(f"  Error parsing color '{fill}': {e}, using black")
            fill_rgb = (0, 0, 0)  # Default to black
        
        print(f"  Color RGB: {fill_rgb}")
        
        # Try to load font, fallback to default
        try:
            # Try to find system font
            if fontFamily.lower() == 'impact':
                font_path = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
            elif fontFamily.lower() == 'arial':
                font_path = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
            else:
                font_path = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
            
            try:
                font = ImageFont.truetype(font_path, fontSize)
            except:
                # Fallback to default font
                font = ImageFont.load_default()
        except:
            font = ImageFont.load_default()
        
        # Calculate position
        x = (left / 100) * img_width
        y = (top / 100) * img_height
        
        # Get text bounding box for alignment
        try:
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
        except:
            # Fallback if textbbox fails
            text_width = len(text) * fontSize * 0.6
            text_height = fontSize * 1.2
        
        # Adjust x position based on alignment
        if textAlign == 'center':
            x = x - (text_width / 2)
        elif textAlign == 'right':
            x = x - text_width
        
        # Ensure text stays within image bounds (but allow some margin)
        x = max(5, min(x, img_width - text_width - 5))
        y = max(5, min(y, img_height - text_height - 5))
        
        print(f"  Final position: ({int(x)}, {int(y)}), Text size: {int(text_width)}x{int(text_height)}, Font size: {fontSize}")
        
        # For white text, use black shadow. For dark text, use white outline
        if fill_rgb == (255, 255, 255) or sum(fill_rgb) > 500:  # Light color
            # White text needs black shadow
            shadow_color = (0, 0, 0)
            shadow_offset = max(3, fontSize // 10)
        else:
            # Dark text needs white outline for contrast
            shadow_color = (255, 255, 255)
            shadow_offset = max(2, fontSize // 15)
        
        # Draw shadow/outline multiple times for stronger effect
        for offset_x, offset_y in [
            (shadow_offset, shadow_offset),
            (-shadow_offset, shadow_offset),
            (shadow_offset, -shadow_offset),
            (-shadow_offset, -shadow_offset),
            (0, shadow_offset),
            (0, -shadow_offset),
            (shadow_offset, 0),
            (-shadow_offset, 0)
        ]:
            try:
                draw.text(
                    (x + offset_x, y + offset_y),
                    text,
                    font=font,
                    fill=shadow_color
                )
            except Exception as e:
                print(f"  Error drawing shadow: {e}")
        
        # Draw main text
        try:
            draw.text(
                (x, y),
                text,
                font=font,
                fill=fill_rgb
            )
            print(f"  ✓ Text '{text[:20]}...' drawn successfully at ({int(x)}, {int(y)}) with color {fill_rgb}")
        except Exception as e:
            print(f"  ✗ Error drawing text: {e}")
            import traceback
            traceback.print_exc()
    
    # Save the image
    img.save(output_path, 'JPEG', quality=95)
    return output_path

