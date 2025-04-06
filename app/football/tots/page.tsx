'use client';

import { useEffect, useState } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Trophy } from "lucide-react";
import { TOTSSession } from "@/utils/requestDataTypes";
import { getAllTOTSSessions } from "@/lib/requests/tots/requests";
import TOTSSessionCard from "@/components/tots/TOTSSessionCard";
import { Loader } from "@/components/ui/loader";

const TOTSPage = () => {
  const [sessions, setSessions] = useState<TOTSSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getAllTOTSSessions();
        if (response && response.code === "00") {
          console.log( response )
          setSessions(response.data.sessions);
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
  }, []);

  // Filter active and inactive sessions
  const activeSessions = sessions.filter(session => session.isActive);
  const now = new Date();
  const finishedSessions = sessions.filter(session => new Date(session.endDate) < now);
  const upcomingSessions = sessions.filter(
    session => new Date(session.startDate) > now || !session.isActive
  );

  return (
    <BlurFade>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-emerald-500" />
            Team of the Season
          </h1>
          <p className="text-muted-foreground mt-2">
            Vote for the best players of the season and see the results
          </p>
        </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeSessions.map(session => (
                    <TOTSSessionCard key={session._id} session={session} />
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {finishedSessions.map(session => (
                    <TOTSSessionCard key={session._id} session={session} />
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingSessions.map(session => (
                    <TOTSSessionCard key={session._id} session={session} />
                  ))}
                </div>
              </div>
            )}

            {sessions.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium">No TOTS Sessions Available</h3>
                <p className="text-muted-foreground mt-2">
                  Check back later for upcoming Team of the Season voting sessions
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </BlurFade>
  );
};

export default TOTSPage;
