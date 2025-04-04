'use client';

import { TOTSSession } from "@/utils/requestDataTypes";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";

interface TOTSSessionCardProps {
  session: TOTSSession;
}

const TOTSSessionCard = ({ session }: TOTSSessionCardProps) => {
  const isActive = session.isActive;
  const isFinalized = session.isFinalized;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
        <CardContent className="pb-2">
          <div className="flex flex-col space-y-2">
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
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex gap-2 w-full">
            {isFinalized ? (
              <Link href={`/football/tots/${session._id}/result`} className="w-full">
                <Button variant="default" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Results
                </Button>
              </Link>
            ) : (
              <Link href={`/football/tots/${session._id}`} className="w-full">
                <Button variant="default" className="w-full" disabled={!isActive}>
                  <Users className="w-4 h-4 mr-2" />
                  {isActive ? "Vote Now" : "Voting Closed"}
                </Button>
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TOTSSessionCard;
