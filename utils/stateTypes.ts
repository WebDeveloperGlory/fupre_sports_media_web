interface Competition {
    name: string,
    _id: string
    type: string
}

interface Players {
    name: string,
    position: string
}

interface LineUp {
    formation: string,
    startingXI: Players[],
    subs: Players[]
}

interface FixtureStats {
    shotsOnTarget: number,
    shotsOffTarget: number,
    fouls: number,
    yellowCards: number,
    redCards: number,
    offsides: number,
    corners: number
}

export interface LiveStatState {
    homeTeam: {
        name: string,
        _id: string
    },
    awayTeam: {
        name: string,
        _id: string
    },

    homeLineup: LineUp | null,
    awayLineup: LineUp | null,
    competition: Competition | null,

    home: FixtureStats,
    away: FixtureStats,

    homeScore: number,
    awayScore: number,
    homePenalty: number | null,
    awayPenalty: number | null
}