import './globals.css';
import { Providers } from './providers';
import LayoutWrapper from './components/LayoutWrapper';// import the wrapper

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
