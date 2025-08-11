'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, Filter, Trophy, Users, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { teamLogos } from '@/constants';
import { PopIV2FootballFixture, IV2FootballCompetition } from '@/utils/V2Utils/v2requestData.types';
import { FixtureStatus } from '@/utils/V2Utils/v2requestData.enums';
import { getUpcomingFixtures, getCompletedFixtures } from '@/lib/requests/v2/fixtures/requests';
import { getAllCompetitions } from '@/lib/requests/v2/competition/requests';
import { BackButton } from '@/components/ui/back-button';

type TabType = 'upcoming' | 'completed';

export default function FootballFixturesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [fixtures, setFixtures] = useState<PopIV2FootballFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [competitionsLoading, setCompetitionsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [competitions, setCompetitions] = useState<IV2FootballCompetition[]>([]);

  useEffect(() => {
    fetchData();
    fetchCompetitions();
  }, [activeTab]);

  const fetchCompetitions = async () => {
    setCompetitionsLoading(true);
    try {
      const competitionsResponse = await getAllCompetitions();
      if (competitionsResponse && competitionsResponse.code === '00') {
        const list = competitionsResponse.data;
        setCompetitions(Array.isArray(list) ? list : []);
      } else {
        setCompetitions([]);
      }
    } catch (error) {
      console.error('Error fetching competitions:', error);
      setCompetitions([]);
    } finally {
      setCompetitionsLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch fixtures based on active tab
      const fixturesResponse = activeTab === 'upcoming'
        ? await getUpcomingFixtures(50)
        : await getCompletedFixtures(50);

      if (fixturesResponse && fixturesResponse.code === '00') {
        setFixtures(fixturesResponse.data || []);
      } else {
        setFixtures([]);
      }
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      setFixtures([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFixtures = fixtures.filter(fixture => {
    const matchesSearch = searchQuery === '' ||
      fixture.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fixture.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fixture.competition.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompetition = selectedCompetition === 'all' || fixture.competition._id === selectedCompetition;

    return matchesSearch && matchesCompetition;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="fixed top-8 md:top-24 left-4 md:left-8 z-40">
        <BackButton />
      </div>
      {/* Header Section */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4">
            {/* Title and Description */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Football Fixtures</h1>
              <p className="text-muted-foreground">
                View upcoming matches and completed results from all football competitions
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-8 border-b border-border">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Upcoming Matches
                </div>
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'completed'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Results
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search teams or competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Competition Filter */}
          <div className="relative sm:min-w-[200px]">
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              disabled={competitionsLoading}
              className="appearance-none w-full bg-background border border-border text-foreground px-4 py-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="all">
                {competitionsLoading ? 'Loading competitions...' : 'All Competitions'}
              </option>
              {!competitionsLoading && (Array.isArray(competitions) ? competitions : []).map(comp => (
                <option key={comp._id} value={comp._id}>{comp.name}</option>
              ))}
            </select>
            {competitionsLoading ? (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            )}
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredFixtures.length > 0 ? (
                <>
                  Showing <span className="font-medium text-foreground">{filteredFixtures.length}</span> {activeTab} fixture{filteredFixtures.length !== 1 ? 's' : ''}
                  {selectedCompetition !== 'all' && (
                    <span> in <span className="font-medium text-foreground">{competitions.find(c => c._id === selectedCompetition)?.name}</span></span>
                  )}
                </>
              ) : (
                'No fixtures found'
              )}
            </p>
            {filteredFixtures.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {filteredFixtures.length > 0 ? (
              <div className="space-y-4">
                {filteredFixtures.map((fixture) => (
                  <FixtureCard key={fixture._id} fixture={fixture} />
                ))}
              </div>
            ) : (
              <EmptyState activeTab={activeTab} />
            )}
          </>
        )}
      </div>
    </div>
  );
}


// Props for FixtureCard to avoid inline type literal in parameter (parsing compatibility)
type FixtureCardProps = { fixture: PopIV2FootballFixture };

// Fixture Card Component
const FixtureCard = ({ fixture }: FixtureCardProps) => {
  const dateObj = fixture.scheduledDate ? new Date(fixture.scheduledDate) : null;
  const isValidDate = dateObj instanceof Date && !isNaN(dateObj.getTime());
  const formattedDate = isValidDate ? format(dateObj, 'MMM dd, yyyy') : 'Unknown';
  const formattedTime = isValidDate ? format(dateObj, 'HH:mm') : '--:--';

  return (
    <Link href={`/sports/football/fixtures/${fixture._id}`} className="block">
      <div className="bg-background border border-border hover:border-emerald-500/30 transition-all duration-300 p-4 sm:p-6 rounded-xl cursor-pointer">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Trophy className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-sm font-medium text-emerald-600 truncate">{fixture.competition.name}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">{formattedTime}</span>
            </div>
          </div>
        </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-4 gap-2">
        {/* Home Team */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
            <Image
              src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'}
              alt={`${fixture.homeTeam.name} logo`}
              fill
              className="object-contain rounded-full"
            />
          </div>
          <span className="font-medium text-foreground text-sm sm:text-base truncate">{fixture.homeTeam.name}</span>
        </div>

        {/* Score or VS */}
        <div className="px-2 sm:px-4 flex items-center justify-center flex-shrink-0">
          {fixture.status === FixtureStatus.COMPLETED && fixture.result ? (
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-foreground whitespace-nowrap">
                {fixture.result.homeScore} - {fixture.result.awayScore}
              </div>
              {fixture.result.homePenalty !== undefined && fixture.result.awayPenalty !== undefined && (
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  Pens: {fixture.result.homePenalty} - {fixture.result.awayPenalty}
                </div>
              )}
            </div>
          ) : fixture.status === FixtureStatus.LIVE && fixture.result ? (
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-red-600 whitespace-nowrap">
                {fixture.result.homeScore} - {fixture.result.awayScore}
              </div>
              <div className="text-xs text-red-600 animate-pulse">LIVE</div>
            </div>
          ) : (
            <div className="text-muted-foreground font-medium text-sm sm:text-base">VS</div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
          <span className="font-medium text-foreground text-sm sm:text-base truncate text-right">{fixture.awayTeam.name}</span>
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
            <Image
              src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'}
              alt={`${fixture.awayTeam.name} logo`}
              fill
              className="object-contain rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground min-w-0">
          {fixture.stadium && (
            <>
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{fixture.stadium}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className={`px-2 sm:px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full transition-colors ${
            fixture.status === FixtureStatus.SCHEDULED
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              : fixture.status === FixtureStatus.COMPLETED
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
              : fixture.status === FixtureStatus.LIVE
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
          }`}>
            {fixture.status === FixtureStatus.SCHEDULED ? 'Scheduled' :
             fixture.status === FixtureStatus.COMPLETED ? 'Full Time' :
             fixture.status === FixtureStatus.LIVE ? 'Live' :
             fixture.status}
          </span>
          <div className="flex items-center gap-2">
            <span className="px-2 sm:px-3 py-1 bg-emerald-500 text-white text-xs font-medium uppercase tracking-wide rounded-full">
              View Details
            </span>
            {(fixture.status === FixtureStatus.COMPLETED || fixture.status === FixtureStatus.LIVE) && (
              <span className="px-2 sm:px-3 py-1 bg-emerald-600 text-white text-xs font-medium uppercase tracking-wide rounded-full">
                {fixture.status === FixtureStatus.LIVE ? 'Live Stats' : 'Stats'}
              </span>
            )}
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
};

// Empty State Component
const EmptyState = ({ activeTab }: { activeTab: TabType }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
        {activeTab === 'upcoming' ? (
          <Calendar className="w-8 h-8 text-muted-foreground" />
        ) : (
          <Trophy className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        {activeTab === 'upcoming' ? 'No Upcoming Fixtures' : 'No Completed Fixtures'}
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {activeTab === 'upcoming'
          ? 'There are no scheduled matches at the moment. Check back later for upcoming fixtures.'
          : 'No completed matches to display. Results will appear here after matches are finished.'
        }
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/sports/football/competitions"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors rounded-lg"
        >
          <Trophy className="w-4 h-4" />
          View Competitions
        </Link>
        <Link
          href="/sports/football"
          className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-medium hover:bg-accent transition-colors rounded-lg"
        >
          <Users className="w-4 h-4" />
          Football Home
        </Link>
      </div>
    </div>
  );
};
