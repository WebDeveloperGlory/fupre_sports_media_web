import axiosInstance from "@/lib/config/axiosInstance";
import { mockTOTSSessions, mockTOTSPlayers, mockTOTSResults, mockUserVotes, getSessionWithPlayers } from "@/lib/mock/totsData";

interface CustomError {
  status?: number;
  message?: string;
  response?: {
      data: {
          message: string,
          code: string,
          data?: any
      };
  };
}

interface SuccessRequest {
  code: string,
  message: string,
  data?: any
}

const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_PROD_API_URL
  : process.env.NEXT_PUBLIC_DEV_API_URL;

// Using mock data for development
const USE_MOCK_DATA = true;

// User-facing endpoints

export const getAllTOTSSessions = async () => {
  try {
      const response = await axiosInstance.get(
          `${ API_URL }/tots`
      );
      const { data }: { data: SuccessRequest } = response;

      if( data.code === '99' ) {
          throw data
      }
      return data;
  } catch( err: any ) {
      const { response } = err as CustomError;

      if( err?.status && err?.message ) {
          console.error( `Error ${ err.status }: `, response?.data.message )
          return response?.data || null;
      } else {
          console.error('Error fetching tots sessions: ', err );
          return null;
      }
  }
}
export const getAllTOTSSessions1 = async () => {
  if (USE_MOCK_DATA) {
    return {
      code: '00',
      message: 'Success',
      data: mockTOTSSessions
    };
  }

  try {
    const response = await axiosInstance.get(`${API_URL}/football/tots`);
    const { data }: { data: SuccessRequest } = response;

    if (data.code === '99') {
      throw data;
    }

    return data;
  } catch (error) {
    const err = error as CustomError;
    if (err.response) {
      return err.response.data;
    }
    return {
      code: '99',
      message: 'Something went wrong',
      data: null
    };
  }
};

export const getSingleTOTSSession = async (sessionId: string) => {
  if (USE_MOCK_DATA) {
    const session = mockTOTSSessions.find(s => s._id === sessionId);

    if (!session) {
      return {
        code: '99',
        message: 'Session not found',
        data: null
      };
    }

    return {
      code: '00',
      message: 'Success',
      data: session
    };
  }

  try {
    const response = await axiosInstance.get(`${API_URL}/tots/${sessionId}`);
    const { data }: { data: SuccessRequest } = response;

    if (data.code === '99') {
      throw data;
    }

    return data;
  } catch (error) {
    const err = error as CustomError;
    if (err.response) {
      return err.response.data;
    }
    return {
      code: '99',
      message: 'Something went wrong',
      data: null
    };
  }
};

export const getTOTSSessionPlayers = async (sessionId: string) => {
  if (USE_MOCK_DATA) {
    const players = mockTOTSPlayers[sessionId] || [];

    return {
      code: '00',
      message: 'Success',
      data: players
    };
  }

  try {
    const response = await axiosInstance.get(`${API_URL}/football/tots/${sessionId}/players`);
    const { data }: { data: SuccessRequest } = response;

    if (data.code === '99') {
      throw data;
    }

    return data;
  } catch (error) {
    const err = error as CustomError;
    if (err.response) {
      return err.response.data;
    }
    return {
      code: '99',
      message: 'Something went wrong',
      data: null
    };
  }
};

export const getTOTSSessionResults = async (sessionId: string) => {
  if (USE_MOCK_DATA) {
    const result = mockTOTSResults[sessionId];

    if (!result) {
      return {
        code: '99',
        message: 'Results not found',
        data: null
      };
    }

    return {
      code: '00',
      message: 'Success',
      data: result
    };
  }

  try {
    const response = await axiosInstance.get(`${API_URL}/football/tots/${sessionId}/result`);
    const { data }: { data: SuccessRequest } = response;

    if (data.code === '99') {
      throw data;
    }

    return data;
  } catch (error) {
    const err = error as CustomError;
    if (err.response) {
      return err.response.data;
    }
    return {
      code: '99',
      message: 'Something went wrong',
      data: null
    };
  }
};

