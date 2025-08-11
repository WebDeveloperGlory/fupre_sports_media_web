'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { Loader } from "@/components/ui/loader";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users, Trophy, Target, AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { PopIV2FootballFixture } from "@/utils/V2Utils/v2requestData.types";
import { FixtureStatus } from "@/utils/V2Utils/v2requestData.enums";
import { getFixtureById } from "@/lib/requests/v2/fixtures/requests";
import { teamLogos } from "@/constants";

export default function FixturePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params);
  const [fixture, setFixture] = useState<PopIV2FootballFixture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixture = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFixtureById(resolvedParams.id);

        if (response && response.data) {
          setFixture(response.data);
        } else {
          setError("Fixture not found");
        }
      } catch (err) {
        console.error("Error fetching fixture:", err);
        setError("Failed to load fixture data");
      } finally {
        setLoading(false);
      }
    };

    fetchFixture();
  }, [resolvedParams.id]);

  if (loading) {
    return <Loader />;
  }

  if (error || !fixture) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="fixed top-24 left-8 z-10">
        <BackButton />
      </div>

      {/* Stats Button - Only show for completed/live matches */}
      {(fixture.status === FixtureStatus.COMPLETED || fixture.status === FixtureStatus.LIVE) && (
        <div className="fixed top-24 right-8 z-10">
          <Link
            href={`/sports/football/fixtures/${fixture._id}/stats`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors rounded-lg shadow-lg"
          >
            <Trophy className="w-4 h-4" />
            {fixture.status === FixtureStatus.LIVE ? 'Live Stats' : 'View Stats'}
          </Link>
        </div>
      )}

      <div className="py-24 container">
        <BlurFade>
          <div className="space-y-8">
            {/* Header Card */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="space-y-6">
                {/* Competition Name */}
                <div className="text-center">
                  <span className="text-sm font-medium text-emerald-500">
                    {fixture.competition.name}
                  </span>
                </div>

                {/* Teams and Score */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={teamLogos[fixture.homeTeam.name] || '/images/team_logos/default.jpg'}
                        alt={fixture.homeTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-medium text-lg">{fixture.homeTeam.name}</span>
                    {fixture.status === FixtureStatus.COMPLETED && (
                      <span className="text-3xl font-bold">{fixture.result.homeScore}</span>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    {fixture.status === FixtureStatus.COMPLETED ? (
                      <span className="text-xl font-semibold text-muted-foreground">FT</span>
                    ) : fixture.status === FixtureStatus.LIVE ? (
                      <span className="text-xl font-semibold text-red-500">LIVE</span>
                    ) : (
                      <span className="text-xl font-semibold">VS</span>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={teamLogos[fixture.awayTeam.name] || '/images/team_logos/default.jpg'}
                        alt={fixture.awayTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-medium text-lg">{fixture.awayTeam.name}</span>
                    {fixture.status === FixtureStatus.COMPLETED && (
                      <span className="text-3xl font-bold">{fixture.result.awayScore}</span>
                    )}
                  </div>
                </div>

                {/* Match Details */}
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(fixture.scheduledDate), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(fixture.scheduledDate), 'HH:mm')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{fixture.stadium}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Match Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="text-sm text-muted-foreground">Referee</div>
                  <div className="font-medium">{fixture.referee || 'TBD'}</div>
                </div>
                {fixture.attendance && (
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="text-sm text-muted-foreground">Attendance</div>
                    <div className="font-medium">{fixture.attendance.toLocaleString()}</div>
                  </div>
                )}
                {fixture.weather && (
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="text-sm text-muted-foreground">Weather</div>
                    <div className="font-medium">{fixture.weather.condition}, {fixture.weather.temperature}°C</div>
                  </div>
                )}
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="text-sm text-muted-foreground">Match Type</div>
                  <div className="font-medium capitalize">{fixture.matchType}</div>
                </div>
              </div>
            </div>

            {/* Goal Scorers - Only show for completed matches */}
            {fixture.status === FixtureStatus.COMPLETED && fixture.goalScorers && fixture.goalScorers.length > 0 && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-500" />
                  Goal Scorers
                </h2>
                <div className="space-y-3">
                  {fixture.goalScorers.map((scorer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          ⚽
                        </div>
                        <div>
                          <div className="font-medium">{scorer.player}</div>
                          <div className="text-sm text-muted-foreground">{scorer.team}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-emerald-500">
                        {scorer.time}'
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Match Statistics - Only show for completed matches */}
            {fixture.status === FixtureStatus.COMPLETED && fixture.statistics && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-emerald-500" />
                  Match Statistics
                </h2>
                <div className="space-y-4">
                  {/* Shots */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{fixture.statistics.home.shotsOnTarget + fixture.statistics.home.shotsOffTarget}</span>
                    <span className="text-sm text-muted-foreground">Shots</span>
                    <span className="text-sm font-medium">{fixture.statistics.away.shotsOnTarget + fixture.statistics.away.shotsOffTarget}</span>
                  </div>
                  
                  {/* Shots on Target */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{fixture.statistics.home.shotsOnTarget}</span>
                    <span className="text-sm text-muted-foreground">Shots on Target</span>
                    <span className="text-sm font-medium">{fixture.statistics.away.shotsOnTarget}</span>
                  </div>

                  {/* Possession */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{fixture.statistics.home.possessionTime}%</span>
                    <span className="text-sm text-muted-foreground">Possession</span>
                    <span className="text-sm font-medium">{fixture.statistics.away.possessionTime}%</span>
                  </div>

                  {/* Fouls */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{fixture.statistics.home.fouls}</span>
                    <span className="text-sm text-muted-foreground">Fouls</span>
                    <span className="text-sm font-medium">{fixture.statistics.away.fouls}</span>
                  </div>

                  {/* Cards */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{fixture.statistics.home.yellowCards}</span>
                    <span className="text-sm text-muted-foreground">Yellow Cards</span>
                    <span className="text-sm font-medium">{fixture.statistics.away.yellowCards}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{fixture.statistics.home.redCards}</span>
                    <span className="text-sm text-muted-foreground">Red Cards</span>
                    <span className="text-sm font-medium">{fixture.statistics.away.redCards}</span>
                  </div>

                  {/* Corners */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{fixture.statistics.home.corners}</span>
                    <span className="text-sm text-muted-foreground">Corners</span>
                    <span className="text-sm font-medium">{fixture.statistics.away.corners}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Status Information */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-emerald-500" />
                Match Status
              </h2>
              <div className="flex items-center justify-center">
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  fixture.status === FixtureStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                  fixture.status === FixtureStatus.LIVE ? 'bg-red-100 text-red-800' :
                  fixture.status === FixtureStatus.SCHEDULED ? 'bg-blue-100 text-blue-800' :
                  fixture.status === FixtureStatus.POSTPONED ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {fixture.status === FixtureStatus.COMPLETED ? 'Match Completed' :
                   fixture.status === FixtureStatus.LIVE ? 'Live Match' :
                   fixture.status === FixtureStatus.SCHEDULED ? 'Upcoming Match' :
                   fixture.status === FixtureStatus.POSTPONED ? 'Match Postponed' :
                   'Match Cancelled'}
                </div>
              </div>
              {fixture.status === FixtureStatus.POSTPONED && fixture.postponedReason && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm text-yellow-800">
                    <strong>Reason:</strong> {fixture.postponedReason}
                  </div>
                  {fixture.rescheduledDate && (
                    <div className="text-sm text-yellow-800 mt-1">
                      <strong>Rescheduled to:</strong> {format(new Date(fixture.rescheduledDate), 'MMM dd, yyyy HH:mm')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </BlurFade>
      </div>
    </main>
  );
}
