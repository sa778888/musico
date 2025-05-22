// app/api/image-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');
  
  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    console.log('Proxying image:', imageUrl);
    
    // Special handling for iTunes/Apple images
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'image',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site'
    };

    // For iTunes images, add referer
    if (imageUrl.includes('mzstatic.com')) {
      headers['Referer'] = 'https://music.apple.com/';
    }

    const response = await fetch(imageUrl, {
      headers,
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      console.error(`Image fetch failed: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP ${response.status}`);
    }
    
    const contentType = response.headers.get('Content-Type');
    if (!contentType?.startsWith('image/')) {
      throw new Error('Response is not an image');
    }
    
    const imageBuffer = await response.arrayBuffer();
    console.log(`Successfully proxied image: ${imageBuffer.byteLength} bytes`);
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
    
  } catch (error) {
    console.error('Image proxy error for URL:', imageUrl, error);
    
    // Return default image as base64
    const defaultImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const defaultImage = Buffer.from(defaultImageBase64, 'base64');
    
    return new NextResponse(defaultImage, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=60'
      }
    });
  }
}
