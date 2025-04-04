'use client';

import { useEffect, useState } from "react";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Plus, Calendar, Users, CheckCircle, XCircle, AlertCircle, ShieldAlert } from "lucide-react";
import { TOTSSession } from "@/utils/requestDataTypes";
import { getAllTOTSSessions } from "@/lib/requests/tots/requests";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "react-toastify";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";
import SessionForm from "@/components/tots/admin/SessionForm";
import { canCastAdminVote, canManageTOTS } from "@/utils/roleUtils";

const TOTSAdminPage = () => {
  const router = useRouter();
  const { jwt } = useAuthStore();

  const [sessions, setSessions] = useState<TOTSSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!jwt) {
      toast.error("You must be logged in to access this page");
      router.push("/admin");
      return;
    }

    // Only admins can access this page
    if (!canCastAdminVote()) {
      toast.error("You don't have permission to access this page");
      router.push("/admin/dashboard");
      return;
    }

    const fetchSessions = async () => {
      try {
        const response = await getAllTOTSSessions();
        if (response && response.code === "00") {
          setSessions(response.data);
        } else {
          setError(response?.message || "Failed to fetch TOTS sessions");
        }
      } catch (error) {
        console.error("Error fetching TOTS sessions:", error);
        setError("An error occurred while fetching the sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [jwt, router]);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setLoading(true);
    // Refetch sessions
    getAllTOTSSessions()
      .then(response => {
        if (response && response.code === "00") {
          setSessions(response.data);
        }
      })
      .finally(() => setLoading(false));
  };

  // Filter sessions by status
  const activeSessions = sessions.filter(session => session.isActive && !session.isFinalized);
  const finishedSessions = sessions.filter(session => session.isFinalized);
  const upcomingSessions = sessions.filter(session => !session.isActive && !session.isFinalized);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="fixed top-6 left-4 md:left-8 z-10">
        <BackButton />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-emerald-500" />
            Manage TOTS Sessions
          </h1>
          {canManageTOTS() && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Session
                </>
              )}
            </Button>
          )}
        </div>
        <p className="text-muted-foreground mt-2">
          Create and manage Team of the Season voting sessions
        </p>
      </div>

      {showCreateForm && canManageTOTS() && (
        <div className="mb-8">
          <SessionForm onSuccess={handleCreateSuccess} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : (
        <div className="space-y-10">
          {activeSessions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Active Voting Sessions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeSessions.map(session => (
                  <SessionCard key={session._id} session={session} />
                ))}
              </div>
            </div>
          )}

          {upcomingSessions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Upcoming Sessions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingSessions.map(session => (
                  <SessionCard key={session._id} session={session} />
                ))}
              </div>
            </div>
          )}

          {finishedSessions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Completed Sessions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {finishedSessions.map(session => (
                  <SessionCard key={session._id} session={session} />
                ))}
              </div>
            </div>
          )}

          {sessions.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium">No TOTS Sessions Available</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Create your first Team of the Season voting session to get started
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Session
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Session Card component for admin view
const SessionCard = ({ session }: { session: TOTSSession }) => {
  const isActive = session.isActive;
  const isFinalized = session.isFinalized;

  return (
    <Card className="overflow-hidden border border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{session.name}</CardTitle>
            <CardDescription className="mt-1">{session.description}</CardDescription>
          </div>
          <div className="flex items-center">
            <Trophy className="w-5 h-5 text-emerald-500 mr-1" />
            <span className="text-sm font-medium">TOTS</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {format(new Date(session.startDate), "dd MMM yyyy")} - {format(new Date(session.endDate), "dd MMM yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isActive ? (
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

            {isFinalized && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                <Trophy className="w-3 h-3" />
                Finalized
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            {canManageTOTS() ? (
              <Link href={`/admin/super_admin/tots/${session._id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </Link>
            ) : (
              <Link href={`/admin/super_admin/tots/${session._id}/vote`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Cast Vote
                </Button>
              </Link>
            )}

            <Link href={`/football/tots/${session._id}`} className="flex-1">
              <Button variant="secondary" className="w-full">
                <AlertCircle className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TOTSAdminPage;
