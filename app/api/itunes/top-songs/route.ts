import { NextResponse } from 'next/server';

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
  }>;
}

interface ItunesFeed {
  feed: {
    entry: ItunesEntry[];
  };
}

export async function GET() {
  try {
    const response = await fetch('https://itunes.apple.com/us/rss/topsongs/limit=50/json');
    if (!response.ok) throw new Error(`iTunes API error: ${response.status}`);

    const data: ItunesFeed = await response.json();

    if (!data.feed || !data.feed.entry || !data.feed.entry.length) {
      throw new Error('Invalid iTunes feed structure');
    }

    const songs = data.feed.entry.map((entry) => ({
      id: entry.id.attributes['im:id'],
      title: entry['im:name'].label,
      artist: entry['im:artist'].label,
      artwork: entry['im:image']?.slice(-1)[0]?.label || '',
    }));

    return NextResponse.json(songs);
  } catch (error) {
    console.error('Failed to fetch top songs:', error);
    return NextResponse.json([], { status: 500 });
  }
}
