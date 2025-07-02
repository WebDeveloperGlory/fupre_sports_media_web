import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";
import { Target, Calendar, Clock, MapPin, ArrowRight, Users, Trophy, Play } from "lucide-react";

export default function BasketballHomePage() {
  // Mock data for basketball - replace with actual API calls when available
  const basketballStats = {
    activeCompetitions: 2,
    teamCount: 12,
    upcomingMatches: 4,
    newsArticles: 2
  };

  const featuredTournament = {
    name: "FUPRE Basketball Championship 2024",
    startDate: "March 15",
    endDate: "April 20",
    teams: 12,
    weeks: 6
  };

  const todaysGame = null; // No games today - replace with actual data

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background min-h-[calc(100vh-6rem)] flex flex-col justify-between">
        {/* Animated background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-orange-500/20 via-background to-background animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-background to-background animate-pulse delay-1000" />
        </div>
        
        <div className="relative flex-1 container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <BlurFade>
            <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
              <div className="relative max-w-[90vw] sm:max-w-none">
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
                  <span className="text-orange-500">FUPRE</span> BASKETBALL
                </h1>
                <div className="absolute -top-4 -right-4 w-8 h-8 sm:w-12 sm:h-12 bg-orange-500/10 rounded-full animate-ping" />
              </div>
              <p className="text-base sm:text-lg lg:text-2xl text-muted-foreground max-w-xl sm:max-w-2xl">
                Your Ultimate Source for University Basketball Coverage and Live Updates
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8 w-full max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto">
                <div className="bg-card/40 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 border border-border hover:bg-accent/50 transition-all duration-300">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500 mb-2" />
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">{basketballStats.activeCompetitions}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Active Tournaments</div>
                </div>
                <div className="bg-card/40 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 border border-border hover:bg-accent/50 transition-all duration-300">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500 mb-2" />
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">{basketballStats.teamCount}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Registered Teams</div>
                </div>
                <div className="bg-card/40 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 border border-border hover:bg-accent/50 transition-all duration-300">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500 mb-2" />
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">{basketballStats.upcomingMatches}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Upcoming Games</div>
                </div>
                <div className="bg-card/40 backdrop-blur-sm rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 border border-border hover:bg-accent/50 transition-all duration-300">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500 mb-2" />
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">{basketballStats.newsArticles}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">News Articles</div>
                </div>
              </div>

              {/* Featured Competition */}
              <div className="w-full max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto mt-6 sm:mt-8">
                <div className="bg-card/40 backdrop-blur-sm rounded-lg lg:rounded-xl p-4 sm:p-6 lg:p-8 border border-border relative overflow-hidden group hover:bg-accent/50 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors duration-500" />
                  
                  <div className="relative">
                    <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full bg-orange-500 text-orange-50 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                      FEATURED TOURNAMENT
                    </span>
                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-4">
                      {featuredTournament.name}
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-orange-500 mb-3 sm:mb-4 lg:mb-6">
                      {featuredTournament.startDate} - {featuredTournament.endDate}
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{featuredTournament.teams} teams</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{featuredTournament.weeks} Weeks</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>FUPRE Sports Complex</span>
                      </div>
                    </div>
                    <Link
                      href="/sports/basketball/competitions"
                      className="inline-flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-full bg-orange-500 text-orange-50 text-xs sm:text-sm lg:text-base font-medium hover:bg-orange-600 transition-colors group"
                    >
                      VIEW TOURNAMENT
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Today's Game Section */}
        <div className="container mx-auto px-4 pb-8 sm:pb-12">
          <div className="max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto">
            <div className="bg-card/40 backdrop-blur-sm rounded-lg lg:rounded-xl p-4 sm:p-6 lg:p-8 border border-border hover:bg-accent/50 transition-all duration-300">
              <h2 className="text-base sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Today's Featured Game
              </h2>
              
              {todaysGame ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* Game details would go here */}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6 sm:py-8">
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/50" />
                  <p className="text-sm sm:text-base">No games scheduled for today</p>
                  <p className="text-xs sm:text-sm mt-2">Check back soon for upcoming basketball matches!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link
                href="/sports/basketball/competitions"
                className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border hover:bg-accent/50 transition-all duration-300 text-center group"
              >
                <Trophy className="w-6 h-6 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium">Competitions</div>
              </Link>
              <Link
                href="/sports/basketball/teams"
                className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border hover:bg-accent/50 transition-all duration-300 text-center group"
              >
                <Users className="w-6 h-6 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium">Teams</div>
              </Link>
              <Link
                href="/sports/basketball/fixtures"
                className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border hover:bg-accent/50 transition-all duration-300 text-center group"
              >
                <Calendar className="w-6 h-6 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium">Fixtures</div>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange-500/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-px h-16 sm:h-24 lg:h-32 bg-gradient-to-t from-orange-500/20 to-transparent" />
        <div className="absolute bottom-0 right-1/4 w-px h-12 sm:h-16 lg:h-24 bg-gradient-to-t from-orange-500/20 to-transparent" />
      </section>
    </main>
  );
}
