import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";
import { Trophy, Target, ArrowRight, Calendar, Users, Award, Clock } from "lucide-react";

export default function CompetitionsPage() {
  const competitions = [
    {
      name: "Football",
      href: "/sports/football",
      description: "University football competitions, leagues, and tournaments",
      icon: Trophy,
      color: "emerald" as const,
      gradient: "from-emerald-500/20 to-emerald-600/10",
      available: true,
      stats: {
        activeCompetitions: "3",
        teams: "16",
        upcomingMatches: "8",
        currentSeason: "2024/25"
      },
      competitions: [
        "Unity Cup Championship",
        "Inter-Faculty League", 
        "FUPRE Premier League",
        "Knockout Tournament"
      ],
      nextMatch: {
        date: "Tomorrow",
        time: "4:00 PM",
        teams: "Engineering FC vs Science United"
      }
    },
    {
      name: "Basketball",
      href: "/sports/basketball",
      description: "Basketball tournaments, leagues, and championship games",
      icon: Target,
      color: "orange" as const,
      gradient: "from-orange-500/20 to-orange-600/10",
      available: false, // Coming soon
      stats: {
        activeCompetitions: "2",
        teams: "12",
        upcomingMatches: "4",
        currentSeason: "2024/25"
      },
      competitions: [
        "Basketball Championship",
        "3v3 Tournament",
        "Inter-Department League",
        "Skills Competition"
      ],
      nextMatch: {
        date: "Friday",
        time: "6:00 PM",
        teams: "Tech Giants vs Court Kings"
      }
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background py-8">
        {/* Animated background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/20 via-background to-background animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-background to-background animate-pulse delay-1000" />
        </div>

        <div className="relative container mx-auto px-4">
          <BlurFade>
            <div className="text-center space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3">
                <Trophy className="h-8 w-8 text-emerald-500" />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  Competitions
                </h1>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Competitions Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <BlurFade>
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {competitions.map((sport) => {
                const Icon = sport.icon;
                const colorClasses = {
                  emerald: {
                    border: "border-emerald-500/20",
                    text: "text-emerald-500",
                    button: "bg-emerald-500 hover:bg-emerald-600",
                    accent: "bg-emerald-500/10",
                    disabledButton: "bg-emerald-500/50 cursor-not-allowed"
                  },
                  orange: {
                    border: "border-orange-500/20", 
                    text: "text-orange-500",
                    button: "bg-orange-500 hover:bg-orange-600",
                    accent: "bg-orange-500/10",
                    disabledButton: "bg-orange-500/50 cursor-not-allowed"
                  }
                }[sport.color] || {
                  border: "border-emerald-500/20",
                  text: "text-emerald-500",
                  button: "bg-emerald-500 hover:bg-emerald-600",
                  accent: "bg-emerald-500/10",
                  disabledButton: "bg-emerald-500/50 cursor-not-allowed"
                };

                return (
                  <div
                    key={sport.name}
                    className={`relative bg-gradient-to-br ${sport.gradient} backdrop-blur-sm rounded-2xl p-6 border ${colorClasses.border} overflow-hidden group ${sport.available ? 'hover:scale-[1.02]' : 'opacity-75'} transition-all duration-500 hover:shadow-2xl`}
                  >
                    {/* Coming Soon Badge */}
                    {!sport.available && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-600 text-xs font-medium border border-yellow-500/30">
                          Coming Soon
                        </span>
                      </div>
                    )}

                    {/* Background decoration */}
                    <div className={`absolute top-0 right-0 w-32 h-32 ${colorClasses.text} opacity-5 transform rotate-12 translate-x-8 -translate-y-8 ${sport.available ? 'group-hover:scale-110' : ''} transition-transform duration-500`}>
                      <Icon className="w-full h-full" />
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClasses.accent} backdrop-blur-sm ${sport.available ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
                          <Icon className={`h-6 w-6 ${colorClasses.text}`} />
                        </div>
                        <div>
                          <h3 className="text-xl lg:text-2xl font-bold text-foreground">
                            {sport.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">Competitions & Tournaments</p>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                        {sport.description}
                      </p>

                      {/* Competition Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-3 rounded-lg bg-background/30 backdrop-blur-sm">
                          <div className="text-xl font-bold">{sport.stats.activeCompetitions}</div>
                          <div className="text-xs text-muted-foreground">Active</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-background/30 backdrop-blur-sm">
                          <div className="text-xl font-bold">{sport.stats.teams}</div>
                          <div className="text-xs text-muted-foreground">Teams</div>
                        </div>
                      </div>

                      {/* Active Competitions */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Active Competitions
                        </h4>
                        <div className="space-y-2">
                          {sport.competitions.slice(0, 3).map((comp, index) => (
                            <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${colorClasses.text.replace('text-', 'bg-')}`} />
                              {comp}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Next Match */}
                      {sport.available && (
                        <div className="mb-6 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-border/50">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Next Match
                          </h4>
                          <div className="text-sm">
                            <div className="font-medium">{sport.nextMatch.teams}</div>
                            <div className="text-muted-foreground text-xs">
                              {sport.nextMatch.date} at {sport.nextMatch.time}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      {sport.available ? (
                        <Link
                          href={sport.href}
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${colorClasses.button} text-white text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg group`}
                        >
                          View {sport.name} Competitions
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : (
                        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${colorClasses.disabledButton} text-white text-sm font-medium`}>
                          Coming Soon
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-8 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <BlurFade>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">Competition Overview</h2>
              <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                Current season statistics across all sports
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border text-center">
                <Trophy className="h-6 w-6 text-emerald-500 mx-auto mb-3" />
                <div className="text-xl font-bold mb-1">5</div>
                <div className="text-xs text-muted-foreground">Total Competitions</div>
              </div>
              <div className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border text-center">
                <Users className="h-6 w-6 text-blue-500 mx-auto mb-3" />
                <div className="text-xl font-bold mb-1">28</div>
                <div className="text-xs text-muted-foreground">Participating Teams</div>
              </div>
              <div className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border text-center">
                <Calendar className="h-6 w-6 text-purple-500 mx-auto mb-3" />
                <div className="text-xl font-bold mb-1">12</div>
                <div className="text-xs text-muted-foreground">Upcoming Matches</div>
              </div>
              <div className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border text-center">
                <Award className="h-6 w-6 text-orange-500 mx-auto mb-3" />
                <div className="text-xl font-bold mb-1">3</div>
                <div className="text-xs text-muted-foreground">Championships</div>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
