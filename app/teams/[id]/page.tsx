'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Trophy, Users, User } from 'lucide-react';
import { format } from 'date-fns';

import { BlurFade } from '@/components/ui/blur-fade';
import { BackButton } from '@/components/ui/back-button';
import { Loader } from '@/components/ui/loader';
import { footballTeamApi } from '@/lib/api/v1/football-team.api';
import { footballFixtureApi } from '@/lib/api/v1/football-fixture.api';
import {
  FootballTeamResponse,
  FootballPlayerContractResponse,
  FixtureResponse,
} from '@/lib/types/v1.response.types';
import { FixtureStatus } from '@/types/v1.football-fixture.types';
import { teamLogos } from '@/constants';

export default function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const [loading, setLoading] = useState<boolean>(true);
  const [team, setTeam] = useState<FootballTeamResponse | null>(null);
  const [contracts, setContracts] = useState<FootballPlayerContractResponse[]>([]);
  const [fixtures, setFixtures] = useState<FixtureResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, contractsRes, fixturesRes] = await Promise.all([
          footballTeamApi.getByID(resolvedParams.id),
          footballTeamApi.getTeamPlayersContracts(resolvedParams.id, 1, 100),
          footballFixtureApi.getByTeam({ team: resolvedParams.id, page: 1, limit: 50 }),
        ]);

        if (teamRes?.success) {
          setTeam(teamRes.data);
        }

        if (contractsRes?.success) {
          setContracts(Array.isArray(contractsRes.data) ? contractsRes.data : []);
        }

        if (fixturesRes?.data) {
          setFixtures(Array.isArray(fixturesRes.data) ? fixturesRes.data : []);
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (loading) fetchData();
  }, [loading, resolvedParams.id]);

  const stats = team?.stats ?? {
    played: 0,
    wins: 0,
    draws: 0,
    loses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
  };
  const goalDifference = stats.goalsFor - stats.goalsAgainst;

  const teamLogo = team?.logo || (team?.name ? teamLogos[team.name] : undefined) || '/images/team_logos/default.jpg';
  const departmentName = team?.department?.name || team?.faculty?.name || 'General';
  const departmentCode = team?.department?.code || team?.faculty?.code || null;
  const teamTypeLabel = team?.type ? team.type.replace(/-/g, ' ').toUpperCase() : 'TEAM';

  const headCoach = team?.coaches?.find((coach) => coach.role === 'head')?.name || 'Unregistered';
  const assistantCoach = team?.coaches?.find((coach) => coach.role === 'assistant')?.name || 'Unregistered';

  const sortedFixtures = useMemo(() => {
    return [...fixtures].sort((a, b) => {
      const aDate = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
      const bDate = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
      return bDate - aDate;
    });
  }, [fixtures]);

  if (loading) {
    return <Loader />;
  }

  if (!team) {
    return <div className="min-h-screen flex items-center justify-center">Team not found</div>;
  }

  return (
    <main className="min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-10">
        <BackButton />
      </div>

      <div className="pt-16 md:pt-0 space-y-6 max-w-6xl mx-auto px-0 sm:px-4">
        <BlurFade>
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <Image
                    src={teamLogo}
                    alt={team.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 mb-3">
                    {teamTypeLabel}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{team.name}</h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-emerald-500" />
                      <span>{departmentName}</span>
                    </div>
                    {departmentCode && <span>• {departmentCode}</span>}
                    <span>•</span>
                    <span>{team.academicYear}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Matches Played" value={stats.played} accent="text-emerald-500" />
              <StatCard label="Wins" value={stats.wins} accent="text-emerald-500" />
              <StatCard label="Draws" value={stats.draws} accent="text-amber-500" />
              <StatCard label="Losses" value={stats.loses} accent="text-red-500" />
              <StatCard label="Goals For" value={stats.goalsFor} accent="text-emerald-500" />
              <StatCard label="Goals Against" value={stats.goalsAgainst} accent="text-red-500" />
              <StatCard label="Goal Difference" value={goalDifference} accent="text-foreground" />
              <StatCard label="Clean Sheets" value={stats.goalsAgainst === 0 ? 1 : 0} accent="text-emerald-500" />
            </div>

            <div className="bg-card rounded-xl p-6 border border-border space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Head Coach</h2>
                <div className="flex items-center gap-4">
                  <User className="w-10 h-10" />
                  <div>
                    <h3 className="font-medium">{headCoach}</h3>
                    <p className="text-sm text-muted-foreground">Role: Head Coach</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Assistant Coach</h2>
                <div className="flex items-center gap-4">
                  <User className="w-10 h-10" />
                  <div>
                    <h3 className="font-medium">{assistantCoach}</h3>
                    <p className="text-sm text-muted-foreground">Role: Assistant Coach</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold">Squad List</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contracts.length > 0 ? (
                  contracts.map((contract, index) => (
                    <div
                      key={contract.id ?? contract.player?._id ?? index}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <span className="w-8 h-8 flex items-center justify-center bg-secondary rounded-full text-sm font-medium">
                        {contract.jerseyNumber ?? index + 1}
                      </span>
                      <div>
                        <h3 className="font-medium">{contract.player?.name ?? 'Unknown Player'}</h3>
                        <p className="text-sm text-muted-foreground">{contract.position}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <span>No Registered Players</span>
                )}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Fixtures</h2>
              <div className="space-y-4">
                {sortedFixtures.length > 0 ? (
                  sortedFixtures.map((fixture) => {
                    const dateObj = fixture.scheduledDate ? new Date(fixture.scheduledDate) : null;
                    const isValidDate = dateObj instanceof Date && !isNaN(dateObj.getTime());
                    const formattedDate = isValidDate ? format(dateObj, 'yyyy-MM-dd') : 'TBD';
                    const formattedTime = isValidDate ? format(dateObj, 'HH:mm') : '--:--';
                    const homeName = fixture.homeTeam?.name ?? fixture.temporaryHomeTeamName ?? 'Home';
                    const awayName = fixture.awayTeam?.name ?? fixture.temporaryAwayTeamName ?? 'Away';
                    const isHome = fixture.homeTeam?.id === team.id;

                    return (
                      <Link
                        key={fixture.id}
                        href={`/sports/football/fixtures/${fixture.id}`}
                        className="flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-3 md:mb-0 basis-full md:basis-1/3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            <span>{formattedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-emerald-500" />
                            <span>{formattedTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center text-base md:text-lg font-medium basis-full md:basis-1/3">
                          <span
                            className={`basis-5/12 text-left ${isHome ? 'text-emerald-500' : ''}`}
                          >
                            {homeName}
                          </span>
                          {fixture.status === FixtureStatus.COMPLETED && fixture.result ? (
                            <span className="text-sm text-muted-foreground basis-2/12 text-center">
                              {fixture.result.homeScore} - {fixture.result.awayScore}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground basis-2/12 text-center">
                              {fixture.status === FixtureStatus.LIVE ? 'live' : 'vs'}
                            </span>
                          )}
                          <span
                            className={`basis-5/12 text-right ${!isHome ? 'text-emerald-500' : ''}`}
                          >
                            {awayName}
                          </span>
                        </div>

                        <div className="hidden md:block text-sm text-muted-foreground basis-full md:basis-1/3 text-right">
                          {fixture.stadium || 'TBD'}
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="text-sm text-muted-foreground">No fixtures available.</div>
                )}
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </main>
  );
}

const StatCard = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) => (
  <div className="bg-card rounded-lg p-4 border border-border">
    <div className={`text-2xl font-bold ${accent}`}>{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);
