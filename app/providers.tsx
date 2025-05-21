// app/providers.tsx
'use client';

import { ReactNode } from 'react';
import { LikedSongsProvider } from './context/LikedSongsContext';

export function Providers({ children }: { children: ReactNode }) {

  return (
    <LikedSongsProvider >
      {children}
    </LikedSongsProvider>
  );
}
