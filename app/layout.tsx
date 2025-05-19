// app/layout.tsx
import './globals.css';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import { Figtree } from 'next/font/google';

const font = Figtree({ subsets: ['latin'] });

export const metadata = {
  title: 'Music Explorer',
  description: 'Your personal music discovery app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-black h-full overflow-hidden`}>
        <main className="h-screen overflow-hidden flex">
          <Sidebar />
          <div className="flex-1 h-full overflow-y-auto bg-gradient-to-b from-[#121212] to-black pt-2">
            <div className="px-6">
              {children}
            </div>
          </div>
        </main>
        <Player />
      </body>
    </html>
  );
}
