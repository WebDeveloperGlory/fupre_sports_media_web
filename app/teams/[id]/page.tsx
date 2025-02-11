'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { Trophy, Users, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { use } from "react";
import Link from "next/link";

// Demo data
const teamsData = {
  'mechanical-stars': {
    name: "Mechanical Stars",
    logo: "/team-logos/team-a.png",
    position: 1,
    played: 2,
    won: 2,
    drawn: 0,
    lost: 0,
    points: 6,
    gf: 6,
    ga: 2,
    coach: {
      name: "Alex Ferguson",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      experience: "5 years",
    },
    squad: [
      { number: 1, name: "John Smith", position: "GK" },
      { number: 2, name: "Mike Johnson", position: "RB" },
      { number: 4, name: "David Wilson", position: "CB" },
      { number: 5, name: "James Brown", position: "CB" },
      { number: 3, name: "Chris Davis", position: "LB" },
      { number: 6, name: "Tom White", position: "CDM" },
      { number: 8, name: "Steve Black", position: "CM" },
      { number: 10, name: "Paul Green", position: "CAM" },
      { number: 7, name: "Mark Taylor", position: "RW" },
      { number: 9, name: "Peter Wright", position: "ST" },
      { number: 11, name: "Dan Moore", position: "LW" },
      // Substitutes
      { number: 12, name: "Sam Adams", position: "GK" },
      { number: 14, name: "Joe Clark", position: "DEF" },
      { number: 16, name: "Ryan Hall", position: "MID" },
      { number: 20, name: "Tony Blake", position: "FWD" },
    ],
    upcomingFixtures: [
      {
        opponent: "Petroleum Dragons",
        date: "2024-03-22",
        time: "16:00",
        venue: "FUPRE Main Ground",
        isHome: false
      },
      {
        opponent: "Chemical Warriors",
        date: "2024-03-25",
        time: "16:00",
        venue: "FUPRE Main Ground",
        isHome: true
      },
      {
        opponent: "Marine Eagles",
        date: "2024-03-28",
        time: "18:00",
        venue: "FUPRE Main Ground",
        isHome: true
      }
    ]
  },
  'chemical-warriors': {
    name: "Chemical Warriors",
    logo: "/team-logos/team-b.png",
    position: 2,
    played: 2,
    won: 1,
    drawn: 1,
    lost: 0,
    points: 4,
    gf: 3,
    ga: 0,
    coach: {
      name: "Jose Mourinho",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jose",
      experience: "3 years",
    },
    squad: [
      { number: 1, name: "Adam Scott", position: "GK" },
      { number: 2, name: "Luke Shaw", position: "RB" },
      { number: 4, name: "Gary Jones", position: "CB" },
      { number: 5, name: "Phil Taylor", position: "CB" },
      { number: 3, name: "Andy Cole", position: "LB" },
      { number: 6, name: "Matt King", position: "CDM" },
      { number: 8, name: "Rob Hall", position: "CM" },
      { number: 10, name: "Ed Wood", position: "CAM" },
      { number: 7, name: "Jim Ross", position: "RW" },
      { number: 9, name: "Tony Blake", position: "ST" },
      { number: 11, name: "Ben Hill", position: "LW" },
      // Substitutes
      { number: 13, name: "Carl Ward", position: "GK" },
      { number: 15, name: "Tim Long", position: "DEF" },
      { number: 17, name: "Ken Short", position: "MID" },
      { number: 19, name: "Lee Grant", position: "FWD" },
    ],
    upcomingFixtures: [
      {
        opponent: "Marine Eagles",
        date: "2024-03-22",
        time: "18:00",
        venue: "FUPRE Main Ground",
        isHome: false
      },
      {
        opponent: "Mechanical Stars",
        date: "2024-03-25",
        time: "16:00",
        venue: "FUPRE Main Ground",
        isHome: false
      },
      {
        opponent: "Petroleum Dragons",
        date: "2024-03-28",
        time: "16:00",
        venue: "FUPRE Main Ground",
        isHome: true
      }
    ]
  },
  'petroleum-dragons': {
    name: "Petroleum Dragons",
    logo: "/team-logos/team-c.png",
    position: 3,
    played: 2,
    won: 1,
    drawn: 1,
    lost: 0,
    points: 4,
    gf: 3,
    ga: 2,
    coach: {
      name: "Pep Guardiola",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pep",
      experience: "4 years",
    },
    squad: [
      { number: 1, name: "Tim Howard", position: "GK" },
      { number: 2, name: "Kyle Walker", position: "RB" },
      { number: 4, name: "John Stones", position: "CB" },
      { number: 5, name: "Harry Maguire", position: "CB" },
      { number: 3, name: "Ben Chilwell", position: "LB" },
      { number: 6, name: "Declan Rice", position: "CDM" },
      { number: 8, name: "Mason Mount", position: "CM" },
      { number: 10, name: "Jack Grealish", position: "CAM" },
      { number: 7, name: "Bukayo Saka", position: "RW" },
      { number: 9, name: "Harry Kane", position: "ST" },
      { number: 11, name: "Marcus Rashford", position: "LW" },
      // Substitutes
      { number: 13, name: "Nick Pope", position: "GK" },
      { number: 15, name: "Eric Dier", position: "DEF" },
      { number: 17, name: "Jordan Henderson", position: "MID" },
      { number: 19, name: "Ollie Watkins", position: "FWD" },
    ],
    upcomingFixtures: [
      {
        opponent: "Mechanical Stars",
        date: "2024-03-22",
        time: "16:00",
        venue: "FUPRE Main Ground",
        isHome: true
      },
      {
        opponent: "Marine Eagles",
        date: "2024-03-25",
        time: "18:00",
        venue: "FUPRE Main Ground",
        isHome: true
      },
      {
        opponent: "Chemical Warriors",
        date: "2024-03-28",
        time: "16:00",
        venue: "FUPRE Main Ground",
        isHome: false
      }
    ]
  }
};

