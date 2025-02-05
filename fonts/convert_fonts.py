import os
from fontTools.ttLib import TTFont
import subprocess
from pathlib import Path
import logging
import shutil

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Update this path to your woff2_compress.exe location
WOFF2_COMPRESS = Path(__file__).parent / "woff2-master/out/Release/woff2_compress.exe"

def ensure_woff2_compress():
    """Check if woff2_compress is available."""
    if not WOFF2_COMPRESS.exists():
        logger.error(f"woff2_compress not found at: {WOFF2_COMPRESS}")
        return False
    return True

def sanitize_filename(filename: str) -> str:
    """Convert spaces to dashes in filename."""
    return filename.replace(' ', '-')

def convert_to_woff(input_path: Path, output_path: Path):
    """Convert font to WOFF format using fontTools."""
    try:
        # Open in binary mode
        with open(input_path, 'rb') as font_file:
            font = TTFont(font_file)
            font.flavor = 'woff'
            output_path.parent.mkdir(exist_ok=True)
            # Save in binary mode
            font.save(str(output_path), reorderTables=False)
            logger.info(f"✓ Converted {input_path.name} to WOFF")
            return True
    except Exception as e:
        logger.error(f"✗ Error converting {input_path.name} to WOFF: {str(e)}")
        return False

def convert_to_woff2(input_path: Path, output_path: Path):
    """Convert font to WOFF2 format using woff2_compress."""
    try:
        output_path.parent.mkdir(exist_ok=True)
        
        # Ensure we're reading the input file in binary mode
        with open(input_path, 'rb') as source:
            # Create a temporary copy to work with
            temp_path = input_path.parent / f"temp_{input_path.name}"
            with open(temp_path, 'wb') as dest:
                shutil.copyfileobj(source, dest)
        
        # Run woff2_compress on the temp file
        result = subprocess.run(
            [str(WOFF2_COMPRESS), str(temp_path)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        if result.returncode == 0:
            # Move the generated woff2 file to desired location
            woff2_file = temp_path.with_suffix('.woff2')
            if woff2_file.exists():
                shutil.move(str(woff2_file), str(output_path))
                logger.info(f"✓ Converted {input_path.name} to WOFF2")
                # Clean up temp file
                temp_path.unlink(missing_ok=True)
                return True
        else:
            logger.error(f"✗ Error converting {input_path.name} to WOFF2: {result.stderr}")
            # Clean up temp file
            temp_path.unlink(missing_ok=True)
        return False
    except Exception as e:
        logger.error(f"✗ Error converting {input_path.name} to WOFF2: {str(e)}")
        return False

def main():
    # Check for woff2_compress
    if not ensure_woff2_compress():
        return

    # Get the script's directory and source/output directories
    fonts_dir = Path(__file__).parent
    otf_dir = fonts_dir / 'otf'
    woff_dir = fonts_dir / 'woff'
    woff2_dir = fonts_dir / 'woff2'
    
    # Process all OTF files from the otf directory
    otf_files = list(otf_dir.glob('*.otf'))
    
    if not otf_files:
        logger.warning("No OTF files found in the /otf directory!")
        return

    logger.info(f"Found {len(otf_files)} OTF files to convert")
    
    # Convert files
    for otf_path in otf_files:
        # Sanitize the filename by replacing spaces with dashes
        sanitized_name = sanitize_filename(otf_path.stem)
        
        # Generate output paths with sanitized names
        woff_path = woff_dir / f"{sanitized_name}.woff"
        woff2_path = woff2_dir / f"{sanitized_name}.woff2"

        # Convert to both formats
        convert_to_woff(otf_path, woff_path)
        convert_to_woff2(otf_path, woff2_path)

    logger.info("\nFont conversion completed! 🎉")
    logger.info("""
Next steps:
1. Check the 'woff' and 'woff2' directories for the converted files
2. Update your CSS @font-face declarations to use the new formats
3. Test the fonts in different browsers
""")

if __name__ == '__main__':
    main() 