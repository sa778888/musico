import { NextResponse } from 'next/server';

interface ItunesEntry {
  id: {
    attributes: {
      'im:id': string;
    };
  };
  'im:artist': {
    label: string;
    attributes?: {
      href: string;
    };
  };
  'im:image'?: Array<{
    label: string;
  }>;
  category?: {
    attributes?: {
      label: string;
    };
  };
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

    const artistMap = new Map<string, {
      id: string;
      name: string;
      image: string;
      genre: string;
    }>();

    data.feed.entry.forEach((entry) => {
      const artistName = entry['im:artist'].label;
      const artistId = entry['im:artist'].attributes?.href || entry.id.attributes['im:id'];

      if (!artistMap.has(artistName)) {
        artistMap.set(artistName, {
          id: artistId,
          name: artistName,
          image: entry['im:image']?.[2]?.label || entry['im:image']?.[0]?.label || '',
          genre: entry.category?.attributes?.label || 'Music',
        });
      }
    });

    const artists = Array.from(artistMap.values()).slice(0, 20);

    return NextResponse.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: 500 });
  }
}
