'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";
import { Trophy, Calendar } from "lucide-react";

// Demo data - this would come from your live match state
const matchStats = {
  competition: "FUPRE Super League",
  homeTeam: {
    name: "Mechanical Stars",
    logo: "/team-logos/team-a.png",
    score: 2,
    stats: {
      possession: 55,
      shots: 12,
      shotsOnTarget: 6,
      corners: 5,
      fouls: 8,
      yellowCards: 2,
      redCards: 0
    }
  },
  awayTeam: {
    name: "Chemical Warriors",
    logo: "/team-logos/team-b.png",
    score: 1,
    stats: {
      possession: 45,
      shots: 8,
      shotsOnTarget: 3,
      corners: 3,
      fouls: 10,
      yellowCards: 1,
      redCards: 0
    }
  },
  currentTime: "75'",
  date: "Today"
};

const StatBar = ({ label, home, away }: { label: string; home: number; away: number }) => {
  const total = home + away;
  const homeWidth = Math.round((home / total) * 100);
  const awayWidth = 100 - homeWidth;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{home}</span>
        <span className="font-medium text-foreground">{label}</span>
        <span>{away}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden flex">
        <div 
          className="bg-emerald-500" 
          style={{ width: `${homeWidth}%` }}
        />
        <div 
          className="bg-orange-500" 
          style={{ width: `${awayWidth}%` }}
        />
      </div>
    </div>
  );
};

export default function LiveStatsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="fixed top-8 left-8 z-10">
        <BackButton />
      </div>

      <div className="py-16 container">
        <BlurFade>
          <div className="space-y-8">
            {/* Match Header */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-emerald-500">LIVE</span>
                  <span className="text-sm text-muted-foreground">{matchStats.currentTime}</span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 w-full">
                  <div className="flex flex-col items-center gap-4 md:w-1/3">
                    <div className="relative w-16 h-16 md:w-20 md:h-20">
                      <Image
                        src={matchStats.homeTeam.logo}
                        alt={matchStats.homeTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-base md:text-lg font-medium text-center">{matchStats.homeTeam.name}</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 md:w-1/6">
                    <div className="text-3xl md:text-4xl font-bold tracking-tighter">
                      <span>{matchStats.homeTeam.score}</span>
                      <span className="text-muted-foreground mx-3">-</span>
                      <span>{matchStats.awayTeam.score}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4 md:w-1/3">
                    <div className="relative w-16 h-16 md:w-20 md:h-20">
                      <Image
                        src={matchStats.awayTeam.logo}
                        alt={matchStats.awayTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-base md:text-lg font-medium text-center">{matchStats.awayTeam.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    <span>{matchStats.competition}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{matchStats.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Stats */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-8">Match Stats</h2>
              <div className="space-y-6">
                <StatBar 
                  label="Possession %" 
                  home={matchStats.homeTeam.stats.possession} 
                  away={matchStats.awayTeam.stats.possession} 
                />
                <StatBar 
                  label="Shots" 
                  home={matchStats.homeTeam.stats.shots} 
                  away={matchStats.awayTeam.stats.shots} 
                />
                <StatBar 
                  label="Shots on Target" 
                  home={matchStats.homeTeam.stats.shotsOnTarget} 
                  away={matchStats.awayTeam.stats.shotsOnTarget} 
                />
                <StatBar 
                  label="Corners" 
                  home={matchStats.homeTeam.stats.corners} 
                  away={matchStats.awayTeam.stats.corners} 
                />
                <StatBar 
                  label="Fouls" 
                  home={matchStats.homeTeam.stats.fouls} 
                  away={matchStats.awayTeam.stats.fouls} 
                />

                {/* Cards */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-6 bg-yellow-500 rounded-sm" />
                        <span className="text-sm">Yellow Cards</span>
                      </div>
                      <span className="font-semibold">{matchStats.homeTeam.stats.yellowCards}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-6 bg-red-500 rounded-sm" />
                        <span className="text-sm">Red Cards</span>
                      </div>
                      <span className="font-semibold">{matchStats.homeTeam.stats.redCards}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{matchStats.awayTeam.stats.yellowCards}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Yellow Cards</span>
                        <div className="w-4 h-6 bg-yellow-500 rounded-sm" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{matchStats.awayTeam.stats.redCards}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Red Cards</span>
                        <div className="w-4 h-6 bg-red-500 rounded-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </main>
  );
} 