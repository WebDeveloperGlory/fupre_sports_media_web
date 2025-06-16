'use client';

import { TOTSPlayer, TOTSResult, TOTSSession } from "@/utils/requestDataTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, User, Calendar, Users, Award } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
  session: TOTSSession;
  result: TOTSResult;
}

const ResultsDisplay = ({ session, result }: ResultsDisplayProps) => {
  // Group players by position
  const playersByPosition: Record<string, TOTSPlayer[]> = {};

  // result.players.forEach(player => {
  //   const position = player.position;
  //   if (!playersByPosition[position]) {
  //     playersByPosition[position] = [];
  //   }
  //   playersByPosition[position].push(player);
  // });

  // Sort positions in logical order: GK, DEF, MID, FWD
  const positionOrder = ["Goalkeeper", "GK", "Defender", "DEF", "Midfielder", "MID", "Forward", "FWD", "Striker"];

  const sortedPositions = Object.keys(playersByPosition).sort((a, b) => {
    const aIndex = positionOrder.findIndex(pos => a.includes(pos));
    const bIndex = positionOrder.findIndex(pos => b.includes(pos));
    return aIndex - bIndex;
  });

  // Helper function to get position color
  const getPositionColor = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes('goalkeeper') || pos === 'gk') return 'bg-yellow-500/20 text-yellow-600';
    if (pos.includes('defender') || pos === 'def') return 'bg-blue-500/20 text-blue-600';
    if (pos.includes('midfielder') || pos === 'mid') return 'bg-green-500/20 text-green-600';
    if (pos.includes('forward') || pos === 'fwd' || pos.includes('striker')) return 'bg-red-500/20 text-red-600';
    return 'bg-gray-500/20 text-gray-600';
  };

  return (
    <div className="space-y-6 pt-16 md:pt-8">
      <div className="text-center space-y-2 mt-8">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          {session.name} Results
        </h1>
        <p className="text-muted-foreground">{session.description}</p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {format(new Date(session.startDate), "dd MMM yyyy")} - {format(new Date(session.endDate), "dd MMM yyyy")}
            </span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {/* <span>{result.totalVotes} votes</span> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sortedPositions.map((position, posIndex) => (
          <motion.div
            key={position}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: posIndex * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className={cn("text-sm px-2 py-0.5 rounded-full", getPositionColor(position))}>
                    {position}
                  </span>
                  Team of the Season
                </CardTitle>
                <CardDescription>
                  Players with the most votes in this position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playersByPosition[position]
                    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                    .map((player, index) => (
                      <motion.div
                        key={player._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 + posIndex * 0.1 }}
                      >
                        <Card className={cn(
                          "border overflow-hidden transition-all",
                          index === 0 ? "border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/10" : "border-border"
                        )}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                                  <User className="w-6 h-6" />
                                </div>
                                {index === 0 && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                                    <Award className="w-3 h-3" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium">{player.name}</h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    {player.team.name}
                                  </span>
                                  <span className="text-xs font-medium">
                                    {player.votes} votes
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;
