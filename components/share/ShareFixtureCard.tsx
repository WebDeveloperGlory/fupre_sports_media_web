import { Team } from '@/utils/stateTypes';
import { Activity, Clock, MapPin, Users } from 'lucide-react';
import React, { forwardRef } from 'react'

const matchData = {
    competition: "Premier League",
    matchday: "Matchday 24",
    status: "Full Time",
    homeTeam: { name: "Manchester United", _id: '1' },
    awayTeam: { name: "Liverpool", _id: '2' },
    homeLogo: "/manutd.png",
    awayLogo: "/liverpool.png",
    homeScore: 2,
    awayScore: 1,
    stats: {
      home: { shots: 14, shotsOnTarget: 6, possession: 48, corners: 7, freeKicks: 15 },
      away: { shots: 16, shotsOnTarget: 4, possession: 52, corners: 5, freeKicks: 12 },
    },
    scorers: [
      { team: "home", player: "Marcus Rashford", minute: 24 },
      { team: "away", player: "Mohamed Salah", minute: 39 },
      { team: "home", player: "Bruno Fernandes", minute: 78 },
    ],
    venue: "Old Trafford",
    attendance: "74,140",
    date: "10 Feb 2025",
};

const ShareFixtureCard = forwardRef<HTMLDivElement>((_, ref) => {
    console.log( ref )
  return (
    <div
        ref={ ref } 
        className='max-w-2xl mx-auto bg-card p-8 rounded-xl shadow-lg border hover:shadow-xl transition-shadow duration-300'
    >
        {/* Competition Header */}
        <div className="text-center mb-8">
            <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-2">
                {matchData.competition}
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock size={16} />
                <span>{matchData.matchday} • {matchData.date}</span>
            </div>
        </div>

        {/* Score Section */}
        <div className="mb-8">
            <div className="flex items-center justify-between">
            <TeamScore 
                team={matchData.homeTeam} 
                score={matchData.homeScore} 
                isHome={true}
            />
            
            <div className="flex flex-col items-center">
                <div className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="text-4xl font-bold tracking-wider">
                    {matchData.homeScore} - {matchData.awayScore}
                </div>
                <div className="text-xs text-gray-400 text-center mt-1">
                    {matchData.status}
                </div>
                </div>
            </div>

            <TeamScore 
                team={matchData.awayTeam} 
                score={matchData.awayScore} 
                isHome={false}
            />
            </div>
        </div>

      {/* Goal Scorers */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Activity size={16} className="text-gray-600" />
          <h3 className="font-semibold text-gray-700">Goal Scorers</h3>
        </div>
        <div className="space-y-2">
          {matchData.scorers.map((goal, index) => (
            <div 
              key={index} 
              className={`
                flex items-center
                ${goal.team === "home" ? "justify-start" : "justify-end"}
                hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200
              `}
            >
              {goal.team === "home" && (
                <>
                  <span className="font-semibold text-gray-800">{goal.player}</span>
                  <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded-full">
                    {goal.minute}'
                  </span>
                </>
              )}
              {goal.team === "away" && (
                <>
                  <span className="mr-2 text-sm bg-gray-200 px-2 py-1 rounded-full">
                    {goal.minute}'
                  </span>
                  <span className="font-semibold text-gray-800">{goal.player}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

        {/* Match Stats */}
        <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
            <Activity size={16} className="text-gray-600" />
            <h3 className="font-semibold text-gray-700">Match Stats</h3>
            </div>
            <div className="space-y-4">
            {Object.entries(matchData.stats.home).map(([key, homeValue]) => {
                const awayValue = matchData.stats.away[key];
                const total = homeValue + awayValue;
                
                return (
                <div key={key} className="group">
                    <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-800">{homeValue}</span>
                    <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="font-semibold text-gray-800">{awayValue}</span>
                    </div>
                    <StatBar 
                    value={homeValue} 
                    total={total}
                    color={key === "possession" ? "bg-green-500" : "bg-blue-500"}
                    />
                </div>
                );
            })}
            </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-center items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{matchData.venue}</span>
            </div>
            <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{matchData.attendance}</span>
            </div>
        </div>
    </div>
  )
});

const StatBar = (
    { value, total, color = "bg-blue-500" }
    : { value: number, total: number, color?: string }
) => {
    const percentage = ( value / total ) * 100;
    return (
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
                className={`absolute h-full ${color} transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
  };

const TeamScore = (
    { team, isHome, score }: 
    { team: Team, isHome: boolean, score: number }
) => (
    <div className={`flex flex-col items-center w-1/3 ${ isHome ? 'pr-4' : 'pl-4' }`}>
        <h2 className="text-lg font-bold text-primary mt-2 text-center">{ team.name }</h2>
    </div>
);

export default ShareFixtureCard