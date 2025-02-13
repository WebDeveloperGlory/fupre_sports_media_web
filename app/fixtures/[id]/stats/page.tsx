'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";
import { Trophy, Calendar, Clock, Users, ChevronDown, ChevronUp, Activity, Target, Flag } from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Demo data - replace with actual data from your API
const matchData = {
  id: "1",
  competition: "FUPRE Super League",
  homeTeam: {
    name: "Mechanical Stars",
    logo: "/team-logos/team-a.png",
    score: 2,
    lineup: {
      formation: "4-3-3",
      starting: [
        { number: 1, name: "John Doe", position: "GK" },
        { number: 2, name: "Mike Smith", position: "RB" },
        { number: 4, name: "James Brown", position: "CB" },
        { number: 5, name: "David Wilson", position: "CB" },
        { number: 3, name: "Chris Lee", position: "LB" },
        { number: 6, name: "Tom Clark", position: "CDM" },
        { number: 8, name: "Paul White", position: "CM" },
        { number: 10, name: "Steve Black", position: "CAM" },
        { number: 7, name: "Alex Green", position: "RW" },
        { number: 9, name: "Mark Johnson", position: "ST" },
        { number: 11, name: "Peter Wright", position: "LW" }
      ],
      substitutes: [
        { number: 12, name: "Sam Taylor", position: "GK" },
        { number: 14, name: "Dan Brown", position: "DEF" },
        { number: 16, name: "Joe Davis", position: "MID" },
        { number: 20, name: "Ryan Moore", position: "FWD" }
      ]
    },
    stats: {
      possession: 55,
      shots: 12,
      shotsOnTarget: 6,
      corners: 5,
      fouls: 8,
      yellowCards: 2,
      redCards: 0,
      offsides: 3,
      saves: 4
    }
  },
  awayTeam: {
    name: "Chemical Warriors",
    logo: "/team-logos/team-b.png",
    score: 1,
    lineup: {
      formation: "4-2-3-1",
      starting: [
        { number: 1, name: "Adam Scott", position: "GK" },
        { number: 2, name: "Luke Shaw", position: "RB" },
        { number: 4, name: "Gary Jones", position: "CB" },
        { number: 5, name: "Phil Taylor", position: "CB" },
        { number: 3, name: "Andy Cole", position: "LB" },
        { number: 6, name: "Matt King", position: "CDM" },
        { number: 8, name: "Rob Hall", position: "CDM" },
        { number: 7, name: "Jim Ross", position: "RAM" },
        { number: 10, name: "Ed Wood", position: "CAM" },
        { number: 11, name: "Ben Hill", position: "LAM" },
        { number: 9, name: "Tony Blake", position: "ST" }
      ],
      substitutes: [
        { number: 13, name: "Carl Ward", position: "GK" },
        { number: 15, name: "Tim Long", position: "DEF" },
        { number: 17, name: "Ken Short", position: "MID" },
        { number: 19, name: "Lee Grant", position: "FWD" }
      ]
    },
    stats: {
      possession: 45,
      shots: 8,
      shotsOnTarget: 3,
      corners: 3,
      fouls: 10,
      yellowCards: 1,
      redCards: 0,
      offsides: 2,
      saves: 6
    }
  },
  date: "2024-03-19",
  time: "15:00",
  venue: "FUPRE Main Ground",
  status: "completed",
  referee: "Michael Johnson",
  attendance: 500
};

function QuickStat({ icon, label, home, away }: { icon: React.ReactNode; label: string; home: number; away: number }) {
  return (
    <div className="bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-emerald-500">{home}</span>
        <span className="text-xl font-semibold text-emerald-500">{away}</span>
      </div>
    </div>
  );
}

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away;
  const homePercent = total === 0 ? 50 : (home / total) * 100;
  const awayPercent = total === 0 ? 50 : (away / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-emerald-500">{home}</span>
        <span className="font-medium">{label}</span>
        <span className="font-medium text-emerald-500">{away}</span>
      </div>
      <div className="flex h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${homePercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-emerald-500"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${awayPercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-emerald-500/50"
        />
      </div>
    </div>
  );
}