export const getUserTOTSVote = async (sessionId: string) => {
  if (USE_MOCK_DATA) {
    const vote = mockUserVotes[sessionId];

    if (!vote) {
      return {
        code: '99',
        message: 'Vote not found',
        data: null
      };
    }

    return {
      code: '00',
      message: 'Success',
      data: vote
    };
  }

  try {
    const response = await axiosInstance.get(
      `${API_URL}/football/tots/${sessionId}/vote/regular`,
      { withCredentials: true }
    );
    const { data }: { data: SuccessRequest } = response;

    if (data.code === '99') {
      throw data;
    }

    return data;
  } catch (error) {
    const err = error as CustomError;
    if (err.response) {
      return err.response.data;
    }
    return {
      code: '99',
      message: 'Something went wrong',
      data: null
    };
  }
};

export const submitUserTOTSVote = async (sessionId: string, playerIds: string[]) => {
  if (USE_MOCK_DATA) {
    // Update mock user vote
    mockUserVotes[sessionId] = {
      _id: `vote-${Date.now()}`,
      sessionId,
      userId: 'current-user',
      playerIds,
      createdAt: new Date()
    };

    return {
      code: '00',
      message: 'Vote submitted successfully',
      data: mockUserVotes[sessionId]
    };
  }

  try {
    const response = await axiosInstance.post(
      `${API_URL}/football/tots/${sessionId}/vote/regular`,
      { playerIds },
      { withCredentials: true }
    );
    const { data }: { data: SuccessRequest } = response;

    if (data.code === '99') {
      throw data;
    }

    return data;
  } catch (error) {
    const err = error as CustomError;
    if (err.response) {
      return err.response.data;
    }
    return {
      code: '99',
      message: 'Something went wrong',
      data: null
    };
  }
};

// Admin endpoints

export const createTOTSSession = async (token: string, sessionData: {
  name: string,
  description: string,
  startDate: string,
  endDate: string
}) => {
  if (USE_MOCK_DATA) {
    // Create a new mock session
    const newSession = {
      _id: `tots-${Date.now()}`,
      name: sessionData.name,
      description: sessionData.description,
      startDate: new Date(sessionData.startDate),
      endDate: new Date(sessionData.endDate),
      isActive: false,
      isFinalized: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock sessions
    mockTOTSSessions.push(newSession);

    return {
      code: '00',
      message: 'Session created successfully',
      data: newSession
    };
  }

  try {
    const response = await axiosInstance.post(
      `${API_URL}/football/tots`,
      sessionData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      }
    );
    const { data }: { data: SuccessRequest } = response;

    if (data.code === '99') {
      throw data;
    }

    return data;
  } catch (error) {
    const err = error as CustomError;
    if (err.response) {
      return err.response.data;
    }
    return {
      code: '99',
      message: 'Something went wrong',
      data: null
    };
  }
};

export const addPlayerToTOTSSession = async (token: string, sessionId: string, playerData: {
  playerId: string,
  position: string
}) => {
  if (USE_MOCK_DATA) {
    // Create a mock player
    const newPlayer = {
      _id: playerData.playerId,
      name: `Player ${playerData.playerId.slice(-2)}`,
      position: playerData.position,
      team: {
        _id: 'team-1',
        name: 'FC United',
        shorthand: 'FCU'
      },
      votes: 0
    };

    // Initialize players array if it doesn't exist
    if (!mockTOTSPlayers[sessionId]) {
      mockTOTSPlayers[sessionId] = [];
    }

    // Add player to session
    mockTOTSPlayers[sessionId].push(newPlayer);

    return {
      code: '00',
      message: 'Player added successfully',
      data: newPlayer
    };
  }

  try {
    const response = await axiosInstance.post(
      `${API_URL}/football/tots/${sessionId}/players`,
      playerData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      }
    );
    const { data }: { data: SuccessRequest } = response;

    if (data.code === '99') {
      throw data;
    }

    return data;
  } catch (error) {
    const err = error as CustomError;
    if (err.response) {
      return err.response.data;
    }
    return {
      code: '99',
      message: 'Something went wrong',
      data: null
    };
  }
};

