'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, Clock, Trophy, MapPin } from 'lucide-react';
import { teamLogos } from '@/constants';
import { PopIV2FootballFixture } from '@/utils/V2Utils/v2requestData.types';

interface RecentGamesProps {
  fixtures: PopIV2FootballFixture[];
  loading?: boolean;
}

const RecentGames: FC<RecentGamesProps> = ({ fixtures, loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg">
              {/* Mobile loading layout */}
              <div className="flex items-center justify-between sm:hidden">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-muted rounded-full" />
                  <div className="h-4 bg-muted rounded w-16" />
                </div>
                <div className="h-5 bg-muted rounded w-12" />
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-muted rounded w-16" />
                  <div className="w-7 h-7 bg-muted rounded-full" />
                </div>
              </div>

              {/* Desktop loading layout */}
              <div className="hidden sm:flex items-center gap-4 flex-1">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-6 bg-muted rounded w-12" />
                <div className="h-4 bg-muted rounded w-20" />
                <div className="w-8 h-8 bg-muted rounded-full" />
              </div>
              <div className="hidden sm:block h-4 bg-muted rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!fixtures || fixtures.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 text-muted-foreground">
        <Trophy className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
        <p className="text-sm sm:text-base">No recent games available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {fixtures.map((fixture) => {
        const formattedDate = fixture.scheduledDate ? format(new Date(fixture.scheduledDate), "MMM dd") : null;
        const formattedTime = fixture.scheduledDate ? format(new Date(fixture.scheduledDate), "HH:mm") : null;
        
        return (
          <Link
            key={fixture._id}
            href={`/sports/football/fixtures/${fixture._id}/stats`}
            className="block group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border/50 hover:border-emerald-500/30 hover:bg-accent/30 transition-all duration-200">
              {/* Teams and Score - Mobile Layout */}
              <div className="flex items-center justify-between sm:hidden">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="relative w-7 h-7 flex-shrink-0">
                    <Image
                      src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'}
                      alt={fixture.homeTeam.name}
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                  <span className="font-medium text-sm truncate group-hover:text-emerald-600 transition-colors">
                    {fixture.homeTeam.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-full mx-3">
                  <span className="font-bold text-base">{fixture.result.homeScore}</span>
                  <span className="text-muted-foreground text-sm">-</span>
                  <span className="font-bold text-base">{fixture.result.awayScore}</span>
                  {fixture.result.homePenalty !== null && fixture.result.awayPenalty !== null && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({fixture.result.homePenalty}-{fixture.result.awayPenalty})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                  <span className="font-medium text-sm truncate group-hover:text-emerald-600 transition-colors">
                    {fixture.awayTeam.name}
                  </span>
                  <div className="relative w-7 h-7 flex-shrink-0">
                    <Image
                      src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'}
                      alt={fixture.awayTeam.name}
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Teams and Score - Desktop Layout */}
              <div className="hidden sm:flex items-center gap-4 flex-1">
                {/* Home Team */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'}
                      alt={fixture.homeTeam.name}
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                  <span className="font-medium text-sm truncate group-hover:text-emerald-600 transition-colors">
                    {fixture.homeTeam.name}
                  </span>
                </div>

                {/* Score */}
                <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-full">
                  <span className="font-bold text-lg">{fixture.result.homeScore}</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="font-bold text-lg">{fixture.result.awayScore}</span>
                  {fixture.result.homePenalty !== null && fixture.result.awayPenalty !== null && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({fixture.result.homePenalty}-{fixture.result.awayPenalty})
                    </span>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                  <span className="font-medium text-sm truncate group-hover:text-emerald-600 transition-colors">
                    {fixture.awayTeam.name}
                  </span>
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'}
                      alt={fixture.awayTeam.name}
                      fill
                      className="object-contain rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Match Info */}
              <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-1 sm:flex-col text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formattedDate}</span>
                </div>
                {fixture.competition && (
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span className="truncate max-w-24 sm:max-w-20">{fixture.competition.name}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RecentGames;
