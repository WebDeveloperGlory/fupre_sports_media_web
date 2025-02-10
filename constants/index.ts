import { EventTypes } from "@/utils/stateTypes";

export const getCurrentDate = (): string => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String( today.getMonth() + 1 ).padStart( 2, '0' );
	const day = String( today.getDate() ).padStart( 2, '0' );

	return `${ year }-${ month }-${ day }`;
}

export const EVENT_TYPES: EventTypes = {
    goal: 'goal',
    assist: 'assist',
    yellowCards: 'yellowCard',
    redCards: 'redCard',
    substitution: 'substitution',
    shotsOnTarget: 'shotOnTarget',
    shotsOffTarget: 'shotOffTarget',
    corners: 'corner',
    offsides: 'offside',
    fouls: 'foul',
    kickoff: 'kickoff',
    halftime: 'halftime',
    fulltime: 'fulltime'
};


const homeLineup = [
    { name: 'John Doe', _id: '12345' },
    { name: 'John Hoe', _id: '12346' },
    { name: 'John Moe', _id: '12347' },
    { name: 'John Soe', _id: '12348' },
];
const awayLineup = [
    { name: 'James Doe', _id: '12355' },
    { name: 'James Hoe', _id: '12356' },
    { name: 'James Moe', _id: '12357' },
    { name: 'James Soe', _id: '12358' },
]

export const liveFixtureInitialStateData = {
	homeTeam: {
        name: 'Man U',
        _id: '12'
    },
    awayTeam: {
        name: 'Chelsea',
        _id: '23'
    },
    homeLineup: {
        formation: '',
        startingXI: [],
        subs: []
    },
    awayLineup: {
        formation: '',
        startingXI: [],
        subs: []
    },
    competition: {
        name: 'Super League',
        _id: '',
        type: 'knockout'
    },
	home: {
        shotsOnTarget: 0,
        shotsOffTarget: 0,
        fouls: 0,
        yellowCards: 0,
        redCards: 0,
        offsides: 0,
        corners: 0
    },
    away: {
        shotsOnTarget: 0,
        shotsOffTarget: 0,
        fouls: 0,
        yellowCards: 0,
        redCards: 0,
        offsides: 0,
        corners: 0
    },
	homeScore: 0,
    awayScore: 0,
    homePenalty: null,
    awayPenalty: null
}