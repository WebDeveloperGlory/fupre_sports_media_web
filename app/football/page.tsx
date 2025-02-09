'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import Image from "next/image";
import { FC } from "react";

const FootballPage: FC = () => {
  const teams = [
    {
      name: "Team A",
      logo: "/team-logos/team-a.png",
      played: 5,
      won: 3,
      drawn: 1,
      lost: 1,
      points: 10
    },
    {
      name: "Team B",
      logo: "/team-logos/team-b.png",
      played: 5,
      won: 2,
      drawn: 2,
      lost: 1,
      points: 8
    },
    {
      name: "Team C",
      logo: "/team-logos/team-c.png",
      played: 5,
      won: 2,
      drawn: 1,
      lost: 2,
      points: 7
    },
    {
      name: "Team D",
      logo: "/team-logos/team-d.png",
      played: 5,
      won: 1,
      drawn: 2,
      lost: 2,
      points: 5
    }
  ];

  return (
    <main className="min-h-screen py-24 container">
      <BlurFade>
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Football</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest football matches and standings
            </p>
          </div>

          {/* League Table */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-semibold mb-6">League Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 font-medium text-muted-foreground">Position</th>
                    <th className="text-left py-4 font-medium text-muted-foreground">Team</th>
                    <th className="text-center py-4 font-medium text-muted-foreground">Played</th>
                    <th className="text-center py-4 font-medium text-muted-foreground">Won</th>
                    <th className="text-center py-4 font-medium text-muted-foreground">Drawn</th>
                    <th className="text-center py-4 font-medium text-muted-foreground">Lost</th>
                    <th className="text-center py-4 font-medium text-muted-foreground">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr key={team.name} className="border-b border-border">
                      <td className="py-4">{index + 1}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8">
                            <Image
                              src={team.logo}
                              alt={`${team.name} logo`}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span>{team.name}</span>
                        </div>
                      </td>
                      <td className="text-center py-4">{team.played}</td>
                      <td className="text-center py-4">{team.won}</td>
                      <td className="text-center py-4">{team.drawn}</td>
                      <td className="text-center py-4">{team.lost}</td>
                      <td className="text-center py-4 font-semibold">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Matches */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-2xl font-semibold mb-6">Recent Matches</h2>
            <div className="space-y-4">
              {/* Add match cards here */}
              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">January 25, 2024</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                      <Image
                        src="/team-logos/team-a.png"
                        alt="Team A logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span>Team A</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">2</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="font-semibold">1</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>Team B</span>
                    <div className="relative w-8 h-8">
                      <Image
                        src="/team-logos/team-b.png"
                        alt="Team B logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
    </main>
  );
};

export default FootballPage; 