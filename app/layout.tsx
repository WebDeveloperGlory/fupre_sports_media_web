// app/layout.tsx
import '@/assets/styles/globals.css';
import { Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/providers/theme-provider';
import { LoadingProvider } from "@/providers/loading-provider";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { cn } from "@/utils/cn";
import { NavigationEvents } from '@/components/navigation-events';

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
        <LoadingProvider>
          <ThemeProvider>
            <LoadingOverlay />
            <NavigationEvents />
            <Navbar />
            <main className="px-4 pt-20 pb-20 md:px-6 md:pt-24 md:pb-6">
              {children}
            </main>
          </ThemeProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}