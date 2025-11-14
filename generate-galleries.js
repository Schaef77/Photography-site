const fs = require('fs');
const path = require('path');
const { imageSize } = require('image-size');
const sharp = require('sharp');

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

// Generate blur placeholder as base64 data URL
async function generateBlurDataURL(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(10, 10, { fit: 'inside' })
      .blur()
      .toBuffer();
    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error(`Error generating blur for ${imagePath}:`, error.message);
    return null;
  }
}

// Load gallery order from config file
function loadGalleryOrder() {
  const orderFilePath = path.join(__dirname, 'gallery-order.json');

  // If config file exists, use it
  if (fs.existsSync(orderFilePath)) {
    try {
      const orderData = fs.readFileSync(orderFilePath, 'utf8');
      return JSON.parse(orderData);
    } catch (error) {
      console.error('⚠️  Error reading gallery-order.json, discovering galleries automatically');
      return null;
    }
  }

  return null;
}

// Auto-discover galleries if not in order file
function discoverGalleries(galleriesPath, specifiedOrder) {
  const allFolders = fs.readdirSync(galleriesPath)
    .filter(item => {
      const itemPath = path.join(galleriesPath, item);
      return fs.statSync(itemPath).isDirectory() && !item.startsWith('.');
    });

  // Find any galleries not in the order file
  const unspecifiedGalleries = allFolders.filter(folder => !specifiedOrder.includes(folder));

  if (unspecifiedGalleries.length > 0) {
    console.log(`\n⚠️  Found ${unspecifiedGalleries.length} gallery(ies) not in gallery-order.json:`);
    unspecifiedGalleries.forEach(g => console.log(`   - ${g}`));
    console.log('   Add them to gallery-order.json to include them\n');
  }

  return unspecifiedGalleries;
}

// Generate galleries data
async function generateGalleries() {
  const galleriesPath = path.join(__dirname, 'public', 'images', 'galleries');
  const galleries = [];

  // Load gallery order from config
  const galleryOrder = loadGalleryOrder();

  if (!galleryOrder) {
    console.log('⚠️  No gallery-order.json found, please create one');
    return galleries;
  }

  // Check for galleries not in the order file
  discoverGalleries(galleriesPath, galleryOrder);

  for (const folderName of galleryOrder) {
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

    // Get cover image dimensions and blur placeholder
    const coverPath = path.join(galleryPath, coverImage);
    const coverDimensions = getImageDimensions(coverPath);
    const blurDataURL = await generateBlurDataURL(coverPath);

    // Get all photos except cover with dimensions
    const photoFiles = files
      .filter(file =>
        !file.toLowerCase().includes('_cover') &&
        !file.startsWith('.') &&
        (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
      );

    // Group photos by prefix (everything before the last hyphen and number)
    const photoGroups = {};
    photoFiles.forEach(file => {
      // Remove file extension first
      const nameWithoutExt = file.replace(/\.(jpg|jpeg|png)$/i, '');
      // Split by hyphen and remove the last part if it's a number
      const parts = nameWithoutExt.split('-');
      let prefix = nameWithoutExt;

      // If last part is a number, use everything before it as the group
      if (parts.length > 1 && /^\d+$/.test(parts[parts.length - 1])) {
        prefix = parts.slice(0, -1).join('-');
      }

      if (!photoGroups[prefix]) {
        photoGroups[prefix] = [];
      }
      photoGroups[prefix].push(file);
    });

    // Build photo array with group markers
    const photos = [];
    const groupPrefixes = Object.keys(photoGroups).sort();

    for (const prefix of groupPrefixes) {
      const groupIndex = groupPrefixes.indexOf(prefix);
      for (let fileIndex = 0; fileIndex < photoGroups[prefix].length; fileIndex++) {
        const file = photoGroups[prefix][fileIndex];
        const fullPath = path.join(galleryPath, file);
        const dimensions = getImageDimensions(fullPath);
        const photoBlurDataURL = await generateBlurDataURL(fullPath);

        photos.push({
          src: `/images/galleries/${folderName}/${file}`,
          width: dimensions.width,
          height: dimensions.height,
          blurDataURL: photoBlurDataURL,
          groupId: prefix,
          isFirstInGroup: fileIndex === 0,
          isNewGroup: groupIndex > 0 && fileIndex === 0
        });
      }
    }

    galleries.push({
      id: folderName,
      title: formatTitle(folderName),
      thumbnail: `/images/galleries/${folderName}/${coverImage}`,
      thumbnailWidth: coverDimensions.width,
      thumbnailHeight: coverDimensions.height,
      blurDataURL: blurDataURL,
      photos: photos
    });

    console.log(`✅ Added ${folderName} - ${photos.length} photos`);
  }

  return galleries;
}

// Write to file
async function main() {
  const galleries = await generateGalleries();
  const outputPath = path.join(__dirname, 'data', 'galleries.json');

  // Create data folder if it doesn't exist
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  fs.writeFileSync(outputPath, JSON.stringify(galleries, null, 2));
  console.log(`\n📁 Generated galleries.json with ${galleries.length} galleries`);
}

main().catch(console.error);