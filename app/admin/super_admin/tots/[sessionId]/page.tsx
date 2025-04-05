'use client';

import { use, useEffect, useState } from "react";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy, Calendar, Users, CheckCircle, XCircle,
  ToggleLeft, ToggleRight, UserPlus, Save, AlertCircle, ShieldAlert
} from "lucide-react";
import { TOTSSessionWithPlayers } from "@/utils/requestDataTypes";
import {
  getSingleTOTSSession,
  getTOTSSessionPlayers,
  toggleTOTSSessionVoting,
  finalizeTOTSResults
} from "@/lib/requests/tots/requests";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "react-toastify";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { canCastAdminVote, canManageTOTS } from "@/utils/roleUtils";

interface TOTSSessionManagementPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

const TOTSSessionManagementPage = ({ params }: TOTSSessionManagementPageProps) => {
  const resolvedParams = use(params);

  const router = useRouter();
  const { jwt } = useAuthStore();
  const { sessionId } = resolvedParams;

  const [session, setSession] = useState<TOTSSessionWithPlayers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [isFinalizingResults, setIsFinalizingResults] = useState(false);

  useEffect(() => {
    if (!jwt) {
      toast.error("You must be logged in to access this page");
      router.push("/admin");
      return;
    }

    // Only head media admin can manage TOTS sessions
    if (!canManageTOTS()) {
      toast.error("You don't have permission to manage TOTS sessions");
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

  const handleToggleStatus = async () => {
    if (!jwt) {
      toast.error("You must be logged in to perform this action");
      return;
    }

    if (!canManageTOTS()) {
      toast.error("You don't have permission to manage TOTS sessions");
      return;
    }

    setIsTogglingStatus(true);

    try {
      const response = await toggleTOTSSessionVoting(jwt, sessionId);

      if (response && response.code === "00") {
        toast.success(`Voting ${session?.isActive ? "disabled" : "enabled"} successfully`);

        // Update local state
        if (session) {
          setSession({
            ...session,
            isActive: !session.isActive
          });
        }
      } else {
        toast.error(response?.message || "Failed to toggle voting status");
      }
    } catch (error) {
      console.error("Error toggling voting status:", error);
      toast.error("An error occurred while toggling the voting status");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleFinalizeResults = async () => {
    if (!jwt) {
      toast.error("You must be logged in to perform this action");
      return;
    }

    if (!canManageTOTS()) {
      toast.error("You don't have permission to manage TOTS sessions");
      return;
    }

    if (!window.confirm("Are you sure you want to finalize the results? This action cannot be undone.")) {
      return;
    }

    setIsFinalizingResults(true);

    try {
      const response = await finalizeTOTSResults(jwt, sessionId);

      if (response && response.code === "00") {
        toast.success("Results finalized successfully");

        // Update local state
        if (session) {
          setSession({
            ...session,
            isFinalized: true,
            isActive: false
          });
        }
      } else {
        toast.error(response?.message || "Failed to finalize results");
      }
    } catch (error) {
      console.error("Error finalizing results:", error);
      toast.error("An error occurred while finalizing the results");
    } finally {
      setIsFinalizingResults(false);
    }
  };

  // Group players by position
  const playersByPosition: Record<string, number> = {};

  if (session?.players) {
    session.players.forEach(player => {
      const position = player.position;
      if (!playersByPosition[position]) {
        playersByPosition[position] = 0;
      }
      playersByPosition[position]++;
    });
  }

  return (
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
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Trophy className="w-8 h-8 text-emerald-500" />
                {session.name}
              </h1>
              <p className="text-muted-foreground mt-1">{session.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {canManageTOTS() && (
                <Link href={`/admin/super_admin/tots/${sessionId}/players`}>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Manage Players
                  </Button>
                </Link>
              )}

              <Link href={`/admin/super_admin/tots/${sessionId}/vote`}>
                <Button variant="secondary">
                  <Trophy className="w-4 h-4 mr-2" />
                  Cast Admin Vote
                </Button>
              </Link>

              <Link href={`/football/tots/${sessionId}`} target="_blank">
                <Button variant="outline">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Session Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  Session Details
                </CardTitle>
                <CardDescription>
                  Information about this TOTS voting session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Start Date</span>
                    <span className="font-medium">{format(new Date(session.startDate), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">End Date</span>
                    <span className="font-medium">{format(new Date(session.endDate), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Created At</span>
                    <span className="font-medium">{format(new Date(session.createdAt), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="flex items-center gap-2">
                      {session.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}

                      {session.isFinalized && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                          <Trophy className="w-3 h-3" />
                          Finalized
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  {canManageTOTS() && (
                    <Button
                      variant={session.isActive ? "destructive" : "default"}
                      className="w-full"
                      onClick={handleToggleStatus}
                      disabled={isTogglingStatus || session.isFinalized}
                    >
                      {session.isActive ? (
                        <>
                          <ToggleLeft className="w-4 h-4 mr-2" />
                          {isTogglingStatus ? "Disabling..." : "Disable Voting"}
                        </>
                      ) : (
                        <>
                          <ToggleRight className="w-4 h-4 mr-2" />
                          {isTogglingStatus ? "Enabling..." : "Enable Voting"}
                        </>
                      )}
                    </Button>
                  )}

                  {!session.isFinalized && (
                    <>
                      {canCastAdminVote() && (
                        <Link href={`/admin/super_admin/tots/${sessionId}/vote`} className="w-full">
                          <Button variant="outline" className="w-full mb-3">
                            <Trophy className="w-4 h-4 mr-2" />
                            Cast Admin Vote
                          </Button>
                        </Link>
                      )}
                      {canManageTOTS() && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleFinalizeResults}
                          disabled={isFinalizingResults}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isFinalizingResults ? "Finalizing..." : "Finalize Results"}
                        </Button>
                      )}
                    </>
                  )}

                  {session.isFinalized && (
                    <Link href={`/football/tots/${sessionId}/result`} className="w-full">
                      <Button variant="outline" className="w-full">
                        <Trophy className="w-4 h-4 mr-2" />
                        View Results
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Players Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" />
                  Players Summary
                </CardTitle>
                <CardDescription>
                  Overview of players in this TOTS session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Players</span>
                    <span className="font-medium">{session.players.length}</span>
                  </div>

                  {Object.entries(playersByPosition).map(([position, count]) => (
                    <div key={position} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{position}s</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link href={`/admin/super_admin/tots/${sessionId}/players`} className="w-full">
                    <Button variant="outline" className="w-full">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Manage Players
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Players List Preview */}
          {session.players.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" />
                  Players List
                </CardTitle>
                <CardDescription>
                  Players currently in this TOTS session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {session.players.map(player => (
                    <div
                      key={player._id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{player.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                              {player.position}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {player.team.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default TOTSSessionManagementPage;
