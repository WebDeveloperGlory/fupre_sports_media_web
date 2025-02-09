'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { Trophy } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";

// This would come from your API/database
const competitions = [
  {
    id: 1,
    name: "Unity Cup 2025",
    type: "knockout",
    status: "ongoing",
    startDate: "January 30th",
    endDate: "February 2nd",
  },
  {
    id: 2,
    name: "Inter-Faculty League",
    type: "league",
    status: "ongoing",
    startDate: "January 15th",
    endDate: "March 30th",
  },
  {
    id: 3,
    name: "Chancellor's Cup",
    type: "hybrid",
    status: "upcoming",
    startDate: "April 1st",
    endDate: "April 15th",
  },
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

            {/* Content based on competition type */}
            {competition.type === 'league' && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-6">League Table</h2>
                {/* Add league table here */}
              </div>
            )}

            {competition.type === 'knockout' && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-6">Tournament Bracket</h2>
                {/* Add knockout bracket here */}
              </div>
            )}

            {competition.type === 'hybrid' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h2 className="text-xl font-semibold mb-6">Group Stages</h2>
                  {/* Add group stages here */}
                </div>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h2 className="text-xl font-semibold mb-6">Knockout Stages</h2>
                  {/* Add knockout stages here */}
                </div>
              </div>
            )}

            {/* Fixtures Section */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-6">Fixtures</h2>
              {/* Add fixtures here */}
            </div>
          </div>
        </BlurFade>
      </div>
    </main>
  );
} 