// app/layout.tsx
import '@/assets/styles/globals.css';
import { Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/providers/theme-provider';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata = {
  title: 'FUPRE Sports Media',
  description: 'Your one-stop destination for FUPRE sports news and updates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
        <ThemeProvider>
          <Navbar />
          <main className="py-4 pb-12 md:py-16 md:pb-0">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}