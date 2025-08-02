#!/usr/bin/env python3
"""
WoltFlow Icon Creator
Creates beautiful typographic W icons using SVG with proper fonts and gradients
"""

import os
import shutil
import tempfile

def generate_svg_icon(size):
    """Generate clean SVG with typographic W and gradient fill"""
    
    # Calculate font size based on icon size (roughly 56% of container)
    font_size = int(size * 0.56)
    
    # Container padding and corner radius
    padding = size // 16
    corner_radius = size // 8
    
    # Container dimensions
    container_size = size - (2 * padding)
    
    svg_content = f'''<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" xmlns="http://www.w3.org/2000/svg" aria-label="WoltFlow W icon">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#9333ea"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.1)"/>
    </filter>
  </defs>

  <!-- Modern container with subtle shadow -->
  <rect x="{padding}" y="{padding}" width="{container_size}" height="{container_size}" 
        rx="{corner_radius}" fill="rgba(255,255,255,0.95)" filter="url(#softShadow)"/>

  <!-- Typographic W with gradient fill -->
  <text x="50%" y="50%" text-anchor="middle" 
        font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        font-weight="700" font-size="{font_size}" fill="url(#grad)" 
        dominant-baseline="central">
    W
  </text>
</svg>'''
    
    return svg_content

def svg_to_png(svg_content, size, filename):
    """Convert SVG content to PNG file"""
    try:
        # Try using cairosvg first (most reliable)
        try:
            import cairosvg
            cairosvg.svg2png(bytestring=svg_content.encode('utf-8'), 
                           write_to=filename, 
                           output_width=size, 
                           output_height=size)
            return True
        except ImportError:
            pass
        
        # Fallback: Try using wand (ImageMagick binding)
        try:
            from wand.image import Image as WandImage
            with WandImage(blob=svg_content.encode('utf-8'), format='svg') as img:
                img.resize(size, size)
                img.format = 'png'
                img.save(filename=filename)
            return True
        except ImportError:
            pass
        
        # Last resort: Use Pillow's basic SVG support (limited)
        try:
            from PIL import Image
            import io
            import subprocess
            
            # Try to use system's convert command if available
            with tempfile.NamedTemporaryFile(mode='w', suffix='.svg', delete=False) as svg_file:
                svg_file.write(svg_content)
                svg_file.flush()
                
                try:
                    # Try ImageMagick's convert
                    subprocess.run(['convert', '-background', 'transparent', 
                                  svg_file.name, filename], 
                                 check=True, capture_output=True)
                    os.unlink(svg_file.name)
                    return True
                except (subprocess.CalledProcessError, FileNotFoundError):
                    os.unlink(svg_file.name)
                    pass
            
            # If all else fails, create a simple placeholder
            return create_fallback_icon(size, filename)
            
        except Exception:
            return create_fallback_icon(size, filename)
            
    except Exception as e:
        print(f"Error in svg_to_png: {e}")
        return create_fallback_icon(size, filename)

