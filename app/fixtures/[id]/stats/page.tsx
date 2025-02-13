'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";
import { Trophy, Calendar, Clock, Users, History, Swords } from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";

// Demo data - replace with actual data from your API
const matchData = {
  id: "1",
  competition: "FUPRE Super League",
  homeTeam: {
    name: "Mechanical Stars",
    logo: "/team-logos/team-a.png",
    form: ["W", "W", "L", "D", "W"],
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
    }
  },
  awayTeam: {
    name: "Chemical Warriors",
    logo: "/team-logos/team-b.png",
    form: ["L", "W", "W", "D", "W"],
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
    }
  },
  date: "2024-03-19",
  time: "15:00",
  venue: "FUPRE Main Ground",
  status: "upcoming",
  referee: "Michael Johnson",
  headToHead: {
    totalMatches: 8,
    homeWins: 3,
    draws: 2,
    awayWins: 3,
    lastMatches: [
      {
        date: "2024-02-15",
        competition: "Unity Cup",
        homeTeam: "Mechanical Stars",
        awayTeam: "Chemical Warriors",
        score: "2-1"
      },
      {
        date: "2023-11-30",
        competition: "League",
        homeTeam: "Chemical Warriors",
        awayTeam: "Mechanical Stars",
        score: "0-0"
      },
      {
        date: "2023-09-15",
        competition: "League",
        homeTeam: "Mechanical Stars",
        awayTeam: "Chemical Warriors",
        score: "1-2"
      }
    ]
  }
};

function FormIndicator({ result }: { result: string }) {
  const getColor = (result: string) => {
    switch (result) {
      case "W":
        return "bg-emerald-500";
      case "D":
        return "bg-orange-500";
      case "L":
        return "bg-red-500";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className={cn(
      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white",
      getColor(result)
    )}>
      {result}
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
  const [activeTab, setActiveTab] = useState<'details' | 'lineups'>('details');

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Back Button */}
      <div className="fixed top-4 left-3 md:top-8 md:left-8 z-10">
        <BackButton />
      </div>

      <div className="pt-16 pb-4 px-3 md:pt-24 md:pb-6 md:px-6">
        <BlurFade>
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {/* Match Header */}
            <div className="relative bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
              
              <div className="relative">
                <div className="text-center mb-3 md:mb-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-2.5 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                    <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    <span>{matchData.competition}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 md:gap-8">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-2 md:gap-3 w-1/3">
                    <motion.div 
                      className="relative w-12 h-12 md:w-20 md:h-20"
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
                    <span className="text-xs md:text-base font-medium text-center">
                      {matchData.homeTeam.name}
                    </span>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-card shadow-xl rounded-lg md:rounded-xl p-2 md:p-3 border border-border min-w-[90px] md:min-w-[120px]">
                      <div className="text-2xl md:text-4xl font-bold tracking-tighter text-center">
                        <span className="text-muted-foreground">VS</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 md:gap-1.5 mt-0.5 md:mt-1 text-[10px] md:text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span>Upcoming</span>
                      </div>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-2 md:gap-3 w-1/3">
                    <motion.div 
                      className="relative w-12 h-12 md:w-20 md:h-20"
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
                    <span className="text-xs md:text-base font-medium text-center">
                      {matchData.awayTeam.name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{matchData.competition}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{new Date(matchData.date).toLocaleDateString()}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{matchData.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('details')}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === 'details'
                    ? "text-emerald-500 border-b-2 border-emerald-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('lineups')}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === 'lineups'
                    ? "text-emerald-500 border-b-2 border-emerald-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Lineups
              </button>
            </div>

            {activeTab === 'details' ? (
              <>
                {/* Team Forms */}
                <div className="bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
                  <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
                    <History className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                    <span>Team Forms</span>
                  </h2>
                  <div className="space-y-4">
                    {/* Home Team Form */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 md:w-10 md:h-10">
                          <Image
                            src={matchData.homeTeam.logo}
                            alt={matchData.homeTeam.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="font-medium">{matchData.homeTeam.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {matchData.homeTeam.form.map((result, index) => (
                          <FormIndicator key={index} result={result} />
                        ))}
                      </div>
                    </div>
                    {/* Away Team Form */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 md:w-10 md:h-10">
                          <Image
                            src={matchData.awayTeam.logo}
                            alt={matchData.awayTeam.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="font-medium">{matchData.awayTeam.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {matchData.awayTeam.form.map((result, index) => (
                          <FormIndicator key={index} result={result} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Head to Head */}
                <div className="bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
                  <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
                    <Swords className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                    <span>Head to Head</span>
                  </h2>
                  
                  {/* Overall Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-500">{matchData.headToHead.homeWins}</div>
                      <div className="text-sm text-muted-foreground">Home Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{matchData.headToHead.draws}</div>
                      <div className="text-sm text-muted-foreground">Draws</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-500">{matchData.headToHead.awayWins}</div>
                      <div className="text-sm text-muted-foreground">Away Wins</div>
                    </div>
                  </div>

                  {/* Last Matches */}
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Last Matches</h3>
                  <div className="space-y-3">
                    {matchData.headToHead.lastMatches.map((match, index) => (
                      <div
                        key={index}
                        className="bg-card/40 backdrop-blur-sm rounded-lg p-3 border border-border"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{new Date(match.date).toLocaleDateString()}</span>
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                            {match.competition}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-medium">{match.homeTeam}</span>
                          <span className="font-bold mx-3">{match.score}</span>
                          <span className="font-medium">{match.awayTeam}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Match Details */}
                <div className="bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
                  <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    Match Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <div className="p-3 md:p-4 bg-card/40 backdrop-blur-sm rounded-lg md:rounded-xl border border-border">
                      <div className="text-xs md:text-sm text-muted-foreground">Referee</div>
                      <div className="text-sm md:text-base font-medium">{matchData.referee}</div>
                    </div>
                    <div className="p-3 md:p-4 bg-card/40 backdrop-blur-sm rounded-lg md:rounded-xl border border-border">
                      <div className="text-xs md:text-sm text-muted-foreground">Venue</div>
                      <div className="text-sm md:text-base font-medium">{matchData.venue}</div>
                    </div>
                    <div className="p-3 md:p-4 bg-card/40 backdrop-blur-sm rounded-lg md:rounded-xl border border-border">
                      <div className="text-xs md:text-sm text-muted-foreground">Status</div>
                      <div className="text-sm md:text-base font-medium capitalize">{matchData.status}</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
                <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                  <span>Team Lineups</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <LineupSection team={matchData.homeTeam} side="home" />
                  <LineupSection team={matchData.awayTeam} side="away" />
                </div>
              </div>
            )}
          </div>
        </BlurFade>
      </div>
    </main>
  );
} 