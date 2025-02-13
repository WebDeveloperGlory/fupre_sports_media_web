import { BlurFade } from "@/components/ui/blur-fade";
import { getTodaysFixtures } from "@/lib/requests/homePage/requests";
import { Fixture } from "@/utils/requestDataTypes";
import { format } from 'date-fns';
import Link from "next/link";
import { Trophy, Calendar, Clock, MapPin, ArrowRight, Users, Newspaper, Play } from "lucide-react";
import Image from "next/image";

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

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background min-h-[calc(100vh-6rem)] flex flex-col justify-between">
        {/* Animated background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/20 via-background to-background animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background animate-pulse delay-1000" />
        </div>
        
        <div className="relative flex-1 container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <BlurFade>
            <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
              <div className="relative max-w-[90vw] sm:max-w-none">
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
                  <span className="text-emerald-500">FUPRE</span> SPORTS MEDIA
                </h1>
                <div className="absolute -top-4 -right-4 w-8 h-8 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-full animate-ping" />
              </div>
              <p className="text-base sm:text-lg lg:text-2xl text-muted-foreground max-w-xl sm:max-w-2xl">
                Your Ultimate Source for University Sports Coverage and Live Updates
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8 w-full max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto">
                <div className="bg-card/40 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 border border-border hover:bg-accent/50 transition-all duration-300">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-500 mb-2" />
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">4</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Active Tournaments</div>
                </div>
                <div className="bg-card/40 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 border border-border hover:bg-accent/50 transition-all duration-300">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-500 mb-2" />
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">12</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Participating Teams</div>
                </div>
                <div className="bg-card/40 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 border border-border hover:bg-accent/50 transition-all duration-300">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-500 mb-2" />
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">24</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Match Highlights</div>
                </div>
                <div className="bg-card/40 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 border border-border hover:bg-accent/50 transition-all duration-300">
                  <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-500 mb-2" />
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">50+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">News Articles</div>
                </div>
              </div>

              {/* Featured Competition */}
              <div className="w-full max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto mt-6 sm:mt-8">
                <div className="bg-card/40 backdrop-blur-sm rounded-lg lg:rounded-xl p-4 sm:p-6 lg:p-8 border border-border relative overflow-hidden group hover:bg-accent/50 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500" />
                  
                  <div className="relative">
                    <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500 text-emerald-50 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                      FEATURED TOURNAMENT
                    </span>
                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-4">
                      FUPRE Super League
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-emerald-500 mb-3 sm:mb-4 lg:mb-6">
                      March 19th - April 30th
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>12 Teams</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>6 Weeks</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>FUPRE Main Ground</span>
                      </div>
                    </div>
                    <Link 
                      href="/competitions/league/1"
                      className="inline-flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-full bg-emerald-500 text-emerald-50 text-xs sm:text-sm lg:text-base font-medium hover:bg-emerald-600 transition-colors group"
                    >
                      VIEW FIXTURES
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Today's Fixture Section */}
        <div className="container mx-auto px-4 pb-8 sm:pb-12">
          <div className="max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto">
            <div className="bg-card/40 backdrop-blur-sm rounded-lg lg:rounded-xl p-4 sm:p-6 lg:p-8 border border-border hover:bg-accent/50 transition-all duration-300">
              <h2 className="text-base sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Today's Highlighted Fixture
              </h2>
              
              {todaysFixture ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-8">
                    <div className="flex flex-col items-center sm:items-end gap-2 sm:flex-1">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16">
                        <Image
                          src="/team-logos/team-a.png"
                          alt={todaysFixture.homeTeam.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-sm sm:text-base lg:text-lg font-medium text-center sm:text-right">
                        {todaysFixture.homeTeam.name}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-500">VS</div>
                      <Link
                        href={`/fixtures/${todaysFixture._id}`}
                        className="text-xs sm:text-sm text-muted-foreground hover:text-emerald-500 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>

                    <div className="flex flex-col items-center sm:items-start gap-2 sm:flex-1">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16">
                        <Image
                          src="/team-logos/team-b.png"
                          alt={todaysFixture.awayTeam.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-sm sm:text-base lg:text-lg font-medium text-center sm:text-left">
                        {todaysFixture.awayTeam.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                      <span>{time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                      <span>{todaysFixture.stadium}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs sm:text-sm font-medium">
                      {todaysFixture.competition?.name || 'Friendly'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6 sm:py-8">
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/50" />
                  <p className="text-sm sm:text-base">No fixtures scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-px h-16 sm:h-24 lg:h-32 bg-gradient-to-t from-emerald-500/20 to-transparent" />
        <div className="absolute bottom-0 right-1/4 w-px h-12 sm:h-16 lg:h-24 bg-gradient-to-t from-emerald-500/20 to-transparent" />
      </section>
    </main>
  );
} 