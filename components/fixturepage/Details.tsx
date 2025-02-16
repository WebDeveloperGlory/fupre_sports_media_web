import React from 'react'
import Image from 'next/image';
import { History, Swords } from "lucide-react";
import { cn } from "@/utils/cn";
import { teamLogos } from '@/constants';
import { Fixture } from '@/utils/requestDataTypes';
import { Head2Head, LastFixture, TeamForm } from "@/utils/stateTypes";
import { format } from 'date-fns';

function FormIndicator({ result }: { result: string }) {
  const getColor = (result: string) => {
    switch (result) {
      case "W":
        return "bg-emerald-500";
      case "D":
        return "bg-orange-500";
      case "L":
        return "bg-red-500";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className={cn(
      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white",
      getColor(result)
    )}>
      {result}
    </div>
  );
}

const Details = (
    { fixtureData, teamForm, head2head, lastFixtures, activeTeamFixturesTab, setActiveTeamFixturesTab }:
    { fixtureData: Fixture | null, teamForm: TeamForm | null, head2head: Head2Head | null, lastFixtures: LastFixture | null, activeTeamFixturesTab: string, setActiveTeamFixturesTab: ( str: string ) => void }
) => {
  return (
    <>
        {/* Team Forms */}
        <div className="bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
        <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
            <History className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
            <span>Team Forms</span>
        </h2>
        <div className="space-y-4">
            {/* Home Team Form */}
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image
                    src={ teamLogos[ fixtureData!.homeTeam.name ] || '/images/team_logos/default.jpg' }
                    alt={ fixtureData?.homeTeam.name || 'Home Logo' }
                    fill
                    className="object-contain rounded-full"
                />
                </div>
                <span className="font-medium">{ fixtureData?.homeTeam.name }</span>
            </div>
            <div className="flex items-center gap-2">
                {
                teamForm?.homeTeamForm.map(( result, index ) => (
                    <FormIndicator key={ index } result={ result } />
                ))
                }
            </div>
            </div>
            {/* Away Team Form */}
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image
                    src={ teamLogos[ fixtureData!.awayTeam.name ] || '/images/team_logos/default.jpg' }
                    alt={ fixtureData?.awayTeam.name || 'Home Logo' }
                    fill
                    className="object-contain rounded-full"
                />
                </div>
                <span className="font-medium">{ fixtureData?.awayTeam.name }</span>
            </div>
            <div className="flex items-center gap-2">
                {
                teamForm?.awayTeamForm.map(( result, index ) => (
                    <FormIndicator key={ index } result={ result } />
                ))
                }
            </div>
            </div>
        </div>
        </div>

        {/* Head to Head */}
        <div className="bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
        <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
            <Swords className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
            <span>Head to Head</span>
        </h2>
        
        {/* Overall Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500">{ head2head?.homeWins }</div>
            <div className="text-sm text-muted-foreground">Home Wins</div>
            </div>
            <div className="text-center">
            <div className="text-2xl font-bold">{ head2head?.draws }</div>
            <div className="text-sm text-muted-foreground">Draws</div>
            </div>
            <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500">{ head2head?.awayWins }</div>
            <div className="text-sm text-muted-foreground">Away Wins</div>
            </div>
        </div>

        {/* Head To Head Matches */}
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Head2Head Matches</h3>
        <div className="space-y-3">
            {
            head2head?.fixtures.map(( fixture, index ) => {
                const formattedDate = fixture ? format( fixture.date, "yyyy-MM-dd HH:mm" ) : null;
                const date = formattedDate ? formattedDate.split(' ')[ 0 ] : null;
                const time = formattedDate ? formattedDate.split(' ')[ 1 ] : null;

                return (
                <div
                    key={ fixture._id }
                    className="bg-card/40 backdrop-blur-sm rounded-lg p-3 border border-border"
                >
                    <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{ date }</span>
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                        { fixture?.competition?.name || 'Friendly' }
                    </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                    <span className="font-medium basis-5/12 text-left">{ fixture?.homeTeam.name }</span>
                    <span className="font-bold mx-3 basis-2/12 text-center">
                        { fixture?.result.homeScore } - { fixture?.result.awayScore }
                    </span>
                    <span className="font-medium basis-5/12 text-right">{ fixture?.awayTeam.name }</span>
                    </div>
                </div>
                )
            })
            }
            {
            head2head?.fixtures.length === 0 && (
                <span>No Past Meetings</span>
            )
            }
        </div>
        </div>

        {/* Last Fixtures */}
        <div className="bg-card/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-border">
        <h2 className="text-base md:text-lg font-semibold mb-1 flex items-center gap-2">
            <History className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
            <span>Last Fixtures</span>
        </h2>

        {/* Tabs */}
        <div className="flex border-b border-border mb-4 md:mb-6">
            {
            [ 'home', 'away' ].map( str => (
                <button
                key={ str }
                onClick={ () => setActiveTeamFixturesTab( str ) }
                className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors capitalize",
                    activeTeamFixturesTab === str
                    ? "text-emerald-500 border-b-2 border-emerald-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
                >
                { str }
                </button>
            ))
            }
        </div>

        {/* Last Matches */}
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Last Matches</h3>
        <div className="space-y-3">
            {
            activeTeamFixturesTab === 'home' && lastFixtures?.homeLastFixtures.map(( fixture, index ) => {
                const formattedDate = fixture ? format( fixture.date, "yyyy-MM-dd HH:mm" ) : null;
                const date = formattedDate ? formattedDate.split(' ')[ 0 ] : null;
                const time = formattedDate ? formattedDate.split(' ')[ 1 ] : null;

                return (
                <div
                    key={ fixture._id }
                    className="bg-card/40 backdrop-blur-sm rounded-lg p-3 border border-border"
                >
                    <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{ date }</span>
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                        { fixture?.competition?.name || 'Friendly' }
                    </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                    <span 
                        className={`
                        font-medium basis-5/12 text-left ${
                            fixture?.homeTeam.name === fixtureData?.homeTeam.name
                            ? 'text-emerald-500'
                            : ''
                        }
                        `}
                    >
                        { fixture?.homeTeam.name }
                    </span>
                    <span className="font-bold mx-3 basis-2/12 text-center">
                        { fixture?.result.homeScore } - { fixture?.result.awayScore }
                    </span>
                    <span 
                        className={`
                        font-medium basis-5/12 text-right ${
                            fixture?.awayTeam.name === fixtureData?.homeTeam.name
                            ? 'text-emerald-500'
                            : ''
                        }
                        `}
                    >
                        { fixture?.awayTeam.name }
                    </span>
                    </div>
                </div>
                )
            })
            }
            {
            activeTeamFixturesTab === 'away' && lastFixtures?.awayLastFixtures.map(( fixture, index ) => {
                const formattedDate = fixture ? format( fixture.date, "yyyy-MM-dd HH:mm" ) : null;
                const date = formattedDate ? formattedDate.split(' ')[ 0 ] : null;
                const time = formattedDate ? formattedDate.split(' ')[ 1 ] : null;

                return (
                <div
                    key={ fixture._id }
                    className="bg-card/40 backdrop-blur-sm rounded-lg p-3 border border-border"
                >
                    <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{ date }</span>
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                        { fixture?.competition?.name || 'Friendly' }
                    </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                    <span 
                        className={`
                        font-medium basis-5/12 text-left ${
                            fixture?.homeTeam.name === fixtureData?.awayTeam.name
                            ? 'text-emerald-500'
                            : ''
                        }
                        `}
                    >
                        { fixture?.homeTeam.name }
                    </span>
                    <span className="font-bold mx-3 basis-2/12 text-center">
                        { fixture?.result.homeScore } - { fixture?.result.awayScore }
                    </span>
                    <span 
                        className={`
                        font-medium basis-5/12 text-right ${
                            fixture?.awayTeam.name === fixtureData?.awayTeam.name
                            ? 'text-emerald-500'
                            : ''
                        }
                        `}
                    >
                        { fixture?.awayTeam.name }
                    </span>
                    </div>
                </div>
                )
            })
            }
            {
            activeTeamFixturesTab === 'home' && lastFixtures?.homeLastFixtures.length === 0 && (
                <span>No Past Meetings</span>
            )
            }
            {
            activeTeamFixturesTab === 'away' && lastFixtures?.awayLastFixtures.length === 0 && (
                <span>No Past Meetings</span>
            )
            }
        </div>
        </div>
    </>
  )
}

export default Details