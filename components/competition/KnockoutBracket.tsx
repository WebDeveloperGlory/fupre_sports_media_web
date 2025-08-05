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

  return (
    <div className="overflow-x-auto py-6">
      <div className="flex gap-12 min-w-[1000px]">
        {knockoutRounds.map((round, roundIndex) => (
          <div
            key={round._id}
            className="flex-1 space-y-6"
            style={{
              marginTop: `${roundIndex > 0 ? Math.pow(2, roundIndex - 1) * 1.5 : 0}rem`
            }}
          >
            {/* Round Header */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-foreground mb-1">{round.name}</h3>
              <div className="w-full h-px bg-border"></div>
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
                      <div className="absolute -left-6 top-1/2 w-6 h-px bg-border"></div>
                    )}

                    {/* Match Container */}
                    <div className="bg-background border-2 border-border hover:border-emerald-500/30 transition-colors w-64">
                      {/* Match Header */}
                      <div className="px-4 py-2 bg-muted/30 border-b border-border">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>{date || "TBD"}</span>
                            <Clock className="w-3 h-3" />
                            <span>{time || "TBD"}</span>
                          </div>
                          {fixture.status === FixtureStatus.COMPLETED && (
                            <Link
                              href={`/fixtures/${fixture._id}/stats`}
                              className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium uppercase tracking-wide hover:bg-emerald-200 transition-colors"
                            >
                              View Stats
                            </Link>
                          )}
                        </div>
                      </div>
                      {/* Teams */}
                      <div className="p-4 space-y-3">
                        {/* Home Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-medium text-foreground truncate">
                              {fixture.homeTeam?.name || "TBD"}
                            </span>
                          </div>
                          {fixture.status === FixtureStatus.COMPLETED && fixture.result && (
                            <div className="text-lg font-bold text-foreground ml-2">
                              {fixture.result.homeScore}
                            </div>
                          )}
                        </div>

                        {/* VS Divider */}
                        <div className="flex items-center justify-center">
                          <div className="w-full h-px bg-border"></div>
                          <span className="px-2 text-xs text-muted-foreground font-medium">VS</span>
                          <div className="w-full h-px bg-border"></div>
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-medium text-foreground truncate">
                              {fixture.awayTeam?.name || "TBD"}
                            </span>
                          </div>
                          {fixture.status === FixtureStatus.COMPLETED && fixture.result && (
                            <div className="text-lg font-bold text-foreground ml-2">
                              {fixture.result.awayScore}
                            </div>
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
                              Penalties: {fixture.result.homePenalty} - {fixture.result.awayPenalty}
                            </span>
                          </div>
                        )}

                        {/* Match Status */}
                        {fixture.status !== FixtureStatus.COMPLETED && (
                          <div className="text-center pt-2 border-t border-border">
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium uppercase tracking-wide">
                              {fixture.status || "Scheduled"}
                            </span>
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