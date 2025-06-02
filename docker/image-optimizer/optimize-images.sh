#!/bin/bash

echo "🛠️  Starting image optimization..."
echo "========================================"

# Create backup directory
mkdir -p /app/images/backup

# Function to format file size
format_size() {
    local size=$1
    if [ $size -ge 1048576 ]; then
        printf "%.1f MB" $(echo "scale=1; $size/1048576" | bc)
    elif [ $size -ge 1024 ]; then
        printf "%.1f KB" $(echo "scale=1; $size/1024" | bc)
    else
        echo "$size B"
    fi
}

# Function to optimize an image
optimize_image() {
    local input=$1
    local output="/app/images/$(basename "$input")"
    local backup="/app/images/backup/$(basename "$input")"
    local max_width=1600
    local quality=85
    local target_ratio=70  # Target 70% of original width
    local unsharp="0.25x0.25+8+0.05"
    
    # Skip if not a file
    [ -f "$input" ] || { echo "❌ File not found: $input"; return 1; }
    
    # Create backup if it doesn't exist
    [ -f "$backup" ] || cp "$input" "$backup"
    
    # Get original dimensions and size
    dimensions=$(identify -format "%wx%h" "$input" 2>/dev/null) || {
        echo "❌ Not a valid image: $input"
        return 1
    }
    
    original_width=${dimensions%x*}
    original_size=$(stat -c%s "$input")
    target_width=$((original_width * target_ratio / 100))
    
    # Constrain dimensions
    [ "$target_width" -gt "$max_width" ] && target_width=$max_width
    [ "$target_width" -lt 600 ] && target_width=600  # Lower minimum width
    
    echo "🔍 Processing: $(basename "$input")"
    echo "   Original: ${dimensions}, Size: $(format_size $original_size)"
    
    # Build convert command
    cmd=(convert "$input"
        -quality "$quality"
        -strip
        -auto-orient
        -define webp:method=6
        -define webp:pass=6
        -define webp:target-size=0
        -define webp:auto-filter=true
        -define webp:use-sharp-yuv=1
        -define webp:alpha-quality=80
        -define webp:thread-level=1
        -define jpeg:extent=100KB
        -define png:compression-level=9
        -define png:compression-strategy=1
        -interlace Plane
        -sampling-factor 4:2:0
        -colorspace sRGB
    )
    
    # Add resizing if needed
    if [ "$original_width" -gt "$((target_width * 105 / 100))" ]; then
        cmd+=(-resize "${target_width}x" -unsharp "$unsharp")
        echo "   Resizing to: ${target_width}px (from ${original_width}px)"
    else
        echo "   Keeping original dimensions (${original_width}px)"
    fi
    
    # Add output file
    cmd+=("$output")
    
    # Execute the command
    "${cmd[@]}"
    
    # Verify and report
    if [ -f "$output" ]; then
        optimized_size=$(stat -c%s "$output")
        savings=$((original_size - optimized_size))
        savings_percent=$((savings * 100 / original_size))
        
        echo "   ✅ Optimized: $(format_size $optimized_size)"
        if [ $savings -gt 0 ]; then
            echo "   💾 Saved: $(format_size $savings) (${savings_percent}%)"
        else
            echo "   ⚠️  Increased by: $(format_size $((optimized_size - original_size)))"
        fi
    else
        echo "   ❌ Failed to optimize: $input"
    fi
    echo "----------------------------------------"
}

# Process all images
processed=0
shopt -s nullglob  # Make globs expand to nothing when no matches are found

# Process each image type separately
for ext in jpg jpeg png webp; do
    for img in /app/images/*.$ext; do
        [ -e "$img" ] || continue
        optimize_image "$img"
        ((processed++))
    done
done

if [ "$processed" -eq 0 ]; then
    echo "ℹ️  No images found in /app/images/"
    echo "   Make sure you've mounted your images directory to /app/images"
    echo "   Example: docker run -v \$(pwd)/public/images:/app/images image-optimizer"
else
    echo "✅ Optimization complete! Processed $processed images."
    echo "📁 Originals backed up to: /app/images/backup/"
fi