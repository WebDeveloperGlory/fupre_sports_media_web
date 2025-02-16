import { Statistics } from "@/utils/requestDataTypes";
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

export const emptyStats: Statistics = {
    shotsOnTarget: 0,
    shotsOffTarget: 0,
    fouls: 0,
    yellowCards: 0,
    redCards: 0,
    offsides: 0,
    corners: 0
}

export const liveFixtureInitialStateData = {
	homeTeam: {
        name: 'Propellers',
        _id: '12'
    },
    awayTeam: {
        name: 'Rayos FC',
        _id: '23'
    },
    homeLineup: {
        formation: '',
        startingXI: [
            { name: 'B Lionz', position: 'GK', _id: '111' },
            { name: 'Clipha', position: 'GK', _id: '222' },
            { name: 'Emmanuel', position: 'GK', _id: '333' },
            { name: 'Gamer X', position: 'GK', _id: '444' },
            { name: 'Godsent', position: 'GK', _id: '555' },
            { name: 'Golden Jet', position: 'GK', _id: '66' },
            { name: 'Isaac', position: 'GK', _id: '777' },
            { name: 'Jeffrey', position: 'GK', _id: '888' },
            { name: 'Joseph', position: 'GK', _id: '999' },
            { name: 'Noble', position: 'GK', _id: '989' },
            { name: 'Pius', position: 'GK', _id: '878' },
            { name: 'Sammy', position: 'GK', _id: '767' },
            { name: 'TAO', position: 'GK', _id: '656' },
            { name: 'Uche', position: 'GK', _id: '545' },
            { name: 'Verified', position: 'GK', _id: '434' },
        ],
        subs: []
    },
    awayLineup: {
        formation: '',
        startingXI: [],
        subs: []
    },
    competition: {
        name: 'Fupre Super League',
        _id: '123',
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

export const teamLogos: Record<string, string> = {
    'Red Bull FC': '/images/team_logos/red_bull_fc.jpg',
    'Citizens': '/images/team_logos/citizens.jpg',
    'Kalakuta FC': '/images/team_logos/kalakuta_fc.jpg',
    'Propellers': '/images/team_logos/propellers.jpg',
    'Rayos FC': '/images/team_logos/rayos_fc.jpg',
    'New Horizon': '/images/team_logos/new_horizon.jpg',
    'Seventeen FC': '/images/team_logos/seventeen_fc.jpg',
    'Twale FC': '/images/team_logos/twale_fc.jpg',
    'Matadors FC': '/images/team_logos/matadors_fc.jpg',
}