import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const featuredDir = path.join(process.cwd(), 'public', 'images', 'featured');

    // Read all files from the featured directory
    const files = fs.readdirSync(featuredDir);

    // Filter for image files and sort them
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort(); // Alphabetical sort (our numbered prefix ensures correct order)

    // Convert to public URLs
    const imagePaths = imageFiles.map(file => `/images/featured/${file}`);

    return NextResponse.json(imagePaths);
  } catch (error) {
    console.error('Error reading featured images:', error);
    return NextResponse.json([]);
  }
}
