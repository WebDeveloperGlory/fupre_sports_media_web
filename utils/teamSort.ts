type TeamRecord = {
    wins: number;
    losses: number;
    draws: number;
};
  
type Team = {
    record: TeamRecord;
    recentPerformance: string[];
};
  
type SortBy = 'wins' | 'losses' | 'draws' | 'form';
  
export const calculateFormPercentage = ( performance: string[] ): number => {
    if ( !performance || performance.length === 0 ) return 0;
  
    const points = performance.reduce((total, result) => {
        switch ( result ) {
            case 'W': return total + 3;
            case 'D': return total + 1;
            case 'L': return total + 0;
            default: return total;
        }
    }, 0);
  
    const maxPossiblePoints = performance.length * 3;
    return ( points / maxPossiblePoints ) * 100;
};
  
export const sortTypes = {
    WINS: 'wins' as const,
    LOSS: 'losses' as const,
    DRAWS: 'draws' as const,
    FORM: 'form' as const,
};
  
export const getSortedTeams = (
    teams: Team[],
    sortBy: SortBy,
    sortDirection: 'asc' | 'desc' = 'desc'
): Team[] => {
    const multiplier = sortDirection === 'desc' ? -1 : 1;
  
    return [...teams].sort((a, b) => {
        switch (sortBy) {
            case sortTypes.WINS:
                return (a.record.wins - b.record.wins) * multiplier;
            case sortTypes.LOSS:
                return (a.record.losses - b.record.losses) * multiplier;
            case sortTypes.DRAWS:
                return (a.record.draws - b.record.draws) * multiplier;
            case sortTypes.FORM:
                const formA = calculateFormPercentage(a.recentPerformance);
                const formB = calculateFormPercentage(b.recentPerformance);
                return (formA - formB) * multiplier;
            default:
                return 0;
        }
    });
};
  