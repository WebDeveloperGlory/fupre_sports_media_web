'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Filter, Search, Shield, Target, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { footballTeamApi } from '@/lib/api/v1/football-team.api';
import { FootballTeamResponse } from '@/lib/types/v1.response.types';
import { TeamTypes } from '@/types/v1.football-team.types';
import { teamLogos } from '@/constants';
import { BackButton } from '@/components/ui/back-button';
import { Loader } from '@/components/ui/loader';
import { cn } from '@/utils/cn';

type TeamCardProps = {
  team: FootballTeamResponse;
};

const toLabel = (value: string) => value.replace(/-/g, ' ').toUpperCase();

const resolveTeamId = (team: FootballTeamResponse) => {
  const maybeTeam = team as FootballTeamResponse & { _id?: string };
  return maybeTeam.id || maybeTeam._id || '';
};

const resolveTeamLogo = (team: FootballTeamResponse) =>
  team.logo || teamLogos[team.name] || '/images/team_logos/default.jpg';

export default function FootballTeamsPage() {
  const [teams, setTeams] = useState<FootballTeamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await footballTeamApi.getAll(1, 200);
        const data = Array.isArray(response?.data) ? response.data : [];
        setTeams(data);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams. Please try again.');
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return teams.filter((team) => {
      const matchesQuery =
        !query ||
        team.name.toLowerCase().includes(query) ||
        team.shorthand.toLowerCase().includes(query) ||
        team.faculty?.name?.toLowerCase().includes(query) ||
        team.department?.name?.toLowerCase().includes(query);

      const matchesType = typeFilter === 'all' || team.type === typeFilter;

      return matchesQuery && matchesType;
    });
  }, [teams, searchQuery, typeFilter]);

  const stats = useMemo(() => {
    const totalTeams = teams.length;
    const totalGoals = teams.reduce((sum, team) => sum + (team.stats?.goalsFor ?? 0), 0);
    const totalMatches = teams.reduce((sum, team) => sum + (team.stats?.played ?? 0), 0);
    const cleanSheets = teams.reduce(
      (sum, team) => sum + ((team.stats?.goalsAgainst ?? 0) === 0 ? 1 : 0),
      0
    );

    return { totalTeams, totalGoals, totalMatches, cleanSheets };
  }, [teams]);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-8 md:top-24 left-4 md:left-8 z-40">
        <BackButton />
      </div>

      <section className="relative pt-10 sm:pt-20 pb-8 sm:pb-14 overflow-hidden">
        <div className="absolute -top-10 right-1/2 translate-x-1/2 w-[460px] sm:w-[720px] h-[320px] sm:h-[520px] bg-emerald-500/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-20 right-8 w-[220px] h-[220px] bg-emerald-500/5 rounded-full blur-[90px] -z-10" />

        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              2025/2026 Season
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60">
              Football Teams
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Browse every registered football team, track records, and jump into detailed team profiles.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            <StatPill label="Teams" value={stats.totalTeams} icon={Users} />
            <StatPill label="Matches" value={stats.totalMatches} icon={Trophy} />
            <StatPill label="Goals" value={stats.totalGoals} icon={Target} />
            <StatPill label="Clean Sheets" value={stats.cleanSheets} icon={Shield} />
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/20">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search by team, faculty, or department..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Filter className="w-4 h-4" />
                Filter by type
              </div>
              <div className="relative sm:min-w-[220px]">
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="appearance-none w-full bg-background border border-border text-foreground px-4 py-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="all">All Types</option>
                  {Object.values(TeamTypes).map((type) => (
                    <option key={type} value={type}>
                      {toLabel(type)}
                    </option>
                  ))}
                </select>
                <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 py-6 sm:py-10">
        {loading ? (
          <div className="py-16">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} found
              </p>
              <p className="text-xs text-muted-foreground">
                Updated: {new Date().toLocaleTimeString()}
              </p>
            </div>

            {filteredTeams.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-10 text-center">
                <Users className="w-10 h-10 mx-auto text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-semibold">No teams found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filter options.
                </p>
                <Link
                  href="/sports/football"
                  className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Football Home
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTeams.map((team) => (
                  <TeamCard key={resolveTeamId(team) || team.name} team={team} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

const StatPill = ({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Trophy }) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-card/60 backdrop-blur-sm">
    <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
      <Icon className="h-4 w-4 text-emerald-600" />
    </div>
    <div>
      <div className="text-lg font-bold text-foreground">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  </div>
);

const TeamCard = ({ team }: TeamCardProps) => {
  const teamId = resolveTeamId(team);
  const logoSrc = resolveTeamLogo(team);
  const facultyLabel = team.faculty?.name || team.department?.name || 'General';
  const record = `${team.stats?.wins ?? 0}W-${team.stats?.draws ?? 0}D-${team.stats?.loses ?? 0}L`;
  const goals = `${team.stats?.goalsFor ?? 0}:${team.stats?.goalsAgainst ?? 0}`;

  return (
    <Link href={teamId ? `/teams/${teamId}` : '#'} className="group block">
      <div className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-4 sm:p-5',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/30'
      )}>
        <div className="absolute -right-10 -top-16 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
              <img
                src={logoSrc}
                alt={`${team.name} logo`}
                className="h-full w-full object-contain"
                loading="lazy"
                onError={(event) => {
                  (event.currentTarget as HTMLImageElement).src = '/images/team_logos/default.jpg';
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground truncate">{team.name}</h3>
                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {team.shorthand}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{facultyLabel}</p>
            </div>
          </div>

          <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold uppercase tracking-wide">
            {toLabel(team.type)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-sm font-semibold text-foreground">{record}</div>
            <div className="text-muted-foreground">Record</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{goals}</div>
            <div className="text-muted-foreground">Goals</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{team.stats?.played ?? 0}</div>
            <div className="text-muted-foreground">Played</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>{team.academicYear || 'Season'} </span>
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
            View team
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
};
