// app/layout.tsx
import './globals.css'
import Sidebar from './components/Sidebar'
import PlayerWrapper from './components/PlayerWrapper'
import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex bg-black text-white h-screen overflow-hidden">
        {/* Sidebar */}
        {/* <Sidebar /> */}

        {/* Main content: scrollable, padded at bottom so it never hides under the player */}
        <main className="flex-1 overflow-y-auto pb-24">
          {children}
        </main>

        {/* Player always mounted and fixed to bottom */}
        <PlayerWrapper />
      </body>
    </html>
  )
}
