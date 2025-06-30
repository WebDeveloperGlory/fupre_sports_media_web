import { TOTSPlayer, TOTSResult, TOTSSession, TOTSSessionWithPlayers, TOTSUserVote } from "@/utils/requestDataTypes";

// Mock TOTS Sessions
export const mockTOTSSessions: any[] = [
  {
    _id: "tots-1",
    name: "Football TOTS 2023/24",
    description: "Vote for the best players of the 2023/24 football season",
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-04-30"),
    isActive: true,
    isFinalized: false,
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
    year: 2025,
    competition: { name: '', _id: '1234'},
  },
  {
    _id: "tots-2",
    name: "Basketball TOTS 2023/24",
    description: "Vote for the best basketball players of the season",
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-04-15"),
    isActive: false,
    isFinalized: true,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-04-16")
  },
  {
    _id: "tots-3",
    name: "Volleyball TOTS 2024",
    description: "Vote for the best volleyball players of the year",
    startDate: new Date("2024-05-01"),
    endDate: new Date("2024-05-30"),
    isActive: false,
    isFinalized: false,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-01")
  }
];

// Mock TOTS Players
export const mockTOTSPlayers: Record<string, TOTSPlayer[]> = {
  "tots-1": [
    {
      _id: "player-1",
      name: "John Smith",
      position: "Goalkeeper",
      team: {
        _id: "team-1",
        name: "FC United",
        shorthand: "FCU"
      },
      votes: 45
    },
    {
      _id: "player-2",
      name: "Michael Johnson",
      position: "Defender",
      team: {
        _id: "team-2",
        name: "City FC",
        shorthand: "CFC"
      },
      votes: 38
    },
    {
      _id: "player-3",
      name: "David Williams",
      position: "Defender",
      team: {
        _id: "team-1",
        name: "FC United",
        shorthand: "FCU"
      },
      votes: 32
    },
    {
      _id: "player-4",
      name: "Robert Brown",
      position: "Defender",
      team: {
        _id: "team-3",
        name: "Athletic Club",
        shorthand: "ATH"
      },
      votes: 29
    },
    {
      _id: "player-5",
      name: "James Davis",
      position: "Defender",
      team: {
        _id: "team-2",
        name: "City FC",
        shorthand: "CFC"
      },
      votes: 27
    },
    {
      _id: "player-6",
      name: "Thomas Wilson",
      position: "Midfielder",
      team: {
        _id: "team-1",
        name: "FC United",
        shorthand: "FCU"
      },
      votes: 52
    },
    {
      _id: "player-7",
      name: "Daniel Taylor",
      position: "Midfielder",
      team: {
        _id: "team-3",
        name: "Athletic Club",
        shorthand: "ATH"
      },
      votes: 48
    },
    {
      _id: "player-8",
      name: "Christopher Anderson",
      position: "Midfielder",
      team: {
        _id: "team-2",
        name: "City FC",
        shorthand: "CFC"
      },
      votes: 41
    },
    {
      _id: "player-9",
      name: "Matthew Martinez",
      position: "Forward",
      team: {
        _id: "team-1",
        name: "FC United",
        shorthand: "FCU"
      },
      votes: 63
    },
    {
      _id: "player-10",
      name: "Anthony Thompson",
      position: "Forward",
      team: {
        _id: "team-2",
        name: "City FC",
        shorthand: "CFC"
      },
      votes: 58
    },
    {
      _id: "player-11",
      name: "Mark Garcia",
      position: "Forward",
      team: {
        _id: "team-3",
        name: "Athletic Club",
        shorthand: "ATH"
      },
      votes: 51
    }
  ],
  "tots-2": [
    {
      _id: "player-12",
      name: "Kevin Johnson",
      position: "Point Guard",
      team: {
        _id: "team-4",
        name: "Ballers",
        shorthand: "BAL"
      },
      votes: 72
    },
    {
      _id: "player-13",
      name: "Stephen Curry",
      position: "Shooting Guard",
      team: {
        _id: "team-5",
        name: "Hoops",
        shorthand: "HPS"
      },
      votes: 85
    },
    {
      _id: "player-14",
      name: "LeBron James",
      position: "Small Forward",
      team: {
        _id: "team-4",
        name: "Ballers",
        shorthand: "BAL"
      },
      votes: 92
    },
    {
      _id: "player-15",
      name: "Giannis Antetokounmpo",
      position: "Power Forward",
      team: {
        _id: "team-6",
        name: "Dunkers",
        shorthand: "DNK"
      },
      votes: 88
    },
    {
      _id: "player-16",
      name: "Joel Embiid",
      position: "Center",
      team: {
        _id: "team-5",
        name: "Hoops",
        shorthand: "HPS"
      },
      votes: 79
    }
  ],
  "tots-3": [
    {
      _id: "player-17",
      name: "Sarah Johnson",
      position: "Setter",
      team: {
        _id: "team-7",
        name: "Spikers",
        shorthand: "SPK"
      },
      votes: 0
    },
    {
      _id: "player-18",
      name: "Emily Davis",
      position: "Outside Hitter",
      team: {
        _id: "team-8",
        name: "Blockers",
        shorthand: "BLK"
      },
      votes: 0
    },
    {
      _id: "player-19",
      name: "Jessica Wilson",
      position: "Middle Blocker",
      team: {
        _id: "team-7",
        name: "Spikers",
        shorthand: "SPK"
      },
      votes: 0
    },
    {
      _id: "player-20",
      name: "Amanda Brown",
      position: "Libero",
      team: {
        _id: "team-9",
        name: "Servers",
        shorthand: "SRV"
      },
      votes: 0
    }
  ]
};

// Mock TOTS Results
// export const mockTOTSResults: Record<string, TOTSResult> = {
export const mockTOTSResults: any = {
  "tots-2": {
    _id: "result-1",
    session: "tots-2",
    players: mockTOTSPlayers["tots-2"],
    totalVotes: 416,
    createdAt: new Date("2024-04-16")
  }
};

// Mock User Votes
// export const mockUserVotes: Record<string, TOTSUserVote> = {
export const mockUserVotes: any = {
  "tots-1": {
    _id: "vote-1",
    sessionId: "tots-1",
    userId: "current-user",
    playerIds: ["player-1", "player-2", "player-3", "player-6", "player-9"],
    createdAt: new Date("2024-04-10")
  }
};

// Helper function to get a session with players
export const getSessionWithPlayers = (sessionId: string): TOTSSessionWithPlayers | null => {
  const session = mockTOTSSessions.find(s => s._id === sessionId);
  const players = mockTOTSPlayers[sessionId] || [];
  
  if (!session) return null;
  
  return {
    ...session,
    players
  };
};
