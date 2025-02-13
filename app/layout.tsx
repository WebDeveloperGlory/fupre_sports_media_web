// app/layout.tsx
import '@/assets/styles/globals.css';
import { Space_Grotesk } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/providers/theme-provider';
import { LoadingProvider } from "@/providers/loading-provider";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { cn } from "@/utils/cn";
import { NavigationEvents } from '@/components/navigation-events';
import ToastProvider from '@/components/toast/ToastProvider';
import { cookies } from 'next/headers';
import AuthWrapper from '@/components/wrappers/AuthWrapper';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata = {
  title: 'FUPRE Sports Media',
  description: 'Your one-stop destination for FUPRE sports news and updates',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); // Await the promise
  const availableCookies = Array.from(cookieStore.getAll()).map((cookie) => [
    cookie.name,
    { value: cookie.value },
  ]) as [string, { value: string }][];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
        <LoadingProvider>
          <ThemeProvider>
            <ToastProvider>
              {/* AuthWrapper for jwt */}
              <AuthWrapper data={ availableCookies } />
              <LoadingOverlay />
              <NavigationEvents />
              <Navbar />
              <main className="px-4 pt-8 pb-20 md:px-6 md:pt-24 md:pb-6">
                {children}
              </main>
            </ToastProvider>
          </ThemeProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}