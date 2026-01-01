'use client';

import { use, useEffect, useState } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { BackButton } from "@/components/ui/back-button";
import { AlertCircle } from "lucide-react";
import { TOTSResult, TOTSSession } from "@/utils/requestDataTypes";
import { getSingleTOTSSession, getTOTSSessionResults } from "@/lib/requests/v1/tots/requests";
import ResultsDisplay from "@/components/tots/ResultsDisplay";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TOTSResultsPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

const TOTSResultsPage = ({ params }: TOTSResultsPageProps) => {
  const resolvedParams = use(params);

  const { sessionId } = resolvedParams;

  const [session, setSession] = useState<TOTSSession | null>(null);
  const [results, setResults] = useState<TOTSResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch session details
        const sessionResponse = await getSingleTOTSSession(sessionId);
        if (sessionResponse && sessionResponse.code === "00") {
          setSession(sessionResponse.data);
          
          // Fetch results
          const resultsResponse = await getTOTSSessionResults(sessionId);
          if (resultsResponse && resultsResponse.code === "00") {
            setResults(resultsResponse.data);
          } else {
            setError(resultsResponse?.message || "Failed to fetch results");
          }
        } else {
          setError(sessionResponse?.message || "Failed to fetch session details");
        }
      } catch (error) {
        console.error("Error fetching TOTS results:", error);
        setError("An error occurred while fetching the results");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  if (!session?.isFinalized && !loading) {
    return (
      <BlurFade>
        <div className="max-w-6xl mx-auto">
          <div className="fixed top-6 left-4 md:left-8 z-10">
            <BackButton />
          </div>
          
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Results Not Available</h1>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              The results for this Team of the Season voting session are not yet available. Please check back after the voting period has ended.
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
        ) : session && results ? (
          <ResultsDisplay session={session} result={results} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">No Results Found</h1>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              We couldn't find any results for this Team of the Season voting session.
            </p>
            <Link href="/football/tots">
              <Button>
                View All TOTS Sessions
              </Button>
            </Link>
          </div>
        )}
      </div>
    </BlurFade>
  );
};

export default TOTSResultsPage;
