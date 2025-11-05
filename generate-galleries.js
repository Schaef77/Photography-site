const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');

// Gallery order from newest to oldest
const galleryOrder = [
  'saint-marks-summit',
  'glacier-national-park',
  'a-walk-downtown',
  'iceland',
  'milan',
  'nice',
  'perpignan',
  'amsterdam'
];

// Convert folder name to display title
function formatTitle(folderName) {
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

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

// Generate galleries data
function generateGalleries() {
  const galleriesPath = path.join(__dirname, 'public', 'images', 'galleries');
  const galleries = [];

  galleryOrder.forEach(folderName => {
    const galleryPath = path.join(galleriesPath, folderName);

    // Skip if folder doesn't exist yet
    if (!fs.existsSync(galleryPath)) {
      console.log(`⚠️  Skipping ${folderName} - folder not found`);
      return;
    }

    const files = fs.readdirSync(galleryPath);

    // Find cover image with pattern: foldername_cover.jpg
    const coverImage = files.find(file =>
      file.toLowerCase() === `${folderName}_cover.jpg` ||
      file.toLowerCase() === `${folderName}_cover.jpeg` ||
      file.toLowerCase() === `${folderName}_cover.png`
    );

    if (!coverImage) {
      console.log(`⚠️  Warning: No ${folderName}_cover.jpg found in ${folderName}`);
      return;
    }

    // Get cover image dimensions
    const coverPath = path.join(galleryPath, coverImage);
    const coverDimensions = getImageDimensions(coverPath);

    // Get all photos except cover with dimensions
    const photos = files
      .filter(file =>
        !file.toLowerCase().includes('_cover') &&
        !file.startsWith('.') &&
        (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
      )
      .map(file => {
        const fullPath = path.join(galleryPath, file);
        const dimensions = getImageDimensions(fullPath);
        return {
          src: `/images/galleries/${folderName}/${file}`,
          width: dimensions.width,
          height: dimensions.height
        };
      });

    galleries.push({
      id: folderName,
      title: formatTitle(folderName),
      thumbnail: `/images/galleries/${folderName}/${coverImage}`,
      thumbnailWidth: coverDimensions.width,
      thumbnailHeight: coverDimensions.height,
      photos: photos
    });

    console.log(`✅ Added ${folderName} - ${photos.length} photos`);
  });

  return galleries;
}

// Write to file
const galleries = generateGalleries();
const outputPath = path.join(__dirname, 'data', 'galleries.json');

// Create data folder if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

fs.writeFileSync(outputPath, JSON.stringify(galleries, null, 2));
console.log(`\n📁 Generated galleries.json with ${galleries.length} galleries`);