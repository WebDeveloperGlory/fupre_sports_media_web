// app/layout.tsx
import "@/assets/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/providers/theme-provider";
import { LoadingProvider } from "@/providers/loading-provider";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { NavigationEvents } from "@/components/navigation-events";
import ToastProvider from "@/components/toast/ToastProvider";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata = {
  title: "FUPRE Sports Media",
  description: "Your one-stop destination for FUPRE sports news and updates",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <LoadingProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <LoadingOverlay />
                <NavigationEvents />
                <Navbar />
                <main className="px-4 pt-8 pb-20 md:px-6 md:pt-24 md:pb-6">
                  {children}
                  <Analytics />
                </main>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
