import { BlurFade } from "@/components/ui/blur-fade";
import { getTodaysFixtures } from "@/lib/requests/homePage/requests";
import { Fixture } from "@/utils/requestDataTypes";
import { format } from 'date-fns';
import Link from "next/link";

export default async function HomePage() {
    const data = await getTodaysFixtures();
    let todayFixtureList: Fixture[] | null = null;

    if( data && data.code === '00' ) {
      todayFixtureList = data.data;
    }
    let todaysFixture: Fixture | null = todayFixtureList ? todayFixtureList[ 0 ] : null;

    const formattedDate = todaysFixture ? format( todaysFixture.date, "yyyy-MM-dd HH:mm" ) : null;
    const date = formattedDate ? formattedDate.split(' ')[ 0 ] : null;
    const time = formattedDate ? formattedDate.split(' ')[ 1 ] : null;

    console.log({ todayFixtureList, data });
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background min-h-screen pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background" />
        
        <div className="container mx-auto px-4 relative">
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
                    STARTING TODAY
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    FUPRE Super League
                  </h2>
                  <p className="text-emerald-500 text-xl mb-6">
                    March 19th - April 30th
                  </p>
                  <Link 
                    href="/competitions/league/1"
                    className="inline-block px-8 py-3 rounded-full bg-emerald-500 text-emerald-50 font-medium hover:bg-emerald-600 transition-colors"
                  >
                    VIEW FIXTURES
                  </Link>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Today's Fixture Section */}
        <div className="max-w-2xl mx-auto bg-card/70 backdrop-blur-sm text-center p-8 rounded-xl mt-8 border border-black">
          <h2 className="text-2xl font-bold">Today's Highlighted Fixture</h2>
          <div className="mt-4">
            {
              todaysFixture ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4">
                    <div className="text-xl font-medium text-right flex-1">
                      { todaysFixture.homeTeam.name }
                    </div>
                    <div className="px-6 text-emerald-500 font-bold">VS</div>
                    <div className="text-xl font-medium text-left flex-1">
                      {todaysFixture.awayTeam.name }
                    </div>
                  </div>
                  <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <span className="mr-2">
                        📅
                      </span>
                      { date }
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">
                        ⏰
                      </span>
                      { time }
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">
                        📍
                      </span>
                      { todaysFixture.stadium }
                    </div>
                  </div>

                  <div className="text-sm text-emerald-500 font-medium">
                    { todaysFixture.competition?.name || 'Friendly' }
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  No fixtures scheduled for today
                </div>
              )
            }
          </div>
        </div>

        {/* Decorative glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
      </section>
    </main>
  );
} 