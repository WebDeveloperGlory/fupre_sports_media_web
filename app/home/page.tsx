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
      <section className="relative bg-background min-h-[80vh] pb-20">
        {/* Animated background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/20 via-background to-background animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative pt-12">
          <BlurFade>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  <span className="text-emerald-500">FUPRE</span> SPORTS MEDIA
                </h1>
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-emerald-500/10 rounded-full animate-ping" />
              </div>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                Your Ultimate Source for University Sports Coverage and Live Updates
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-4xl">
                <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                  <Trophy className="w-6 h-6 text-emerald-500 mb-2" />
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-sm text-muted-foreground">Active Tournaments</div>
                </div>
                <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                  <Users className="w-6 h-6 text-emerald-500 mb-2" />
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Participating Teams</div>
                </div>
                <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                  <Play className="w-6 h-6 text-emerald-500 mb-2" />
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-sm text-muted-foreground">Match Highlights</div>
                </div>
                <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                  <Newspaper className="w-6 h-6 text-emerald-500 mb-2" />
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">News Articles</div>
                </div>
              </div>

              {/* Featured Competition */}
              <div className="w-full max-w-4xl mt-8">
                <div className="bg-card/40 backdrop-blur-sm rounded-xl p-8 border border-border relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500" />
                  
                  <div className="relative">
                    <span className="inline-block px-4 py-1 rounded-full bg-emerald-500 text-emerald-50 text-sm font-medium mb-4">
                      FEATURED TOURNAMENT
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                      FUPRE Super League
                    </h2>
                    <p className="text-emerald-500 text-xl mb-6">
                      March 19th - April 30th
                    </p>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="w-4 h-4" />
                        <span>12 Teams</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>6 Weeks</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>FUPRE Main Ground</span>
                      </div>
                    </div>
                    <Link 
                      href="/competitions/league/1"
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-500 text-emerald-50 font-medium hover:bg-emerald-600 transition-colors group"
                    >
                      VIEW FIXTURES
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Today's Fixture Section */}
        <div className="max-w-4xl mx-auto mt-12 px-4">
          <div className="bg-card/40 backdrop-blur-sm rounded-xl p-8 border border-border">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Today's Highlighted Fixture
            </h2>
            
            {todaysFixture ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex flex-col items-center md:items-end gap-2 flex-1">
                    <div className="relative w-16 h-16">
                      <Image
                        src="/team-logos/team-a.png"
                        alt={todaysFixture.homeTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-xl font-medium text-center md:text-right">
                      {todaysFixture.homeTeam.name}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl font-bold text-emerald-500">VS</div>
                    <Link
                      href={`/fixtures/${todaysFixture._id}`}
                      className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>

                  <div className="flex flex-col items-center md:items-start gap-2 flex-1">
                    <div className="relative w-16 h-16">
                      <Image
                        src="/team-logos/team-b.png"
                        alt={todaysFixture.awayTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-xl font-medium text-center md:text-left">
                      {todaysFixture.awayTeam.name}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{todaysFixture.stadium}</span>
                  </div>
                </div>

                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium">
                    {todaysFixture.competition?.name || 'Friendly'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No fixtures scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-px h-32 bg-gradient-to-t from-emerald-500/20 to-transparent" />
        <div className="absolute bottom-0 right-1/4 w-px h-24 bg-gradient-to-t from-emerald-500/20 to-transparent" />
      </section>
    </main>
  );
} 