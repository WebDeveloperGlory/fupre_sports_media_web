import { Competition, Fixture } from "@/utils/requestDataTypes";
import { format } from "date-fns";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

interface KnockoutBracketProps {
  competition: Competition;
}

export const KnockoutBracket = ({ competition }: KnockoutBracketProps) => {
  const knockoutRounds = competition.knockoutRounds;

  if (!knockoutRounds || knockoutRounds.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No knockout rounds available
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 overflow-x-auto">
      <div className="flex gap-8 md:gap-16 min-w-[800px]">
        {knockoutRounds.map((round, roundIndex) => (
          <div 
            key={round._id} 
            className="flex-1 space-y-2 md:space-y-4"
            style={{
              marginTop: `${roundIndex > 0 ? Math.pow(2, roundIndex - 1) * 2 : 0}rem`
            }}
          >
            <h3 className="text-base md:text-lg font-semibold text-emerald-500 mb-2 md:mb-4">{round.name}</h3>
            <div className="grid gap-4 md:gap-8">
              {round.fixtures.map((fixture: any, fixtureIndex) => {
                const formattedDate = fixture.date ? format(fixture.date, "yyyy-MM-dd HH:mm") : null;
                const date = formattedDate ? formattedDate.split(" ")[0] : null;
                const time = formattedDate ? formattedDate.split(" ")[1] : null;

                return (
                  <div key={fixture._id} className="relative">
                    {/* Connecting lines */}
                    {roundIndex < knockoutRounds.length - 1 && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 w-8 md:w-16 flex items-center">
                        <div className="w-full h-[2px] bg-border"></div>
                      </div>
                    )}
                    {/* Vertical connecting line for pairs */}
                    {fixtureIndex % 2 === 0 && roundIndex < knockoutRounds.length - 1 && (
                      <div 
                        className="absolute left-full top-1/2 w-[2px] bg-border"
                        style={{
                          height: `${Math.pow(2, roundIndex + 1) * 2}rem`
                        }}
                      ></div>
                    )}
                    {/* Match box */}
                    <div className="p-2 md:p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors w-48 md:w-64">
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{date || "TBD"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{time || "TBD"}</span>
                          </div>
                        </div>
                        {fixture.status === "completed" && (
                          <Link
                            href={`/fixtures/${fixture._id}/stats`}
                            className="px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                          >
                            View Stats
                          </Link>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 md:gap-2">
                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <span className="font-medium truncate pr-2">{fixture.homeTeam?.name || "TBD"}</span>
                          {fixture.status === "completed" && fixture.result && (
                            <span className="font-bold">{fixture.result.homeScore}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs md:text-sm">
                          <span className="font-medium truncate pr-2">{fixture.awayTeam?.name || "TBD"}</span>
                          {fixture.status === "completed" && fixture.result && (
                            <span className="font-bold">{fixture.result.awayScore}</span>
                          )}
                        </div>
                        {fixture.result?.homePenalty !== null && fixture.result?.awayPenalty !== null && (
                          <div className="text-[10px] md:text-xs text-muted-foreground text-center mt-1">
                            Penalties: {fixture.result.homePenalty} - {fixture.result.awayPenalty}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};