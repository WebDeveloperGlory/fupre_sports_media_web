'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { Trophy, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";
import Image from "next/image";

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

export default function CompetitionPage({ 
  params 
}: { 
  params: Promise<{ type: string; id: string }> 
}) {
  const resolvedParams = use(params);
  const competition = competitions.find(c => c.id === parseInt(resolvedParams.id));
  
  if (!competition || competition.type !== resolvedParams.type) {
    notFound();
  }

  // Sort teams by points, then goal difference
  const sortedTeams = [...competition.teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const aGD = a.gf - a.ga;
    const bGD = b.gf - b.ga;
    if (bGD !== aGD) return bGD - aGD;
    return b.gf - a.gf;
  });

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="fixed top-24 left-8 z-10">
        <BackButton />
      </div>

      <div className="py-24 container">
        <BlurFade>
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-emerald-500" />
                  <h1 className="text-2xl font-bold">{competition.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    competition.status === 'ongoing' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {competition.status}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {competition.startDate} - {competition.endDate}
                  </span>
                </div>
              </div>
            </div>

            {/* League Table */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-6">League Table</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-6 px-4 font-medium text-muted-foreground">Pos</th>
                      <th className="text-left py-6 px-4 font-medium text-muted-foreground">Team</th>
                      <th className="text-center py-6 px-4 font-medium text-muted-foreground">P</th>
                      <th className="text-center py-6 px-4 font-medium text-muted-foreground">W</th>
                      <th className="text-center py-6 px-4 font-medium text-muted-foreground">D</th>
                      <th className="text-center py-6 px-4 font-medium text-muted-foreground">L</th>
                      <th className="text-center py-6 px-4 font-medium text-muted-foreground">GF</th>
                      <th className="text-center py-6 px-4 font-medium text-muted-foreground">GA</th>
                      <th className="text-center py-6 px-4 font-medium text-muted-foreground">GD</th>
                      <th className="text-center py-6 px-4 font-medium text-muted-foreground">Pts</th>
                      <th className="text-center py-6 px-4 font-medium text-muted-foreground">Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTeams.map((team, index) => (
                      <tr key={team.name} className="border-b border-border hover:bg-accent/50 transition-colors">
                        <td className="py-6 px-4">{index + 1}</td>
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-10 h-10">
                              <Image
                                src={team.logo}
                                alt={`${team.name} logo`}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="font-medium">{team.name}</span>
                          </div>
                        </td>
                        <td className="text-center py-6 px-4">{team.played}</td>
                        <td className="text-center py-6 px-4">{team.won}</td>
                        <td className="text-center py-6 px-4">{team.drawn}</td>
                        <td className="text-center py-6 px-4">{team.lost}</td>
                        <td className="text-center py-6 px-4">{team.gf}</td>
                        <td className="text-center py-6 px-4">{team.ga}</td>
                        <td className="text-center py-6 px-4">{team.gf - team.ga}</td>
                        <td className="text-center py-6 px-4 font-semibold">{team.points}</td>
                        <td className="text-center py-6 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {team.form.map((result, i) => (
                              <span
                                key={i}
                                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium ${
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
            </div>

            {/* Fixtures Section */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-6">Fixtures</h2>
              <div className="grid gap-4">
                {competition.fixtures.map((fixture) => (
                  <div 
                    key={fixture.id}
                    className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(fixture.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{fixture.time}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        fixture.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {fixture.status === 'completed' ? 'FT' : 'Upcoming'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{fixture.homeTeam}</span>
                      {fixture.status === 'completed' && fixture.score ? (
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg">{fixture.score.home}</span>
                          <span className="text-muted-foreground">-</span>
                          <span className="font-bold text-lg">{fixture.score.away}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">vs</span>
                      )}
                      <span className="font-medium">{fixture.awayTeam}</span>
                    </div>
                    <div className="mt-2 text-sm text-center text-muted-foreground">
                      {fixture.venue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </main>
  );
} 