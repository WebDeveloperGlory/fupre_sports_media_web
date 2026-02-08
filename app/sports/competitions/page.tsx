'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Trophy, Target, ArrowRight, Calendar, Users, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { footballCompetitionApi } from '@/lib/api/v1/football-competition.api';
import { footballFixtureApi } from '@/lib/api/v1/football-fixture.api';
import { CompetitionStatus } from '@/types/v1.football-competition.types';

interface Stats {
  competitions: number;
  teams: number;
  matches: number;
  champions: number;
}

interface FootballCardData {
  activeCompetitions: number;
  teams: number;
  upcomingMatches: number;
  competitions: string[];
  nextMatch: {
    date: string;
    time: string;
    teams: string;
  };
}

export default function CompetitionsPage() {
  const [stats, setStats] = useState<Stats>({
    competitions: 0,
    teams: 0,
    matches: 0,
    champions: 0,
  });
  const [footballCard, setFootballCard] = useState<FootballCardData>({
    activeCompetitions: 0,
    teams: 0,
    upcomingMatches: 0,
    competitions: [],
    nextMatch: {
      date: 'TBD',
      time: '--:--',
      teams: 'TBD',
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [competitionsRes, fixturesRes, upcomingRes] = await Promise.all([
          footballCompetitionApi.getAll(1, 200),
          footballFixtureApi.getAll(1, 200),
          footballFixtureApi.getUpcoming(1, 50),
        ]);

        const competitionsData = Array.isArray(competitionsRes?.data) ? competitionsRes.data : [];
        const fixturesData = Array.isArray(fixturesRes?.data) ? fixturesRes.data : [];
        const upcomingData = Array.isArray(upcomingRes?.data) ? upcomingRes.data : [];

        const competitions = competitionsRes?.total ?? competitionsData.length;
        const matches = fixturesRes?.total ?? fixturesData.length;

        // Count unique teams
        const teamSet = new Set<string>();
        competitionsData.forEach((comp: any) => {
          if (comp.teams && Array.isArray(comp.teams)) {
            comp.teams.forEach((team: any) => {
              if (typeof team === "string") {
                teamSet.add(team);
                return;
              }
              if (team?.id) {
                teamSet.add(team.id);
              }
            });
          }
        });
        const teams = teamSet.size || 12;

        // Count completed competitions as champions
        const champions = competitionsData.filter((c: any) => c.status === CompetitionStatus.COMPLETED).length;

        setStats({
          competitions,
          teams: teams || 12,
          matches,
          champions,
        });

        const activeCompetitionsList = competitionsData.filter(
          (c: any) => c.isActive || c.status === CompetitionStatus.ONGOING || c.status === CompetitionStatus.UPCOMING
        );
        const activeCompetitionNames = activeCompetitionsList.length > 0
          ? activeCompetitionsList.map((c: any) => c.name)
          : competitionsData.map((c: any) => c.name);

        const nextMatch = upcomingData[0];
        const nextMatchDate = nextMatch?.scheduledDate ? new Date(nextMatch.scheduledDate) : null;
        const formattedDate = nextMatchDate && !isNaN(nextMatchDate.getTime())
          ? nextMatchDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          : 'TBD';
        const formattedTime = nextMatchDate && !isNaN(nextMatchDate.getTime())
          ? nextMatchDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
          : '--:--';
        const homeName = nextMatch?.homeTeam?.name ?? nextMatch?.temporaryHomeTeamName ?? 'Home';
        const awayName = nextMatch?.awayTeam?.name ?? nextMatch?.temporaryAwayTeamName ?? 'Away';

        setFootballCard({
          activeCompetitions: activeCompetitionsList.length,
          teams: teams || 12,
          upcomingMatches: upcomingRes?.total ?? upcomingData.length,
          competitions: activeCompetitionNames.slice(0, 4),
          nextMatch: {
            date: formattedDate,
            time: formattedTime,
            teams: `${homeName} vs ${awayName}`,
          },
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);
  const competitions = [
    {
      name: "Football",
      href: "/sports/football",
      description: "University football competitions, leagues, and tournaments",
      icon: Trophy,
      available: true,
      stats: {
        activeCompetitions: String(footballCard.activeCompetitions),
        teams: String(footballCard.teams),
        upcomingMatches: String(footballCard.upcomingMatches),
      },
      competitions: footballCard.competitions.length > 0 ? footballCard.competitions : ["No active competitions"],
      nextMatch: footballCard.nextMatch
    },
    {
      name: "Basketball",
      href: "/sports/basketball",
      description: "Basketball tournaments, leagues, and championship games",
      icon: Target,
      available: false,
      stats: {
        activeCompetitions: "2",
        teams: "12",
        upcomingMatches: "4",
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

  return (
    <main className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Hero Section - Clean, Minimal */}
      <section className="pt-10 pb-6 md:pt-16 md:pb-12 px-0 sm:px-4">
        <div className="container mx-auto max-w-5xl px-2 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            {/* Season Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">2025/2026</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Sports Competitions
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore all sports competitions at FUPRE. Choose your sport and dive into the action.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar - Minimal horizontal strip */}
      <section className="border-y border-border py-4 sm:py-6">
        <div className="container mx-auto px-0 sm:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <div className="py-2">
              <span className="text-2xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">{stats.competitions}</span>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Competitions</p>
            </div>
            <div className="py-2">
              <span className="text-2xl md:text-4xl font-bold">{stats.teams}</span>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Teams</p>
            </div>
            <div className="py-2">
              <span className="text-2xl md:text-4xl font-bold">{stats.matches}</span>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Matches</p>
            </div>
            <div className="py-2">
              <span className="text-2xl md:text-4xl font-bold">{stats.champions}</span>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Champions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-0 sm:px-4 max-w-5xl">
          <div className="space-y-4 md:space-y-6">
            {competitions.map((sport) => {
              const Icon = sport.icon;

              return (
                <motion.div
                  key={sport.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`border border-border rounded-xl md:rounded-2xl overflow-hidden ${!sport.available ? 'opacity-60' : ''}`}
                >
                  {/* Header */}
                  <div className="p-4 md:p-8 border-b border-border">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 md:w-7 md:h-7 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold">{sport.name}</h2>
                          <p className="text-sm text-muted-foreground">{sport.description}</p>
                        </div>
                      </div>

                      {!sport.available && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                          <Clock className="w-3 h-3" />
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-8">
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                      {/* Stats */}
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3 md:mb-4">Quick Stats</h3>
                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                          <div className="text-center py-3 px-2 md:p-4 bg-secondary/50 rounded-lg md:rounded-xl">
                            <div className="text-lg md:text-2xl font-bold">{sport.stats.activeCompetitions}</div>
                            <div className="text-[10px] md:text-xs text-muted-foreground mt-1">Active</div>
                          </div>
                          <div className="text-center py-3 px-2 md:p-4 bg-secondary/50 rounded-lg md:rounded-xl">
                            <div className="text-lg md:text-2xl font-bold">{sport.stats.teams}</div>
                            <div className="text-[10px] md:text-xs text-muted-foreground mt-1">Teams</div>
                          </div>
                          <div className="text-center py-3 px-2 md:p-4 bg-secondary/50 rounded-lg md:rounded-xl">
                            <div className="text-lg md:text-2xl font-bold">{sport.stats.upcomingMatches}</div>
                            <div className="text-[10px] md:text-xs text-muted-foreground mt-1">Upcoming</div>
                          </div>
                        </div>
                      </div>

                      {/* Active Competitions */}
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Active Competitions
                        </h3>
                        <div className="space-y-3">
                          {sport.competitions.map((comp, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span>{comp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Next Match */}
                    {sport.available && (
                      <div className="mt-8 p-4 border border-border rounded-xl">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Next Match
                        </h3>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="font-bold">{sport.nextMatch.teams}</div>
                            <div className="text-sm text-muted-foreground">
                              {sport.nextMatch.date} at {sport.nextMatch.time}
                            </div>
                          </div>
                          <Link
                            href={sport.href}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                          >
                            View Competitions
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Action Button for unavailable sports */}
                    {!sport.available && (
                      <div className="mt-8">
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed">
                          Coming Soon
                          <Clock className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-10 border-t border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sports/football"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:bg-secondary transition-colors text-sm font-medium"
            >
              <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Football
            </Link>
            <Link
              href="/sports/football/fixtures"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:bg-secondary transition-colors text-sm font-medium"
            >
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Fixtures
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:bg-secondary transition-colors text-sm font-medium"
            >
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Teams
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
