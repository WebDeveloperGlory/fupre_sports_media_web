'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { Trophy, Calendar, Clock, ChevronDown, ChevronUp, Users } from "lucide-react";
import { notFound } from "next/navigation";
<<<<<<< HEAD
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { getIndividualCompetition } from "@/lib/requests/competitionPage/requests";
=======
import { use, useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { getIndividualCompetition, getIndividualCompetitionOverview } from "@/lib/requests/competitionPage/requests";
import { Competition } from "@/utils/requestDataTypes";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
>>>>>>> 98eebcb488c4f512bf77ddff4dac43fecd6841c0

// Demo data
const competitions = [
  {
    id: 1,
    name: "FUPRE Super League",
    type: "league",
    status: "ongoing",
    startDate: "March 19th",
    endDate: "April 30th",
    teams: [
      {
        name: "Mechanical Stars",
        logo: "/team-logos/team-a.png",
        played: 2,
        won: 2,
        drawn: 0,
        lost: 0,
        points: 6,
        gf: 6,
        ga: 2,
        form: ["W", "W"]
      },
      {
        name: "Chemical Warriors",
        logo: "/team-logos/team-b.png",
        played: 2,
        won: 1,
        drawn: 1,
        lost: 0,
        points: 4,
        gf: 3,
        ga: 0,
        form: ["W", "D"]
      },
      {
        name: "Petroleum Dragons",
        logo: "/team-logos/team-c.png",
        played: 2,
        won: 1,
        drawn: 1,
        lost: 0,
        points: 4,
        gf: 3,
        ga: 2,
        form: ["D", "W"]
      }
    ],
    fixtures: [
      {
        id: 1,
        homeTeam: "Mechanical Stars",
        awayTeam: "Marine Eagles",
        date: "2024-03-19",
        time: "16:00",
        venue: "FUPRE Main Ground",
        status: "completed",
        score: {
          home: 2,
          away: 0
        }
      },
      {
        id: 2,
        homeTeam: "Chemical Warriors",
        awayTeam: "Petroleum Dragons",
        date: "2024-03-19",
        time: "18:00",
        venue: "FUPRE Main Ground",
        status: "completed",
        score: {
          home: 1,
          away: 1
        }
      },
      {
        id: 3,
        homeTeam: "Petroleum Dragons",
        awayTeam: "Mechanical Stars",
        date: "2024-03-22",
        time: "16:00",
        venue: "FUPRE Main Ground",
        status: "upcoming"
      },
      {
        id: 4,
        homeTeam: "Marine Eagles",
        awayTeam: "Chemical Warriors",
        date: "2024-03-22",
        time: "18:00",
        venue: "FUPRE Main Ground",
        status: "upcoming"
      }
    ]
  }
];

const topScorers = [
  {
    id: 1,
    name: "John Doe",
    team: "Mechanical Stars",
    teamLogo: "/team-logos/team-a.png",
    goals: 4,
    assists: 2,
    matches: 2
  },
  {
    id: 2,
    name: "Jane Smith",
    team: "Chemical Warriors",
    teamLogo: "/team-logos/team-b.png",
    goals: 2,
    assists: 3,
    matches: 2
  },
  {
    id: 3,
    name: "Mike Johnson",
    team: "Petroleum Dragons",
    teamLogo: "/team-logos/team-c.png",
    goals: 2,
    assists: 1,
    matches: 2
  }
];

interface CompetitionTeam {
  name: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  gf: number;
  ga: number;
  form: string[];
}

interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  score?: {
    home: number;
    away: number;
  };
}

interface CompetitionOverview {
  teams: CompetitionTeam[];
  fixtures: Fixture[];
  topScorers: any[]; // We'll keep this as any for now since we haven't seen its structure
}

