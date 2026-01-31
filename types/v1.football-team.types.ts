export interface FootballTeamProps {
    id?: string;
    name: string;
    shorthand: string;
    logo: string | null;
    faculty: string | null;
    department: string | null;
    type: TeamTypes;
    colors: TeamColor;
    academicYear: string;
    stats: PerformanceStats;
    coaches: {
        name: string;
        role: CoachRoles;
    }[];
    admin: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export type PerformanceStats = {
    played: number;
    wins: number;
    loses: number;
    draws: number;
    goalsFor: number;
    goalsAgainst: number;
}

export type TeamColor = {
    primary: string;
    secondary: string;
}

export enum TeamTypes {
    DEPARTMENT_LEVEL = 'departmental-level',
    DEPARTMENT_GENERAL = 'departmental-general',
    FACULTY_GENERAL = 'faculty-general',
    LEVEL_GENERAL = 'level-general',
    SCHOOL_GENERAL = 'school-general',
    CLUB = 'club'
}

export enum CoachRoles {
    HEAD = 'head',
    ASSISTANT = 'assistant',
    GOALKEEPING = 'goalkeeping',
    FITNESS = 'fitness'
}