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
import { getAllCompetitions } from '@/lib/requests/v2/admin/super-admin/live-management/requests';
import { BackButton } from '@/components/ui/back-button';

type TabType = 'upcoming' | 'completed';

export default function FootballFixturesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [fixtures, setFixtures] = useState<PopIV2FootballFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [competitions, setCompetitions] = useState<IV2FootballCompetition[]>([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch fixtures based on active tab
      const fixturesResponse = activeTab === 'upcoming'
        ? await getUpcomingFixtures(50)
        : await getCompletedFixtures(50);

      if (fixturesResponse && fixturesResponse.code === '00') {
        setFixtures(fixturesResponse.data || []);
      }

      // Fetch competitions for filter
      const competitionsResponse = await getAllCompetitions(500);
      if (competitionsResponse && competitionsResponse.code === '00') {
        const list = competitionsResponse.data;
        setCompetitions(Array.isArray(list) ? list : []);
      } else {
        setCompetitions([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
              className="w-full pl-10 pr-4 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Competition Filter */}
          <div className="relative">
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              className="appearance-none bg-background border border-border text-foreground px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Competitions</option>
              {(Array.isArray(competitions) ? competitions : []).map(comp => (
                <option key={comp._id} value={comp._id}>{comp.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
          </div>
        </div>

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

// Fixture Card Component
const FixtureCard = ({ fixture }: { fixture: PopIV2FootballFixture }) => {
  const dateObj = fixture.scheduledDate ? new Date(fixture.scheduledDate) : null;
  const isValidDate = dateObj instanceof Date && !isNaN(dateObj.getTime());
  const formattedDate = isValidDate ? format(dateObj, 'MMM dd, yyyy') : 'Unknown';
  const formattedTime = isValidDate ? format(dateObj, 'HH:mm') : '--:--';

  return (
    <div className="bg-background border border-border hover:border-emerald-500/30 transition-colors p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-600 truncate">{fixture.competition.name}</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-4">
        {/* Home Team */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
            <Image
              src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'}
              alt={`${fixture.homeTeam.name} logo`}
              fill
              className="object-contain"
            />
          </div>
          <span className="font-medium text-foreground text-sm sm:text-base truncate">{fixture.homeTeam.name}</span>
        </div>

        {/* Score or VS */}
        <div className="px-3 sm:px-6 flex items-center justify-center">
          {fixture.status === FixtureStatus.COMPLETED && fixture.result ? (
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                {fixture.result.homeScore} - {fixture.result.awayScore}
              </div>
              {fixture.result.homePenalty !== undefined && fixture.result.awayPenalty !== undefined && (
                <div className="text-xs text-muted-foreground">
                  Pens: {fixture.result.homePenalty} - {fixture.result.awayPenalty}
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground font-medium text-sm sm:text-base">VS</div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
          <span className="font-medium text-foreground text-sm sm:text-base truncate">{fixture.awayTeam.name}</span>
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
            <Image
              src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'}
              alt={`${fixture.awayTeam.name} logo`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          {fixture.stadium && (
            <>
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">{fixture.stadium}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`px-2 sm:px-3 py-1 text-xs font-medium uppercase tracking-wide ${
            fixture.status === FixtureStatus.SCHEDULED
              ? 'bg-blue-100 text-blue-800'
              : fixture.status === FixtureStatus.COMPLETED
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {fixture.status === FixtureStatus.SCHEDULED ? 'Scheduled' :
             fixture.status === FixtureStatus.COMPLETED ? 'Full Time' :
             fixture.status}
          </span>
          {fixture.status === FixtureStatus.COMPLETED && (
            <Link
              href={`/fixtures/${fixture._id}/stats`}
              className="px-2 sm:px-3 py-1 bg-emerald-500 text-white text-xs font-medium uppercase tracking-wide hover:bg-emerald-600 transition-colors"
            >
              Stats
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ activeTab }: { activeTab: TabType }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-muted flex items-center justify-center">
        {activeTab === 'upcoming' ? (
          <Calendar className="w-8 h-8 text-muted-foreground" />
        ) : (
          <Trophy className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        {activeTab === 'upcoming' ? 'No Upcoming Fixtures' : 'No Completed Fixtures'}
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        {activeTab === 'upcoming'
          ? 'There are no scheduled matches at the moment. Check back later for upcoming fixtures.'
          : 'No completed matches to display. Results will appear here after matches are finished.'
        }
      </p>
      <div className="mt-6">
        <Link
          href="/sports/football/competitions"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
        >
          <Trophy className="w-4 h-4" />
          View Competitions
        </Link>
      </div>
    </div>
  );
};
