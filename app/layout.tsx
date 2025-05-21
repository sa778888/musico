import './globals.css';
import { Providers } from './providers';
import LayoutWrapper from './components/LayoutWrapper';// import the wrapper

export const metadata = {
  title: 'Musico',
  description: 'Discover music like never before',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>

      <link rel="icon" href="/favicon.png" type="image/png" />
      </head>

      <body>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
