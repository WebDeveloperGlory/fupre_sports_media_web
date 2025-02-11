'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";
import { Trophy, Calendar, Clock, Users, ChevronDown, ChevronUp } from "lucide-react";
import { notFound } from "next/navigation";
import { use, useState } from "react";
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    matchData.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {matchData.status === 'completed' ? 'Full Time' : 'Upcoming'}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 w-full">
                  <div className="flex flex-col items-center gap-4 md:w-1/3">
                    <div className="relative w-16 h-16 md:w-20 md:h-20">
                      <Image
                        src={matchData.homeTeam.logo}
                        alt={matchData.homeTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-base md:text-lg font-medium text-center">{matchData.homeTeam.name}</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 md:w-1/6">
                    {matchData.status === 'completed' ? (
                      <div className="text-3xl md:text-4xl font-bold tracking-tighter">
                        <span>{matchData.homeTeam.score}</span>
                        <span className="text-muted-foreground mx-3">-</span>
                        <span>{matchData.awayTeam.score}</span>
                      </div>
                    ) : (
                      <div className="text-xl font-semibold text-muted-foreground">VS</div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-4 md:w-1/3">
                    <div className="relative w-16 h-16 md:w-20 md:h-20">
                      <Image
                        src={matchData.awayTeam.logo}
                        alt={matchData.awayTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-base md:text-lg font-medium text-center">{matchData.awayTeam.name}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
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

            {/* Match Stats */}
            {matchData.status === 'completed' && (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setIsStatsOpen(!isStatsOpen)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
                >
                  <h2 className="text-xl font-semibold">Match Stats</h2>
                  {isStatsOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {isStatsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 border-t border-border">
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
                          <StatBar 
                            label="Offsides" 
                            home={matchData.homeTeam.stats.offsides} 
                            away={matchData.awayTeam.stats.offsides} 
                          />
                          <StatBar 
                            label="Saves" 
                            home={matchData.homeTeam.stats.saves} 
                            away={matchData.awayTeam.stats.saves} 
                          />

                          {/* Cards */}
                          <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="space-y-2">
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
                            <div className="space-y-2">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Lineups */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setIsLineupsOpen(!isLineupsOpen)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-xl font-semibold">Lineups</h2>
                </div>
                {isLineupsOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isLineupsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t border-border">
                      <div className="grid md:grid-cols-2 gap-8">
                        <LineupSection team={matchData.homeTeam} side="home" />
                        <LineupSection team={matchData.awayTeam} side="away" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Match Details */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-6">Match Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="text-sm text-muted-foreground">Referee</div>
                  <div className="font-medium">{matchData.referee}</div>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="text-sm text-muted-foreground">Venue</div>
                  <div className="font-medium">{matchData.venue}</div>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
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