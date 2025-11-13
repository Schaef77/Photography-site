const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');

// Get image dimensions
function getImageDimensions(imagePath) {
  try {
    const buffer = fs.readFileSync(imagePath);
    const dimensions = imageSize(buffer);
    return {
      width: dimensions.width,
      height: dimensions.height
    };
  } catch (error) {
    console.error(`Error reading dimensions for ${imagePath}:`, error.message);
    return { width: 0, height: 0 };
  }
}

// Generate featured images data
function generateFeaturedImages() {
  const featuredDir = path.join(__dirname, 'public', 'images', 'featured');

  // Check if featured directory exists
  if (!fs.existsSync(featuredDir)) {
    console.log('⚠️  Featured images directory not found');
    return [];
  }

  // Read all files from the featured directory
  const files = fs.readdirSync(featuredDir);

  // Filter for image files, sort them, and get dimensions
  const images = files
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .sort() // Alphabetical sort (numbered prefix ensures correct order)
    .map(file => {
      const fullPath = path.join(featuredDir, file);
      const dimensions = getImageDimensions(fullPath);
      return {
        src: `/images/featured/${file}`,
        width: dimensions.width,
        height: dimensions.height
      };
    });

  console.log(`✅ Found ${images.length} featured images`);
  return images;
}

// Write to file
const featuredImages = generateFeaturedImages();
const outputPath = path.join(__dirname, 'data', 'featured-images.json');

// Create data folder if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

fs.writeFileSync(outputPath, JSON.stringify(featuredImages, null, 2));
console.log(`\n📁 Generated featured-images.json with ${featuredImages.length} images`);
