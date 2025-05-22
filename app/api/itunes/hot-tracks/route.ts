import { NextResponse } from 'next/server';

// Define interface for the iTunes entry structure
interface ItunesEntry {
  id: {
    attributes: {
      'im:id': string;
    };
  };
  'im:name': {
    label: string;
  };
  'im:artist': {
    label: string;
  };
  'im:image'?: Array<{
    label: string;
    attributes?: {
      height: string;
    };
  }>;
}

// Define interface for the iTunes API response
interface ItunesResponse {
  feed: {
    entry: ItunesEntry[];
  };
}

export async function GET() {
  try {
    // Hot tracks is another label for popular songs
    const response = await fetch('https://itunes.apple.com/us/rss/topsongs/limit=50/json');
    if (!response.ok) throw new Error(`iTunes API error: ${response.status}`);
    
    const data = await response.json() as ItunesResponse;
    
    if (!data.feed || !data.feed.entry || !data.feed.entry.length) {
      throw new Error('Invalid iTunes feed structure');
    }

    const songs = data.feed.entry.map((entry: ItunesEntry) => ({
      id: entry.id.attributes['im:id'],
      title: entry['im:name'].label,
      artist: entry['im:artist'].label,
      artwork: entry['im:image']?.slice(-1)[0]?.label || '',
    }));

    return NextResponse.json(songs);
  } catch (error) {
    console.error('Failed to fetch hot tracks:', error);
    return NextResponse.json([], { status: 500 });
  }
}
