export enum LiveStatus {
    PREMATCH = 'pre-match', 
    FIRSTHALF = '1st-half', 
    HALFTIME = 'half-time', 
    SECONDHALF = '2nd-half', 
    EXTRATIME = 'extra-time', 
    PENALTIES = 'penalties', 
    FINISHED = 'finished', 
    POSTPONED = 'postponed', 
    ABANDONED = 'abandoned'
}

export enum TeamType {
    HOME = 'home',
    AWAY = 'away'
}

export enum FixtureTimelineType {
    GOAL = 'goal', 
    YELLOWCARD = 'yellow-card', 
    REDCARD = 'red-card', 
    SUBSTITUTION = 'substitution',
    CORNER = 'corner',
    OFFSIDE = 'offside',
    PENALTYAWARDED = 'penalty-awarded', 
    PENALTYMISSED = 'penalty-missed', 
    PENALTYSAVED = 'penalty-saved', 
    OWNGOAL = 'own-goal', 
    VARDECISION = 'var-decision', 
    INJURY = 'injury'
}

export enum FixtureTimelineGoalType {
    REGULAR = 'regular', 
    PENALTY = 'penalty', 
    FREEKICK = 'free-kick', 
    HEADER = 'header', 
    OWNGOAL = 'own-goal'
}

export enum FixtureTimelineCardType {
    FIRSTYELLOW = 'first-yellow', 
    SECONDYELLOW = 'second-yellow', 
    STRAIGHTRED = 'straight-red'
}

export enum FixtureCommentaryType {
    IMPORTANT = 'important', 
    REGULAR = 'regular', 
    HIGHLIGHT = 'highlight'
}

export enum CompetitionType {
    LEAGUE = 'league',
    KNOCKOUT = 'knockout',
    HYBRID = 'hybrid'
}