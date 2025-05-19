// app/api/youtube/extract/route.ts
import { NextResponse } from 'next/server';

// Simple regex-based video ID extractor
function extractVideoId(html: string): string | null {
  const regex = /"videoId":"([^"]+)"/;
  const match = html.match(regex);
  return match ? match[1] : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }
  
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`YouTube search failed: ${response.status}`);
    }
    
    const html = await response.text();
    const videoId = extractVideoId(html);
    
    if (!videoId) {
      return NextResponse.json({ error: 'No video ID found' }, { status: 404 });
    }
    
    return NextResponse.json({ videoId });
  } catch (error) {
    console.error('Error extracting YouTube video ID:', error);
    return NextResponse.json({ error: 'Failed to extract video ID' }, { status: 500 });
  }
}
