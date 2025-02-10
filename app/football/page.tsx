'use client';

import { BlurFade } from "@/components/ui/blur-fade";
import Image from "next/image";
import { FC, useState } from "react";
import { ChevronDown, ChevronUp, Trophy, Calendar } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const competitions = [
  {
    id: 1,
    name: "FUPRE Super League",
    type: "league",
    status: "ongoing",
    startDate: "March 19th",
    endDate: "April 30th",
  }
];

const FootballPage: FC = () => {
  const [isCompetitionsOpen, setIsCompetitionsOpen] = useState(false);

  return (
    <main className="min-h-screen py-24 container">
      <BlurFade>
        <div className="space-y-8">
          {/* Hero - Live Matches */}
          <div className="relative bg-gradient-to-br from-emerald-500/20 via-background to-background rounded-xl border border-border overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background" />
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-lg font-semibold text-emerald-500">LIVE NOW</h2>
                  </div>
                  <Link
                    href="/live/1/stats"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-medium transition-colors"
                  >
                    View Stats
                  </Link>
                </div>
                
                <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-16 h-16 md:w-24 md:h-24">
                        <Image
                          src="/team-logos/team-a.png"
                          alt="Home team"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xl md:text-2xl font-bold">Mechanical Stars</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="text-4xl md:text-6xl font-bold tracking-tighter">
                        <span>2</span>
                        <span className="text-muted-foreground mx-3">-</span>
                        <span>1</span>
                      </div>
                      <span className="text-sm text-muted-foreground">75'</span>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-16 h-16 md:w-24 md:h-24">
                        <Image
                          src="/team-logos/team-b.png"
                          alt="Away team"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xl md:text-2xl font-bold">Chemical Warriors</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      <span>FUPRE Super League</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Competitions Section */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setIsCompetitionsOpen(!isCompetitionsOpen)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold">Current Competitions</h2>
              </div>
              {isCompetitionsOpen ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            <AnimatePresence>
              {isCompetitionsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 grid gap-4 border-t border-border">
                    {competitions.map((competition) => (
                      <Link
                        key={competition.id}
                        href={`/competitions/${competition.type}/${competition.id}`}
                        className="block p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{competition.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {competition.startDate} - {competition.endDate}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              competition.status === 'ongoing' 
                                ? 'bg-emerald-500/10 text-emerald-500' 
                                : 'bg-orange-500/10 text-orange-500'
                            }`}>
                              {competition.status}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                              {competition.type}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </BlurFade>
    </main>
  );
};

export default FootballPage; 