def create_fallback_icon(size, filename):
    """Create beautiful typographic W icon with gradient (Pillow fallback)"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        # Create white container with rounded corners
        image = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)
        
        # Container settings - make background more prominent
        padding = size // 20  # Reduced padding for larger container
        corner_radius = size // 6  # Slightly more rounded
        container_size = size - (2 * padding)
        
        # Draw rounded white container with subtle shadow
        shadow_offset = 2
        if size >= 32:
            # Draw shadow
            draw.rounded_rectangle(
                [padding + shadow_offset, padding + shadow_offset, 
                 padding + container_size + shadow_offset, padding + container_size + shadow_offset],
                radius=corner_radius, fill=(0, 0, 0, 30)
            )
        
        # Draw black container
        draw.rounded_rectangle(
            [padding, padding, padding + container_size, padding + container_size],
            radius=corner_radius, fill=(0, 0, 0, 245)
        )
        
        # Create gradient mask for the W
        gradient_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        gradient_draw = ImageDraw.Draw(gradient_img)
        
        # Draw horizontal gradient
        for x in range(size):
            ratio = x / size
            r = int(37 * (1 - ratio) + 147 * ratio)   # blue-600 to purple-600
            g = int(99 * (1 - ratio) + 51 * ratio)
            b = int(235 * (1 - ratio) + 234 * ratio)
            gradient_draw.line([(x, 0), (x, size)], fill=(r, g, b, 255))
        
        # Load best available font - BIGGER and BOLDER
        font_size = int(size * 0.65)  # Increased from 0.56 to make it bigger
        font = None
        
        # Try Windows system fonts first - look for Bold variants
        font_paths = [
            'C:/Windows/Fonts/segoeuib.ttf',       # Segoe UI Bold
            'C:/Windows/Fonts/arialbd.ttf',        # Arial Bold
            'C:/Windows/Fonts/calibrib.ttf',       # Calibri Bold
            'C:/Windows/Fonts/segoeui.ttf',        # Segoe UI Regular
            'C:/Windows/Fonts/arial.ttf',          # Arial Regular
        ]
        
        for font_path in font_paths:
            try:
                if os.path.exists(font_path):
                    font = ImageFont.truetype(font_path, font_size)
                    break
            except:
                continue
        
        # Fallback to font names with bold preference
        if not font:
            for font_name in ['Segoe UI Bold', 'Arial Bold', 'Segoe UI', 'Arial', 'Helvetica Bold', 'Helvetica']:
                try:
                    font = ImageFont.truetype(font_name, font_size)
                    break
                except:
                    continue
        
        # Last resort - default font
        if not font:
            try:
                font = ImageFont.load_default()
                # Scale up default font size since it's usually small
                font_size = int(size * 0.8)
            except:
                return create_simple_w_icon(size, filename)
        
        # Create W text mask
        w_mask = Image.new('L', (size, size), 0)
        w_draw = ImageDraw.Draw(w_mask)
        
        # Perfect centering calculation
        # First, get the bounding box at origin
        bbox = w_draw.textbbox((0, 0), "W", font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Calculate the center position accounting for the bounding box offset
        center_x = size // 2
        center_y = size // 2
        
        # Position text so its visual center aligns with container center
        x = center_x - (bbox[0] + text_width // 2)
        y = center_y - (bbox[1] + text_height // 2)
        
        # For better visual centering, get the actual drawn bounds
        # Draw at calculated position and measure again
        temp_img = Image.new('L', (size, size), 0)
        temp_draw = ImageDraw.Draw(temp_img)
        temp_draw.text((x, y), "W", font=font, fill=255)
        
        # Find the actual bounds of the drawn text
        bbox_actual = temp_img.getbbox()
        if bbox_actual:
            actual_left, actual_top, actual_right, actual_bottom = bbox_actual
            actual_width = actual_right - actual_left
            actual_height = actual_bottom - actual_top
            actual_center_x = actual_left + actual_width // 2
            actual_center_y = actual_top + actual_height // 2
            
            # Adjust position to center the actual drawn text
            x_offset = center_x - actual_center_x
            y_offset = center_y - actual_center_y
            
            x += x_offset
            y += y_offset
        
        # Draw W on mask with perfect centering
        w_draw.text((x, y), "W", font=font, fill=255)
        
        # Apply gradient only where W is
        final_image = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        final_image.paste(image, (0, 0))  # Paste container first
        
        # Apply gradient with W mask
        gradient_masked = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        gradient_masked.paste(gradient_img, (0, 0), w_mask)
        
        # Composite gradient W onto container
        final_image = Image.alpha_composite(final_image, gradient_masked)
        
        # Save
        final_image.save(filename, 'PNG')
        return True
        
    except Exception as e:
        print(f"Fallback creation failed: {e}")
        return create_simple_w_icon(size, filename)

def create_simple_w_icon(size, filename):
    """Ultra-simple W icon as last resort"""
    try:
        from PIL import Image, ImageDraw
        
        image = Image.new('RGB', (size, size), (37, 99, 235))  # Blue background
        draw = ImageDraw.Draw(image)
        
        # Simple W shape
        margin = size // 4
        width = size - (2 * margin)
        height = size // 2
        y1 = size // 4
        y2 = y1 + height
        
        # Draw W with white lines
        line_width = max(2, size // 16)
        points = [
            (margin, y1, margin + width * 0.25, y2),
            (margin + width * 0.25, y2, margin + width * 0.5, y1 + height * 0.6),
            (margin + width * 0.5, y1 + height * 0.6, margin + width * 0.75, y2),
            (margin + width * 0.75, y2, margin + width, y1)
        ]
        
        for x1, y1, x2, y2 in points:
            draw.line([(x1, y1), (x2, y2)], fill='white', width=line_width)
        
        image.save(filename, 'PNG')
        return True
        
    except:
        return False

def create_icon(size, filename):
    """Create a single icon of specified size using SVG approach"""
    try:
        # Generate SVG content
        svg_content = generate_svg_icon(size)
        
        # Convert to PNG
        if svg_to_png(svg_content, size, filename):
            print(f"✓ Created {filename}")
            return True
        else:
            print(f"✗ Failed to create {filename}")
            return False
        
    except Exception as e:
        print(f"✗ Error creating {filename}: {e}")
        return False

def main():
    """Main function to create all icons"""
    print("🌊 Creating WoltFlow icons...")
    
    # Delete existing icons directory
    if os.path.exists('icons'):
        print("🗑️  Deleting existing icons...")
        shutil.rmtree('icons')
    
    # Create new icons directory
    os.makedirs('icons', exist_ok=True)
    print("📁 Created icons directory")
    
    # Icon sizes for Chrome extension
    sizes = [16, 32, 48, 128]
    success_count = 0
    
    # Create each icon
    for size in sizes:
        filename = f"icons/icon{size}.png"
        if create_icon(size, filename):
            success_count += 1
    
    # Summary
    if success_count == len(sizes):
        print(f"\n🎉 All {success_count} icons created successfully!")
        print("✅ WoltFlow extension ready!")
        print("\n📋 Next steps:")
        print("1. Open Chrome → chrome://extensions/")
        print("2. Enable 'Developer mode'")
        print("3. Click 'Load unpacked' → select this folder")
        print("4. Visit wolt.com and test the extension!")
    else:
        print(f"\n⚠️  Created {success_count}/{len(sizes)} icons")
        print("Some icons may need manual creation")

if __name__ == "__main__":
    try:
        main()
    except ImportError:
        print("❌ PIL (Pillow) not found!")
        print("Install with: pip install Pillow")
    except Exception as e:
        print(f"❌ Error: {e}")