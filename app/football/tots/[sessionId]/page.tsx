'use client';

import { use, useEffect, useState } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users, Save, AlertCircle, CheckCircle, LogIn } from "lucide-react";
import { TOTSPlayer, TOTSSessionWithPlayers, TOTSUserVote } from "@/utils/requestDataTypes";
import { getSingleTOTSSession, getTOTSSessionPlayers, getUserTOTSVote, submitUserTOTSVote } from "@/lib/requests/tots/requests";
import PlayerSelectionCard from "@/components/tots/PlayerSelectionCard";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
import { toast } from "react-toastify";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { canVote } from "@/utils/roleUtils";

interface TOTSVotingPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

const TOTSVotingPage = ({ params }: TOTSVotingPageProps) => {
  const resolvedParams = use(params);

  const router = useRouter();
  const { jwt } = useAuthStore();
  const { sessionId } = resolvedParams;

  const [session, setSession] = useState<TOTSSessionWithPlayers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [existingVote, setExistingVote] = useState<TOTSUserVote | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maxSelections, setMaxSelections] = useState(11); // Default to 11 players

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        // Fetch session details
        const response = await getSingleTOTSSession( sessionId );
        if (response && response.code === "00") {
          const sessionData = response.data.session;

          // Fetch players for this session
          const playersResponse = await getTOTSSessionPlayers(sessionId);
          if (playersResponse && playersResponse.code === "00") {
            const playersData = playersResponse.data;

            // Combine session and players data
            setSession({
              ...sessionData,
              players: playersData
            });

            // Try to fetch user's existing vote if logged in
            if ( jwt ) {
              try {
                const voteResponse = await getUserTOTSVote( sessionId, jwt );
                if (voteResponse && voteResponse.code === "00") {
                  setExistingVote(voteResponse.data);
                  console.log( voteResponse.data );
                  // setSelectedPlayers(voteResponse.data);
                }
              } catch (voteError) {
                console.error("Error fetching user vote:", voteError);
                // Not showing error to user as this is optional
              }
            }
          } else {
            setError(playersResponse?.message || "Failed to fetch players");
          }
        } else {
          setError(response?.message || "Failed to fetch session details");
        }
      } catch (error) {
        console.error("Error fetching TOTS session data:", error);
        setError("An error occurred while fetching the session data");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, jwt]);

  // Set max selections based on player positions
  useEffect(() => {
    if (session?.players) {
      // Count how many of each position we have
      const positions = session.players.reduce((acc, player) => {
        const pos = player.position.toLowerCase();
        if (!acc[pos]) acc[pos] = 0;
        acc[pos]++;
        return acc;
      }, {} as Record<string, number>);

      // Determine max selections based on available positions
      // This is a simple implementation - you might want to customize this
      const hasGoalkeepers = Object.keys(positions).some(p =>
        p.includes('goalkeeper') || p === 'gk'
      );
      const hasDefenders = Object.keys(positions).some(p =>
        p.includes('defender') || p === 'def'
      );
      const hasMidfielders = Object.keys(positions).some(p =>
        p.includes('midfielder') || p === 'mid'
      );
      const hasForwards = Object.keys(positions).some(p =>
        p.includes('forward') || p === 'fwd' || p.includes('striker')
      );

      // Calculate max based on available positions
      let max = 0;
      if (hasGoalkeepers) max += 1;
      if (hasDefenders) max += 4;
      if (hasMidfielders) max += 3;
      if (hasForwards) max += 3;

      // Fallback to 11 if we couldn't determine
      setMaxSelections(max || 11);
    }
  }, [session]);

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayers(prev => {
      // If already selected, remove it
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      }

      // If not selected and we haven't reached max, add it
      if (prev.length < maxSelections) {
        return [...prev, playerId];
      }

      // If we've reached max, show error and don't change
      toast.error(`You can only select up to ${maxSelections} players`);
      return prev;
    });
  };

  const handleSubmitVote = async () => {
    if (!canVote()) {
      toast.error("You must be logged in to vote");
      return;
    }

    if (selectedPlayers.length === 0) {
      toast.error("Please select at least one player");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitUserTOTSVote(sessionId, selectedPlayers);

      if (response && response.code === "00") {
        toast.success("Your vote has been submitted successfully");
        setExistingVote({
          _id: response.data._id || "temp-id",
          sessionId,
          userId: "current-user",
          playerIds: selectedPlayers,
          createdAt: new Date()
        });
      } else {
        toast.error(response?.message || "Failed to submit your vote");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("An error occurred while submitting your vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group players by position
  const playersByPosition: Record<string, TOTSPlayer[]> = {};

  if (session?.players) {
    session.players.forEach(player => {
      const position = player.position;
      if (!playersByPosition[position]) {
        playersByPosition[position] = [];
      }
      playersByPosition[position].push(player);
    });
  }

  // Sort positions in logical order: GK, DEF, MID, FWD
  const positionOrder = ["Goalkeeper", "GK", "Defender", "DEF", "Midfielder", "MID", "Forward", "FWD", "Striker"];

  const sortedPositions = Object.keys(playersByPosition).sort((a, b) => {
    const aIndex = positionOrder.findIndex(pos => a.includes(pos));
    const bIndex = positionOrder.findIndex(pos => b.includes(pos));
    return aIndex - bIndex;
  });

  if (!session?.isActive && !loading) {
    return (
      <BlurFade>
        <div className="max-w-6xl mx-auto">
          <div className="fixed top-6 left-4 md:left-8 z-10">
            <BackButton />
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Voting is not active</h1>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              This Team of the Season voting session is not currently active. Please check back later or view other active sessions.
            </p>
            <Link href="/football/tots">
              <Button>
                View All TOTS Sessions
              </Button>
            </Link>
          </div>
        </div>
      </BlurFade>
    );
  }

  return (
    <BlurFade>
      <div className="max-w-6xl mx-auto">
        <div className="fixed top-6 left-4 md:left-8 z-10">
          <BackButton />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : session ? (
          <div className="space-y-8 pt-16 md:pt-8">
            <div className="text-center space-y-2 mt-8">
              <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8 text-emerald-500" />
                {session.name}
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
                  <span>Select up to {maxSelections} players</span>
                </div>
              </div>
            </div>

            {!canVote() ? (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="text-yellow-700 dark:text-yellow-300">
                    You need to be logged in to vote
                  </span>
                </div>
                <Link href={`/auth/login?redirect=/football/tots/${sessionId}`}>
                  <Button variant="outline" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login to Vote
                  </Button>
                </Link>
              </div>
            ) : existingVote && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700 dark:text-green-300">
                    You have already voted for this TOTS session
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  You can update your vote until {format(new Date(session.endDate), "dd MMM yyyy")}
                </span>
              </div>
            )}

            <div className="space-y-8">
              {sortedPositions.map(position => (
                <div key={position} className="space-y-4">
                  <h2 className="text-xl font-semibold">{position}s</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {playersByPosition[position].map(player => (
                      <PlayerSelectionCard
                        key={player._id}
                        player={player}
                        isSelected={selectedPlayers.includes(player._id)}
                        onSelect={handlePlayerSelect}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Selected: </span>
                  <span className="text-emerald-500 font-bold">{selectedPlayers.length}</span>
                  <span className="text-muted-foreground"> / {maxSelections}</span>
                </div>
                <Button
                  onClick={handleSubmitVote}
                  disabled={!canVote() || selectedPlayers.length === 0 || isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Submitting..." : existingVote ? "Update Vote" : "Submit Vote"}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </BlurFade>
  );
};

export default TOTSVotingPage;