export default function TeamPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);
  const team = teamsData[resolvedParams.id as keyof typeof teamsData];

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <main className="min-h-screen">
      {/* Back Button */}
      <div className="fixed top-20 left-4 md:left-8 z-10">
        <BackButton />
      </div>

      <div className="pt-32 space-y-6 max-w-6xl mx-auto px-4 md:px-6">
        <BlurFade>
          <div className="space-y-6">
            {/* Team Header */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <Image
                    src={team.logo}
                    alt={team.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{team.name}</h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-emerald-500" />
                      <span>Position: {team.position}st</span>
                    </div>
                    <span>•</span>
                    <span>{team.points} points</span>
                    <span>•</span>
                    <span>{team.played} matches played</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-emerald-500">{team.won}</div>
                <div className="text-sm text-muted-foreground">Won</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-orange-500">{team.drawn}</div>
                <div className="text-sm text-muted-foreground">Drawn</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold text-red-500">{team.lost}</div>
                <div className="text-sm text-muted-foreground">Lost</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="text-2xl font-bold">{team.gf - team.ga}</div>
                <div className="text-sm text-muted-foreground">Goal Difference</div>
              </div>
            </div>

            {/* Coach Section */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Head Coach</h2>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={team.coach.image}
                    alt={team.coach.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{team.coach.name}</h3>
                  <p className="text-sm text-muted-foreground">Experience: {team.coach.experience}</p>
                </div>
              </div>
            </div>

            {/* Squad List */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold">Squad List</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.squad.map((player) => (
                  <div
                    key={player.number}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-secondary rounded-full text-sm font-medium">
                      {player.number}
                    </span>
                    <div>
                      <h3 className="font-medium">{player.name}</h3>
                      <p className="text-sm text-muted-foreground">{player.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Fixtures */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Upcoming Fixtures</h2>
              <div className="space-y-3">
                {team.upcomingFixtures.map((fixture, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    {/* Date and Time */}
                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span>{new Date(fixture.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span>{fixture.time}</span>
                      </div>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center gap-4 text-base md:text-lg font-medium">
                      <span className={fixture.isHome ? "text-emerald-500" : ""}>
                        {fixture.isHome ? team.name : fixture.opponent}
                      </span>
                      <span className="text-sm text-muted-foreground">vs</span>
                      <span className={!fixture.isHome ? "text-emerald-500" : ""}>
                        {fixture.isHome ? fixture.opponent : team.name}
                      </span>
                    </div>

                    {/* Venue */}
                    <div className="hidden md:block text-sm text-muted-foreground">
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