export default function CompetitionPage({ 
  params 
}: { 
  params: Promise<{ type: string; id: string }> 
}) {
  const resolvedParams = use(params);
<<<<<<< HEAD
  const competition = competitions[0];
  const [ loading, setLoading ] = useState<boolean>( true );
=======
  const [loading, setLoading] = useState(true);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [overview, setOverview] = useState<CompetitionOverview | null>(null);
>>>>>>> 98eebcb488c4f512bf77ddff4dac43fecd6841c0
  const [isTableOpen, setIsTableOpen] = useState(true);
  const [isFixturesOpen, setIsFixturesOpen] = useState(true);
  const [isScorersOpen, setIsScorersOpen] = useState(true);
  const [isTeamsOpen, setIsTeamsOpen] = useState(true);
<<<<<<< HEAD
  
  useEffect( () => {
    const fetchData = async () => {
      const data = await getIndividualCompetition( resolvedParams.id );
      if( data && data.code === '00' ){
        console.log( data.data )
      }
      setLoading( false );
    }

    if( loading ) {
      fetchData();
    }
  }, [ loading ]);

  if (!competition || competition.type !== resolvedParams.type) {
=======

  useEffect(() => {
    const fetchData = async () => {
      const competitionData = await getIndividualCompetition(resolvedParams.id);
      const overviewData = await getIndividualCompetitionOverview(resolvedParams.id);

      if (competitionData && competitionData.code === '00') {
        setCompetition(competitionData.data);
      }

      if (overviewData && overviewData.code === '00') {
        setOverview(overviewData.data);
      }

      setLoading(false);
    };

    fetchData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!competition || !overview) {
>>>>>>> 98eebcb488c4f512bf77ddff4dac43fecd6841c0
    notFound();
  }

  // Sort teams by points, then goal difference
  const sortedTeams = overview?.teams ? [...overview.teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const aGD = a.gf - a.ga;
    const bGD = b.gf - b.ga;
    if (bGD !== aGD) return bGD - aGD;
    return b.gf - a.gf;
  }) : [];

  // Update the date display in the fixtures section
  const formatDate = (dateString: string | Date) => {
    try {
      if (dateString instanceof Date) {
        return format(dateString, 'MMM dd, yyyy');
      }
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <main className="min-h-screen px-4 md:px-6">
      {/* Back Button */}
      <div className="fixed top-[72px] left-4 md:left-8 z-10">
        <BackButton />
      </div>

      <div className="pb-6 space-y-4 md:space-y-6 max-w-6xl mx-auto">
        <BlurFade>
          <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="bg-card rounded-lg p-3 md:p-4 border border-border">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-emerald-500" />
                  <h1 className="text-lg md:text-xl font-bold">{competition.name}</h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    competition.status === 'ongoing' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {competition.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Teams Section */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setIsTeamsOpen(!isTeamsOpen)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-base md:text-lg font-semibold">Participating Teams</h2>
                </div>
                {isTeamsOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isTeamsOpen && overview?.teams && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {overview.teams.map((team: CompetitionTeam) => (
                          <Link
                            key={team.name}
                            href={`/teams/${team.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                          >
                            <div className="relative w-10 h-10">
                              <Image
                                src={team.logo}
                                alt={team.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{team.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {team.played} matches played
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fixtures Section */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setIsFixturesOpen(!isFixturesOpen)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <h2 className="text-base md:text-lg font-semibold">Fixtures</h2>
                {isFixturesOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isFixturesOpen && overview?.fixtures && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-border">
                      <div className="grid gap-3">
                        {overview.fixtures.map((fixture: Fixture) => (
                          <div 
                            key={fixture.id}
                            className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(fixture.date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{fixture.time}</span>
                                </div>
                              </div>
                              <Link
                                href={`/fixtures/${fixture.id}/stats`}
                                className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                              >
                                View Stats
                              </Link>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{fixture.homeTeam}</span>
                              {fixture.status === 'completed' && fixture.score ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">{fixture.score.home}</span>
                                  <span className="text-muted-foreground">-</span>
                                  <span className="font-bold">{fixture.score.away}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">vs</span>
                              )}
                              <span className="font-medium">{fixture.awayTeam}</span>
                            </div>
                            <div className="mt-2 text-xs text-center text-muted-foreground">
                              {fixture.venue}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* League Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setIsTableOpen(!isTableOpen)}
                className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <h2 className="text-lg md:text-xl font-semibold">League Table</h2>
                {isTableOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isTableOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 md:p-6 border-t border-border overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Pos</th>
                            <th className="text-left py-4 px-3 text-sm font-medium text-muted-foreground">Team</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">P</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">W</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">D</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">L</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">GF</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">GA</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">GD</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Pts</th>
                            <th className="text-center py-4 px-3 text-sm font-medium text-muted-foreground">Form</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedTeams.map((team, index) => (
                            <tr key={team.name} className="border-b border-border hover:bg-accent/50 transition-colors">
                              <td className="py-4 px-3 text-sm">{index + 1}</td>
                              <td className="py-4 px-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-8 h-8">
                                    <Image
                                      src={team.logo}
                                      alt={`${team.name} logo`}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <span className="font-medium text-sm md:text-base">{team.name}</span>
                                </div>
                              </td>
                              <td className="text-center py-4 px-3 text-sm">{team.played}</td>
                              <td className="text-center py-4 px-3 text-sm">{team.won}</td>
                              <td className="text-center py-4 px-3 text-sm">{team.drawn}</td>
                              <td className="text-center py-4 px-3 text-sm">{team.lost}</td>
                              <td className="text-center py-4 px-3 text-sm">{team.gf}</td>
                              <td className="text-center py-4 px-3 text-sm">{team.ga}</td>
                              <td className="text-center py-4 px-3 text-sm">{team.gf - team.ga}</td>
                              <td className="text-center py-4 px-3 text-sm font-semibold">{team.points}</td>
                              <td className="text-center py-4 px-3">
                                <div className="flex items-center justify-center gap-1">
                                  {team.form.map((result, i) => (
                                    <span
                                      key={i}
                                      className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${
                                        result === 'W' 
                                          ? 'bg-emerald-500/10 text-emerald-500' 
                                          : result === 'D'
                                          ? 'bg-orange-500/10 text-orange-500'
                                          : 'bg-red-500/10 text-red-500'
                                      }`}
                                    >
                                      {result}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Top Scorers */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setIsScorersOpen(!isScorersOpen)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
              >
                <h2 className="text-xl font-semibold">Top Scorers</h2>
                {isScorersOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isScorersOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t border-border overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-6 px-4 font-medium text-muted-foreground">Rank</th>
                            <th className="text-left py-6 px-4 font-medium text-muted-foreground">Player</th>
                            <th className="text-left py-6 px-4 font-medium text-muted-foreground">Team</th>
                            <th className="text-center py-6 px-4 font-medium text-muted-foreground">Matches</th>
                            <th className="text-center py-6 px-4 font-medium text-muted-foreground">Goals</th>
                            <th className="text-center py-6 px-4 font-medium text-muted-foreground">Assists</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topScorers.map((player, index) => (
                            <tr key={player.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                              <td className="py-6 px-4">{index + 1}</td>
                              <td className="py-6 px-4">
                                <span className="font-medium">{player.name}</span>
                              </td>
                              <td className="py-6 px-4">
                                <div className="flex items-center gap-4">
                                  <div className="relative w-8 h-8">
                                    <Image
                                      src={player.teamLogo}
                                      alt={`${player.team} logo`}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <span>{player.team}</span>
                                </div>
                              </td>
                              <td className="text-center py-6 px-4">{player.matches}</td>
                              <td className="text-center py-6 px-4 font-semibold">{player.goals}</td>
                              <td className="text-center py-6 px-4">{player.assists}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </BlurFade>
      </div>
    </main>
  );
} 