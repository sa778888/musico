'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import PlayerWrapper from './PlayerWrapper';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if we are on an auth page
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    // Just render the form with no sidebar or player
    return <div className="min-h-screen bg-black text-white">{children}</div>;
  }

  // Render the full app layout with sidebar and player
  return (
    <div className="flex bg-black text-white h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      <PlayerWrapper />
    </div>
  );
}