const LineupSection = ({ team, side }: { team: typeof matchData.homeTeam, side: 'home' | 'away' }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{team.name}</h3>
        <span className="text-sm text-muted-foreground">Formation: {team.lineup.formation}</span>
      </div>

      {/* Starting XI */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Starting XI</h4>
        <div className="space-y-2">
          {team.lineup.starting.map((player) => (
            <div 
              key={player.number}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <span className="w-6 h-6 flex items-center justify-center bg-secondary rounded-full text-xs">
                {player.number}
              </span>
              <span className="flex-1">{player.name}</span>
              <span className="text-sm text-muted-foreground">{player.position}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Substitutes */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Substitutes</h4>
        <div className="space-y-2">
          {team.lineup.substitutes.map((player) => (
            <div 
              key={player.number}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <span className="w-6 h-6 flex items-center justify-center bg-secondary rounded-full text-xs">
                {player.number}
              </span>
              <span className="flex-1">{player.name}</span>
              <span className="text-sm text-muted-foreground">{player.position}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function MatchStatsPage() {
  const [isStatsOpen, setIsStatsOpen] = useState(true);
  const [isLineupsOpen, setIsLineupsOpen] = useState(true);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Back Button */}
      <div className="fixed top-8 left-4 md:left-8 z-10">
        <BackButton />
      </div>

      <div className="pt-24 pb-6 px-4 md:px-6">
        <BlurFade>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Match Header */}
            <div className="relative bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
              
              <div className="relative">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{matchData.competition}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 md:gap-8">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-3 w-1/3">
                    <motion.div 
                      className="relative w-16 h-16 md:w-20 md:h-20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src={matchData.homeTeam.logo}
                        alt={matchData.homeTeam.name}
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                    <span className="text-sm md:text-base font-medium text-center">
                      {matchData.homeTeam.name}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-card shadow-xl rounded-xl p-3 border border-border min-w-[120px]">
                      <div className="text-3xl md:text-4xl font-bold tracking-tighter text-center">
                        <span className="text-emerald-500">{matchData.homeTeam.score}</span>
                        <span className="mx-3 text-muted-foreground">-</span>
                        <span className="text-emerald-500">{matchData.awayTeam.score}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Full Time</span>
                      </div>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-3 w-1/3">
                    <motion.div 
                      className="relative w-16 h-16 md:w-20 md:h-20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src={matchData.awayTeam.logo}
                        alt={matchData.awayTeam.name}
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                    <span className="text-sm md:text-base font-medium text-center">
                      {matchData.awayTeam.name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    <span>{matchData.competition}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(matchData.date).toLocaleDateString()}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{matchData.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickStat
                icon={<Activity className="w-5 h-5 text-emerald-500" />}
                label="Total Shots"
                home={matchData.homeTeam.stats.shots}
                away={matchData.awayTeam.stats.shots}
              />
              <QuickStat
                icon={<Target className="w-5 h-5 text-emerald-500" />}
                label="On Target"
                home={matchData.homeTeam.stats.shotsOnTarget}
                away={matchData.awayTeam.stats.shotsOnTarget}
              />
              <QuickStat
                icon={<Flag className="w-5 h-5 text-emerald-500" />}
                label="Corners"
                home={matchData.homeTeam.stats.corners}
                away={matchData.awayTeam.stats.corners}
              />
              <QuickStat
                icon={<Users className="w-5 h-5 text-emerald-500" />}
                label="Offsides"
                home={matchData.homeTeam.stats.offsides}
                away={matchData.awayTeam.stats.offsides}
              />
            </div>

            {/* Match Stats */}
            <div className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                Match Statistics
              </h2>
              <div className="space-y-6">
                <StatBar 
                  label="Possession %" 
                  home={matchData.homeTeam.stats.possession} 
                  away={matchData.awayTeam.stats.possession} 
                />
                <StatBar 
                  label="Shots" 
                  home={matchData.homeTeam.stats.shots} 
                  away={matchData.awayTeam.stats.shots} 
                />
                <StatBar 
                  label="Shots on Target" 
                  home={matchData.homeTeam.stats.shotsOnTarget} 
                  away={matchData.awayTeam.stats.shotsOnTarget} 
                />
                <StatBar 
                  label="Corners" 
                  home={matchData.homeTeam.stats.corners} 
                  away={matchData.awayTeam.stats.corners} 
                />
                <StatBar 
                  label="Fouls" 
                  home={matchData.homeTeam.stats.fouls} 
                  away={matchData.awayTeam.stats.fouls} 
                />

                {/* Cards Section */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-6 bg-yellow-500 rounded-sm" />
                        <span className="text-sm">Yellow Cards</span>
                      </div>
                      <span className="font-semibold">{matchData.homeTeam.stats.yellowCards}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-6 bg-red-500 rounded-sm" />
                        <span className="text-sm">Red Cards</span>
                      </div>
                      <span className="font-semibold">{matchData.homeTeam.stats.redCards}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{matchData.awayTeam.stats.yellowCards}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Yellow Cards</span>
                        <div className="w-4 h-6 bg-yellow-500 rounded-sm" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{matchData.awayTeam.stats.redCards}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Red Cards</span>
                        <div className="w-4 h-6 bg-red-500 rounded-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lineups */}
            <div className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                Team Lineups
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <LineupSection team={matchData.homeTeam} side="home" />
                <LineupSection team={matchData.awayTeam} side="away" />
              </div>
            </div>

            {/* Match Details */}
            <div className="bg-card/40 backdrop-blur-sm rounded-2xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                Match Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-card/40 backdrop-blur-sm rounded-xl border border-border">
                  <div className="text-sm text-muted-foreground">Referee</div>
                  <div className="font-medium">{matchData.referee}</div>
                </div>
                <div className="p-4 bg-card/40 backdrop-blur-sm rounded-xl border border-border">
                  <div className="text-sm text-muted-foreground">Venue</div>
                  <div className="font-medium">{matchData.venue}</div>
                </div>
                <div className="p-4 bg-card/40 backdrop-blur-sm rounded-xl border border-border">
                  <div className="text-sm text-muted-foreground">Attendance</div>
                  <div className="font-medium">{matchData.attendance}</div>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </main>
  );
} 