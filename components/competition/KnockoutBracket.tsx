import { IPopKnockoutRounds } from "@/utils/V2Utils/v2requestData.types";
import { FixtureStatus } from "@/utils/V2Utils/v2requestData.enums";
import { format } from "date-fns";
import Link from "next/link";
import { Calendar, Clock, Trophy } from "lucide-react";

export const KnockoutBracket = ({ knockoutRounds }: { knockoutRounds: IPopKnockoutRounds[] }) => {
  if (!knockoutRounds || knockoutRounds.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted flex items-center justify-center">
          <Trophy className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium">No knockout rounds available</p>
        <p className="text-sm">Tournament bracket will appear here once matches are scheduled</p>
      </div>
    );
  }

  const getStatusStyles = (status: FixtureStatus | string | undefined) => {
    switch (status) {
      case FixtureStatus.LIVE:
        return "bg-orange-100 text-orange-800";
      case FixtureStatus.COMPLETED:
        return "bg-emerald-100 text-emerald-800";
      case FixtureStatus.POSTPONED:
      case FixtureStatus.CANCELED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800"; // scheduled
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="overflow-x-auto py-6">
      <div className="flex gap-8 sm:gap-12 min-w-[900px]">
        {knockoutRounds.map((round, roundIndex) => (
          <div
            key={round._id}
            className="flex-1 space-y-6"
            style={{
              marginTop: `${roundIndex > 0 ? Math.pow(2, roundIndex - 1) * 1.5 : 0}rem`
            }}
          >
            {/* Round Header */}
            <div className="text-center sticky top-0 z-10">
              <div className="inline-block px-3 py-1 rounded-full bg-card/60 backdrop-blur border border-border">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">{round.name}</h3>
              </div>
            </div>

            {/* Fixtures */}
            <div className="space-y-8">
              {round.fixtures.map((fixture: any, fixtureIndex) => {
                const formattedDate = fixture.scheduledDate ? format(fixture.scheduledDate, "yyyy-MM-dd HH:mm") : null;
                const date = formattedDate ? formattedDate.split(" ")[0] : null;
                const time = formattedDate ? formattedDate.split(" ")[1] : null;

                return (
                  <div
                    key={fixture._id}
                    className="relative"
                    style={{
                      marginTop: `${fixtureIndex > 0 && roundIndex > 0 ? Math.pow(2, roundIndex) * 1.5 : 0}rem`
                    }}
                  >
                    {/* Connecting lines */}
                    {roundIndex > 0 && (
                      <div className="absolute -left-6 top-1/2 w-6 h-0.5 bg-border/70"></div>
                    )}

                    {/* Match Container */}
                    <div className="group bg-card/40 backdrop-blur-sm border border-border hover:border-emerald-500/40 transition-colors w-72 sm:w-64 rounded-xl shadow-sm">
                      {/* Match Header */}
                      <div className="px-4 py-2 bg-muted/30 border-b border-border rounded-t-xl">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>{date || "TBD"}</span>
                            <Clock className="w-3 h-3" />
                            <span>{time || "TBD"}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full font-medium ${getStatusStyles(fixture.status)}`}>
                            {fixture.status || "scheduled"}
                          </span>
                        </div>
                      </div>

                      {/* Teams */}
                      <div className="p-4 space-y-3">
                        {/* Home Team */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold">
                              {getInitials(fixture.homeTeam?.name)}
                            </div>
                            <span className="font-medium text-foreground truncate">
                              {fixture.homeTeam?.name || "TBD"}
                            </span>
                          </div>
                          {fixture.status === FixtureStatus.COMPLETED && fixture.result && (
                            <span className="text-sm font-bold text-foreground ml-2">
                              {fixture.result.homeScore}
                            </span>
                          )}
                        </div>

                        {/* Middle badge or VS */}
                        <div className="flex items-center justify-center">
                          {fixture.status === FixtureStatus.COMPLETED && fixture.result ? (
                            <span className="px-2 py-0.5 rounded-md border border-border text-xs font-semibold text-muted-foreground">
                              {fixture.result.homeScore} - {fixture.result.awayScore}
                            </span>
                          ) : (
                            <span className="px-2 text-xs text-muted-foreground font-medium">VS</span>
                          )}
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold">
                              {getInitials(fixture.awayTeam?.name)}
                            </div>
                            <span className="font-medium text-foreground truncate">
                              {fixture.awayTeam?.name || "TBD"}
                            </span>
                          </div>
                          {fixture.status === FixtureStatus.COMPLETED && fixture.result && (
                            <span className="text-sm font-bold text-foreground ml-2">
                              {fixture.result.awayScore}
                            </span>
                          )}
                        </div>

                        {/* Penalties */}
                        {fixture.result &&
                          fixture.result.homePenalty !== null &&
                          fixture.result.homePenalty !== undefined &&
                          fixture.result.awayPenalty !== null &&
                          fixture.result.awayPenalty !== undefined && (
                          <div className="text-center pt-2 border-t border-border">
                            <span className="text-xs text-muted-foreground">
                              Pens: {fixture.result.homePenalty} - {fixture.result.awayPenalty}
                            </span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end pt-1">
                          <Link
                            href={`/sports/football/fixtures/${fixture._id}/stats`}
                            className="text-xs text-emerald-600 hover:text-emerald-500"
                          >
                            View details
                          </Link>
                        </div>
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