import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputPath = resolve(__dirname, '../public/og-image.png');

// Convert local image to base64 data URL
function getImageAsDataUrl() {
  const imagePath = resolve(__dirname, '../public/open-door.png');
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error('Error reading door image:', error);
    return '';
  }
}

const doorImageUrl = getImageAsDataUrl();

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      width: 1200px;
      height: 650px; 
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      color: white;
      font-family: 'Inter', sans-serif;
      text-align: center;
      position: relative;
      overflow: hidden;
      padding: 0rem;
      box-sizing: border-box;
    }
    
    .container {
      position: absolute;
      top: 40%;
      left: 6rem;
      transform: translateY(-50%) perspective(100px) rotateY(0deg);
      max-width: 600px;
      transform-style: preserve-3d;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      gap: 1.2rem;
      box-sizing: border-box;
    }
    
    h1 {
      font-size: 5.8rem;
      font-weight: 800;
      margin: 0;
      line-height: 1.05;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
      max-width: 100%;
      letter-spacing: -1.5px;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      font-size: 2.1rem;
      opacity: 0.95;
      margin: 0.5rem 0 0 0;
      max-width: 100%;
      line-height: 1.35;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.95);
      padding-right: 1rem;
    }
    
    .logo-image {
      position: absolute;
      top: 50%;
      transform: translateY(-50%) perspective(1000px) rotateY(-5deg);
      right: 4rem;
      width: 480px;
      height: 520px;
      object-fit: contain;
      filter: drop-shadow(0 6px 25px rgba(0,0,0,0.4));
      z-index: 10;
      transition: all 0.3s ease;
      transform-style: preserve-3d;
    }
    
    .logo {
      position: absolute;
      bottom: 2.5rem; /* This controls the space below the domain */
      left: 6rem;
      font-size: 1.9rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.15);
      padding: 0.9rem 2.2rem;
      border-radius: 60px;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      white-space: nowrap;
      z-index: 20; /* Ensure it's above other elements */
    }
    
    .logo-icon {
      width: 40px;
      height: 40px;
      background-color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4f46e5;
      font-size: 1.2rem;
      font-weight: bold;
    }
    
    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .circle-1 {
      width: 1000px;
      height: 1000px;
      top: -500px;
      right: -500px;
      opacity: 0.9;
      transform: perspective(1000px) rotateX(10deg);
    }
    
    .circle-2 {
      width: 350px;
      height: 350px;
      bottom: -175px;
      left: -175px;
      opacity: 0.8;
      transform: perspective(1000px) rotateX(5deg);
    }
  </style>
</head>
<body>
  <div class="circle circle-1"></div>
  <div class="circle circle-2"></div>
  
  <img src="${doorImageUrl}" alt="Door Logo" class="logo-image" />
  <div class="container">
    <h1>Web It Easier</h1>
    <p class="subtitle">The door to an easier digital future. Making web technologies more accessible and easier to use for everyone.
    Web Development, Design, and SEO for Modern Businesses</p>
  </div>
  
  <div class="logo">
    <div class="logo-icon">WIE</div>
    <span>web-it-easier.vercel.app</span>
  </div>
</body>
</html>
`;

async function generateOGImage() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    console.log('Creating new page...');
    const page = await browser.newPage();
    
    // Set viewport to match OG image dimensions
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
    });
    
    console.log('Setting content...');
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });
    
    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    
    console.log('Taking screenshot...');
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false,
      omitBackground: true
    });
    
    console.log(`OG image generated at: ${outputPath}`);
    
    // Convert to webp using sharp for better compression
    const sharp = (await import('sharp')).default;
    const webpPath = outputPath.replace(/\.png$/, '.webp');
    await sharp(outputPath)
      .webp({ quality: 80 })
      .toFile(webpPath);
      
    console.log(`WebP version generated at: ${webpPath}`);
    
  } catch (error) {
    console.error('Error generating OG image:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

generateOGImage().catch(console.error);
