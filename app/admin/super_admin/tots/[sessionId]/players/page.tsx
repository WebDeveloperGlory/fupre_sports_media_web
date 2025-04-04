'use client';

import { useEffect, useState } from "react";
import { BackButton } from "@/components/ui/back-button";
import { Trophy, Users, ShieldAlert } from "lucide-react";
import { TOTSPlayer, TOTSSession } from "@/utils/requestDataTypes";
import { getSingleTOTSSession, getTOTSSessionPlayers } from "@/lib/requests/tots/requests";
import { Loader } from "@/components/ui/loader";
import { toast } from "react-toastify";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";
import PlayerManagement from "@/components/tots/admin/PlayerManagement";
import { canManageTOTS } from "@/utils/roleUtils";

interface TOTSPlayerManagementPageProps {
  params: {
    sessionId: string;
  };
}

const TOTSPlayerManagementPage = ({ params }: TOTSPlayerManagementPageProps) => {
  const router = useRouter();
  const { jwt } = useAuthStore();
  const { sessionId } = params;

  const [session, setSession] = useState<TOTSSession | null>(null);
  const [players, setPlayers] = useState<TOTSPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jwt) {
      toast.error("You must be logged in to access this page");
      router.push("/admin");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch session details
        const sessionResponse = await getSingleTOTSSession(sessionId);
        if (sessionResponse && sessionResponse.code === "00") {
          setSession(sessionResponse.data);

          // Fetch players for this session
          const playersResponse = await getTOTSSessionPlayers(sessionId);
          if (playersResponse && playersResponse.code === "00") {
            setPlayers(playersResponse.data);
          } else {
            setError(playersResponse?.message || "Failed to fetch players");
          }
        } else {
          setError(sessionResponse?.message || "Failed to fetch session details");
        }
      } catch (error) {
        console.error("Error fetching TOTS data:", error);
        setError("An error occurred while fetching the data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId, jwt, router]);

  const handlePlayersUpdated = () => {
    setLoading(true);
    // Refetch players
    getTOTSSessionPlayers(sessionId)
      .then(response => {
        if (response && response.code === "00") {
          setPlayers(response.data);
        }
      })
      .finally(() => setLoading(false));
  };

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
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-8 h-8 text-emerald-500" />
              Manage Players
            </h1>
            <p className="text-muted-foreground mt-1">
              Add or remove players for {session.name}
            </p>
          </div>

          <PlayerManagement
            sessionId={sessionId}
            players={players}
            onPlayersUpdated={handlePlayersUpdated}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Session Not Found</h2>
          <p className="text-muted-foreground text-center max-w-md">
            The TOTS session you're looking for could not be found.
          </p>
        </div>
      )}
    </div>
  );
};

export default TOTSPlayerManagementPage;
