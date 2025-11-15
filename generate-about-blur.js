const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const aboutImagesDir = path.join(__dirname, 'public', 'images', 'about-shot');

async function generateBlurDataURL(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(10, 10, { fit: 'inside' })
      .blur()
      .toBuffer();

    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
    return null;
  }
}

async function generateAboutBlurs() {
  const images = [
    'suitshot.JPG',
    'camerashot.jpeg',
    'sportshot.jpeg',
    'birdshot.jpeg',
    'cornshot.JPG'
  ];

  const blurData = {};

  for (const image of images) {
    const imagePath = path.join(aboutImagesDir, image);
    if (fs.existsSync(imagePath)) {
      console.log(`Generating blur for ${image}...`);
      const blurDataURL = await generateBlurDataURL(imagePath);
      if (blurDataURL) {
        blurData[image] = blurDataURL;
      }
    } else {
      console.warn(`Image not found: ${image}`);
    }
  }

  // Write to JSON file
  const outputPath = path.join(__dirname, 'data', 'about-blur-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(blurData, null, 2));
  console.log(`\nBlur data saved to ${outputPath}`);
  console.log(`Generated ${Object.keys(blurData).length} blur placeholders`);
}

generateAboutBlurs().catch(console.error);
