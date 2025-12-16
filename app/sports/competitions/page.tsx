'use client'

import Link from "next/link";
import { Trophy, Target, ArrowRight, Calendar, Users, Award, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function CompetitionsPage() {
  const competitions = [
    {
      name: "Football",
      href: "/sports/football",
      description: "University football competitions, leagues, and tournaments",
      icon: Trophy,
      color: "emerald" as const,
      gradient: "from-emerald-500/20 to-emerald-600/5",
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
        "FUPRE Super League",
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
      gradient: "from-orange-500/20 to-orange-600/5",
      available: false,
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
      ],
      nextMatch: {
        date: "Friday",
        time: "6:00 PM",
        teams: "Tech Giants vs Court Kings"
      }
    }
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const colorClasses = {
    emerald: {
      border: "border-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/40",
      text: "text-emerald-500",
      button: "bg-emerald-600 hover:bg-emerald-700",
      accent: "bg-emerald-500/10",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    },
    orange: {
      border: "border-orange-500/20",
      hoverBorder: "hover:border-orange-500/40",
      text: "text-orange-500",
      button: "bg-orange-600 hover:bg-orange-700",
      accent: "bg-orange-500/10",
      iconBg: "bg-orange-100 dark:bg-orange-900/40",
    }
  };

  return (
    <main className="min-h-screen bg-background selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
        {/* Animated Background Glows */}
        <div className="absolute top-0 left-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-emerald-500/10 rounded-full blur-[100px] sm:blur-[140px] -z-10 dark:bg-emerald-500/5 animate-pulse" />
        <div className="absolute top-20 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-orange-500/8 rounded-full blur-[100px] sm:blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container px-4 sm:px-6 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-3 sm:space-y-6"
          >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-secondary text-secondary-foreground">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Season 2024/2025
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60">
              Sports Competitions
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore all sports competitions at FUPRE. Choose your sport and dive into the action.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sports Grid */}
      <section className="py-8 sm:py-12">
        <div className="container px-4 sm:px-6 mx-auto max-w-6xl">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          >
            {competitions.map((sport) => {
              const Icon = sport.icon;
              const colors = colorClasses[sport.color];

              return (
                <motion.div key={sport.name} variants={item}>
                  <Card className={`relative overflow-hidden p-5 sm:p-6 lg:p-8 bg-gradient-to-br ${sport.gradient} backdrop-blur-sm border ${colors.border} ${sport.available ? colors.hoverBorder : ''} transition-all duration-500 ${sport.available ? 'hover:shadow-2xl hover:-translate-y-1' : 'opacity-80'}`}>
                    {/* Coming Soon Badge */}
                    {!sport.available && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-medium border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          Coming Soon
                        </span>
                      </div>
                    )}

                    {/* Background Icon */}
                    <div className={`absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 ${colors.text} opacity-[0.03] transform rotate-12 translate-x-6 -translate-y-6 ${sport.available ? 'group-hover:scale-110' : ''} transition-transform duration-500`}>
                      <Icon className="w-full h-full" />
                    </div>

                    <div className="relative space-y-4 sm:space-y-5">
                      {/* Header */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl ${colors.iconBg} ${sport.available ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
                          <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${colors.text}`} />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                            {sport.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">Competitions & Tournaments</p>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {sport.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="text-center p-3 sm:p-4 rounded-xl bg-background/40 backdrop-blur-sm border border-border/50">
                          <div className="text-xl sm:text-2xl font-bold">{sport.stats.activeCompetitions}</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground">Active</div>
                        </div>
                        <div className="text-center p-3 sm:p-4 rounded-xl bg-background/40 backdrop-blur-sm border border-border/50">
                          <div className="text-xl sm:text-2xl font-bold">{sport.stats.teams}</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground">Teams</div>
                        </div>
                      </div>

                      {/* Active Competitions */}
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 flex items-center gap-2">
                          <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Active Competitions
                        </h4>
                        <div className="space-y-1.5 sm:space-y-2">
                          {sport.competitions.map((comp, index) => (
                            <div key={index} className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
                              {comp}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Next Match */}
                      {sport.available && (
                        <div className="p-3 sm:p-4 rounded-xl bg-background/30 backdrop-blur-sm border border-border/50">
                          <h4 className="font-semibold text-xs sm:text-sm mb-2 flex items-center gap-2">
                            <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                            Next Match
                          </h4>
                          <div className="text-xs sm:text-sm">
                            <div className="font-medium text-foreground">{sport.nextMatch.teams}</div>
                            <div className="text-muted-foreground text-[10px] sm:text-xs mt-0.5">
                              {sport.nextMatch.date} at {sport.nextMatch.time}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      {sport.available ? (
                        <Link
                          href={sport.href}
                          className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full ${colors.button} text-white text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg`}
                        >
                          View Competitions
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-muted text-muted-foreground text-xs sm:text-sm font-medium cursor-not-allowed">
                          Coming Soon
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-10 sm:py-16 bg-secondary/20 border-y border-border/50">
        <div className="container px-4 sm:px-6 mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Season Overview</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Current season statistics across all sports
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
          >
            {[
              { icon: Trophy, label: "Competitions", value: "5", color: "text-emerald-500" },
              { icon: Users, label: "Teams", value: "28", color: "text-blue-500" },
              { icon: Calendar, label: "Matches", value: "12", color: "text-purple-500" },
              { icon: Award, label: "Champions", value: "3", color: "text-orange-500" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={item}>
                <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm border-border/50 text-center hover:shadow-lg transition-all duration-300">
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color} mx-auto mb-2 sm:mb-3`} />
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
