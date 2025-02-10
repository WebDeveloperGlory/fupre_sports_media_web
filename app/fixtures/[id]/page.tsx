'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";

// Mock data - replace with actual data from your API
const fixtures = [
  {
    id: "1",
    competition: "Unity Cup 2025",
    homeTeam: {
      name: "Team A",
      logo: "/team-logos/team-a.png",
      score: null
    },
    awayTeam: {
      name: "Team B",
      logo: "/team-logos/team-b.png",
      score: null
    },
    date: "2024-02-01",
    time: "15:00",
    venue: "Main Stadium",
    status: "upcoming",
    details: {
      referee: "John Smith",
      attendance: null,
      weather: "Sunny, 25°C"
    }
  },
  {
    id: "2",
    competition: "Inter-Faculty League",
    homeTeam: {
      name: "Team C",
      logo: "/team-logos/team-c.png",
      score: 2
    },
    awayTeam: {
      name: "Team D",
      logo: "/team-logos/team-d.png",
      score: 1
    },
    date: "2024-01-28",
    time: "14:30",
    venue: "Training Ground",
    status: "completed",
    details: {
      referee: "Jane Doe",
      attendance: 500,
      weather: "Cloudy, 22°C"
    }
  }
];

export default function FixturePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);
  const fixture = fixtures.find(f => f.id === resolvedParams.id);

  if (!fixture) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="fixed top-24 left-8 z-10">
        <BackButton />
      </div>

      <div className="py-24 container">
        <BlurFade>
          <div className="space-y-8">
            {/* Header Card */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="space-y-6">
                {/* Competition Name */}
                <div className="text-center">
                  <span className="text-sm font-medium text-emerald-500">
                    {fixture.competition}
                  </span>
                </div>

                {/* Teams and Score */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={fixture.homeTeam.logo}
                        alt={fixture.homeTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-medium text-lg">{fixture.homeTeam.name}</span>
                    {fixture.status === "completed" && (
                      <span className="text-3xl font-bold">{fixture.homeTeam.score}</span>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    {fixture.status === "completed" ? (
                      <span className="text-xl font-semibold text-muted-foreground">FT</span>
                    ) : (
                      <span className="text-xl font-semibold">VS</span>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={fixture.awayTeam.logo}
                        alt={fixture.awayTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-medium text-lg">{fixture.awayTeam.name}</span>
                    {fixture.status === "completed" && (
                      <span className="text-3xl font-bold">{fixture.awayTeam.score}</span>
                    )}
                  </div>
                </div>

                {/* Match Details */}
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(fixture.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{fixture.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{fixture.venue}</span>
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
                  <div className="font-medium">{fixture.details.referee}</div>
                </div>
                {fixture.details.attendance && (
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="text-sm text-muted-foreground">Attendance</div>
                    <div className="font-medium">{fixture.details.attendance}</div>
                  </div>
                )}
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="text-sm text-muted-foreground">Weather</div>
                  <div className="font-medium">{fixture.details.weather}</div>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </main>
  );
} 