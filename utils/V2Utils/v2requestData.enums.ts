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

export enum TeamTypes {
    DEPARTMENT_LEVEL = 'departmental-level',  // CS 100L
    DEPARTMENT_GENERAL = 'departmental-general', // CS Dept
    FACULTY_GENERAL = 'faculty-general',    // Engineering Faculty
    LEVEL_GENERAL = 'level-general',      // All 100L students
    SCHOOL_GENERAL = 'school-general',     // University-wide
    CLUB = 'club'                // Cross-department clubs
}

export enum FriendlyRequestStatus {
    PENDING = 'pending', 
    ACCEPTED = 'accepted', 
    REJECTED = 'rejected'
}

export enum CoachRoles {
    HEAD = 'head', 
    ASSISTANT = 'assistant', 
    GOALKEEPING = 'goalkeeping', 
    FITNESS = 'fitness'
}

export enum PlayerRole {
    PLAYER = 'player',
    CAPTAIN = 'captain',
    VICE_CAPTAIN = 'vice-captain'
}

export enum FavoriteFoot {
    LEFT = 'left',
    RIGHT = 'right',
    BOTH = 'both'
}

export enum CompetitionTypes {
    LEAGUE = 'league',
    KNOCKOUT = 'knockout',
    HYBRID = 'hybrid'
}

export enum CompetitionSponsors {
    MAIN = 'main', 
    OFFICIAL = 'official', 
    PARTNER = 'partner'
}

export enum CompetitionTeamForm {
    WIN = 'W',
    LOSS = 'L',
    DRAW = 'D'
}

export enum CompetitionStatus {
    UPCOMING = 'upcoming',
    COMPLETED = 'completed',
    ONGOING = 'ongoing',
    CANCELLED = 'cancelled'
}

export enum FixtureStatus {
    SCHEDULED = 'scheduled', 
    LIVE = 'live', 
    COMPLETED = 'completed', 
    POSTPONED = 'postponed', 
    CANCELED = 'canceled'
}

export enum LogAction {
    CREATE = 'CREATE', 
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    LOGIN = 'LOGIN', 
    LOGOUT = 'LOGOUT',
}

export enum UserRole {
    USER = 'user',
    SUPER_ADMIN = 'super-admin',
    MEDIA_ADMIN = 'media-admin',
    HEAD_MEDIA_ADMIN = 'head-media-admin',
    COMPETITION_ADMIN = 'competition-admin',
    TEAM_ADMIN = 'team-admin',
    LIVE_FIXTURE_ADMIN = 'live-fixture-admin'
}

export enum SportType {
    FOOTBALL = 'football',
    BASKETBALL = 'basketball',
    VOLLEYBALL = 'volleyball',
    ALL = 'all'
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended'
}

export enum PlayerClubStatus {
    REGISTERED = 'registered', 
    ON_LOAN = 'on-loan',
    TRANSFERRED_OUT = 'transferred-out'
}

export enum BlogCategories {
    FOOTBALL = 'football',
    BASKETBALL = 'basketball',
    CHESSS = 'chesss',
    VOLLEYBALL = 'volleyball',
    ATHLETICS = 'athletics',
    GENERAL = 'general',
}