export const removePlayerFromTOTSSession = async (token: string, sessionId: string, playerId: string) => {
  if (USE_MOCK_DATA) {
    // Check if session exists
    if (!mockTOTSPlayers[sessionId]) {
      return {
        code: '99',
        message: 'Session not found',
        data: null
      };
    }

    // Find player index
    const playerIndex = mockTOTSPlayers[sessionId].findIndex(p => p._id === playerId);

    if (playerIndex === -1) {
      return {
        code: '99',
        message: 'Player not found',
        data: null
      };
    }

    // Remove player
    mockTOTSPlayers[sessionId].splice(playerIndex, 1);

    return {
      code: '00',
      message: 'Player removed successfully',
      data: null
    };
  }

  try {
    const response = await axiosInstance.delete(
      `${API_URL}/football/tots/${sessionId}/players`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: { playerId },
        withCredentials: true
      }
    );
    const { data }: { data: SuccessRequest } = response;

    if (data.code === '99') {
      throw data;
    }

    return data;
  } catch (error) {
    const err = error as CustomError;
    if (err.response) {
      return err.response.data;
    }
    return {
      code: '99',
      message: 'Something went wrong',
      data: null
    };
  }
};

export const toggleTOTSSessionVoting = async (token: string, sessionId: string) => {
  if (USE_MOCK_DATA) {
    // Find session
    const sessionIndex = mockTOTSSessions.findIndex(s => s._id === sessionId);

    if (sessionIndex === -1) {
      return {
        code: '99',
        message: 'Session not found',
        data: null
      };
    }

    // Toggle active status
    mockTOTSSessions[sessionIndex].isActive = !mockTOTSSessions[sessionIndex].isActive;

    return {
      code: '00',
      message: `Voting ${mockTOTSSessions[sessionIndex].isActive ? 'enabled' : 'disabled'} successfully`,
      data: mockTOTSSessions[sessionIndex]
    };
  }

  try {
    const response = await axiosInstance.put(
      `${API_URL}/football/tots/${sessionId}/toggle`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      }
    );
    const { data }: { data: SuccessRequest } = response;

    if (data.code === '99') {
      throw data;
    }

    return data;
  } catch (error) {
    const err = error as CustomError;
    if (err.response) {
      return err.response.data;
    }
    return {
      code: '99',
      message: 'Something went wrong',
      data: null
    };
  }
};

export const submitAdminTOTSVote = async (token: string, sessionId: string, playerIds: string[]) => {
  if (USE_MOCK_DATA) {
    // Find session
    const sessionIndex = mockTOTSSessions.findIndex(s => s._id === sessionId);

    if (sessionIndex === -1) {
      return {
        code: '99',
        message: 'Session not found',
        data: null
      };
    }

    // Create admin vote (just a mock implementation)
    return {
      code: '00',
      message: 'Admin vote submitted successfully',
      data: {
        _id: `admin-vote-${Date.now()}`,
        sessionId,
        userId: 'admin-user',
        playerIds,
        createdAt: new Date()
      }
    };
  }

  try {
    const response = await axiosInstance.post(
      `${API_URL}/football/tots/${sessionId}/vote/admin`,
      { playerIds },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      }
    );
    const { data }: { data: SuccessRequest } = response;

    if (data.code === '99') {
      throw data;
    }

    return data;
  } catch (error) {
    const err = error as CustomError;
    if (err.response) {
      return err.response.data;
    }
    return {
      code: '99',
      message: 'Something went wrong',
      data: null
    };
  }
};

export const finalizeTOTSResults = async (token: string, sessionId: string) => {
  if (USE_MOCK_DATA) {
    // Find session
    const sessionIndex = mockTOTSSessions.findIndex(s => s._id === sessionId);

    if (sessionIndex === -1) {
      return {
        code: '99',
        message: 'Session not found',
        data: null
      };
    }

    // Update session status
    mockTOTSSessions[sessionIndex].isFinalized = true;
    mockTOTSSessions[sessionIndex].isActive = false;

    // Create results if they don't exist
    if (!mockTOTSResults[sessionId]) {
      mockTOTSResults[sessionId] = {
        _id: `result-${Date.now()}`,
        sessionId,
        players: mockTOTSPlayers[sessionId] || [],
        totalVotes: Math.floor(Math.random() * 100) + 50, // Random number of votes
        createdAt: new Date()
      };
    }

    return {
      code: '00',
      message: 'Results finalized successfully',
      data: mockTOTSResults[sessionId]
    };
  }

  try {
    const response = await axiosInstance.post(
      `${API_URL}/football/tots/${sessionId}/finalize`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      }
    );
    const { data }: { data: SuccessRequest } = response;

    if (data.code === '99') {
      throw data;
    }

    return data;
  } catch (error) {
    const err = error as CustomError;
    if (err.response) {
      return err.response.data;
    }
    return {
      code: '99',
      message: 'Something went wrong',
      data: null
    };
  }
};
