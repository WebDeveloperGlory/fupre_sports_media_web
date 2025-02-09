import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background" />
        
        <div className="container mx-auto px-4 py-8 md:py-24 relative">
          <BlurFade>
            <div className="flex flex-col items-center text-center space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-emerald-500">
                FUPRE SPORT MEDIA
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Your Source for University Sports
              </p>

              <div className="mt-8 md:mt-12 space-y-8">
                <div className="bg-card/40 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto border border-border">
                  <span className="inline-block px-4 py-1 rounded-full bg-emerald-500 text-emerald-50 text-sm font-medium mb-4">
                    ONGOING
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Unity Cup 2025
                  </h2>
                  <p className="text-emerald-500 text-xl mb-6">
                    January 30th - February 2nd
                  </p>
                  <Link 
                    href="/competitions/unity-cup-2025"
                    className="inline-block px-8 py-3 rounded-full bg-emerald-500 text-emerald-50 font-medium hover:bg-emerald-600 transition-colors"
                  >
                    VIEW FIXTURES
                  </Link>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Decorative glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
      </section>
    </main>
  );
}
