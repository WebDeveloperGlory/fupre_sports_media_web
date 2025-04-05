'use client';

import { use, useEffect, useState } from "react";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Save, AlertCircle, ShieldAlert } from "lucide-react";
import { TOTSPlayer, TOTSSessionWithPlayers } from "@/utils/requestDataTypes";
import { getSingleTOTSSession, getTOTSSessionPlayers, submitAdminTOTSVote } from "@/lib/requests/tots/requests";
import { Loader } from "@/components/ui/loader";
import { toast } from "react-toastify";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";
import PlayerSelectionCard from "@/components/tots/PlayerSelectionCard";
import { cn } from "@/lib/utils";
import { canCastAdminVote } from "@/utils/roleUtils";

interface AdminVotePageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

const AdminVotePage = ({ params }: AdminVotePageProps) => {
  const resolvedParams = use(params);

  const router = useRouter();
  const { jwt } = useAuthStore();
  const { sessionId } = resolvedParams;

  const [session, setSession] = useState<TOTSSessionWithPlayers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maxSelections, setMaxSelections] = useState(11); // Default to 11 players

  useEffect(() => {
    if (!jwt) {
      toast.error("You must be logged in to access this page");
      router.push("/admin");
      return;
    }

    if (!canCastAdminVote()) {
      toast.error("You don't have permission to cast admin votes");
      router.push("/admin/dashboard");
      return;
    }

    const fetchSessionData = async () => {
      try {
        // Fetch session details
        const sessionResponse = await getSingleTOTSSession(sessionId);
        if (sessionResponse && sessionResponse.code === "00") {
          const sessionData = sessionResponse.data;

          // Fetch players for this session
          const playersResponse = await getTOTSSessionPlayers(sessionId);
          if (playersResponse && playersResponse.code === "00") {
            const playersData = playersResponse.data;

            // Combine session and players data
            setSession({
              ...sessionData,
              players: playersData
            });
          } else {
            setError(playersResponse?.message || "Failed to fetch players");
          }
        } else {
          setError(sessionResponse?.message || "Failed to fetch session details");
        }
      } catch (error) {
        console.error("Error fetching TOTS session data:", error);
        setError("An error occurred while fetching the session data");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, jwt, router]);

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
    if (!jwt) {
      toast.error("You must be logged in to vote");
      return;
    }

    if (!canCastAdminVote()) {
      toast.error("You don't have permission to cast admin votes");
      return;
    }

    if (selectedPlayers.length === 0) {
      toast.error("Please select at least one player");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitAdminTOTSVote(jwt, sessionId, selectedPlayers);

      if (response && response.code === "00") {
        toast.success("Your admin vote has been submitted successfully");
        // Navigate back to the session management page
        router.push(`/admin/super_admin/tots/${sessionId}`);
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

  if (!session?.isActive && !loading && !session?.isFinalized) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="fixed top-6 left-4 md:left-8 z-10">
          <BackButton />
        </div>

        <div className="flex flex-col items-center justify-center py-12 pt-24">
          <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Voting is not active</h1>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            This Team of the Season voting session is not currently active. Please enable voting from the session management page.
          </p>
          <Button onClick={() => router.push(`/admin/super_admin/tots/${sessionId}`)}>
            Back to Session Management
          </Button>
        </div>
      </div>
    );
  }

  if (session?.isFinalized && !loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="fixed top-6 left-4 md:left-8 z-10">
          <BackButton />
        </div>

        <div className="flex flex-col items-center justify-center py-12 pt-24">
          <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Voting is closed</h1>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            This Team of the Season voting session has been finalized and voting is no longer available.
          </p>
          <Button onClick={() => router.push(`/football/tots/${sessionId}/result`)}>
            View Results
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="fixed top-6 left-4 md:left-8 z-10">
        <BackButton />
      </div>

      {loading ? (
        <div className="flex justify-center py-12 pt-24">
          <Loader />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400 mt-16">
          {error}
        </div>
      ) : session ? (
        <div className="space-y-8 pt-16 md:pt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-emerald-500" />
                Admin Vote: {session.name}
              </CardTitle>
              <CardDescription>
                As an admin, your vote carries more weight in the final results. Select up to {maxSelections} players.
                {/* {canManageTOTS() && ( */}
                {(
                  <div className="mt-2 text-xs inline-flex items-center px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    Head Media Admin Vote
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Selected: <span className="font-bold text-emerald-500">{selectedPlayers.length}</span> / {maxSelections}
              </p>

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

              <div className="mt-8 flex justify-end">
                <Button
                  onClick={handleSubmitVote}
                  disabled={selectedPlayers.length === 0 || isSubmitting}
                  className="px-6"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Admin Vote"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default AdminVotePage;
