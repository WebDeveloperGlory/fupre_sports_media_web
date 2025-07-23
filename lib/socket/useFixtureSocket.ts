import { LiveStatus } from '@/utils/V2Utils/v2requestData.enums';
import { FixtureCheerMeter, FixturePlayerOfTheMatch, FixtureResult, FixtureStat, FixtureSubstitutions, FixtureTimeline } from '@/utils/V2Utils/v2requestSubData.types';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface FixtureSocketState {
  isConnected: boolean;
  minute: { minute: number; injuryTime?: number } | null;
  score: FixtureResult | null;
  timeline: FixtureTimeline | null;
  statistics: { home: FixtureStat; away: FixtureStat } | null;
  status: LiveStatus | null;
  generalInfo: Partial<{
    kickoffTime: string;
    referee: string;
    attendance: number;
    weather: { condition: string; temperature: number; humidity: number };
  }> | null;
  cheerMeter: FixtureCheerMeter | null;
  playerOfTheMatch: FixturePlayerOfTheMatch | null;
  liveWatchers: number | null;
  substitution: FixtureSubstitutions | null;
  goalScorers: { player: string; team: string; time: number }[] | null;
}

const PART_API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_PROD_API_URL 
  : process.env.NEXT_PUBLIC_DEV_PARTIAL_API_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_DEV_MODE === 'partial' ? 
  PART_API_URL 
  : `${PART_API_URL}`;

const useFixtureSocket = (fixtureId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<FixtureSocketState>({
    isConnected: false,
    minute: null,
    score: null,
    timeline: null,
    statistics: null,
    status: null,
    generalInfo: null,
    cheerMeter: null,
    playerOfTheMatch: null,
    liveWatchers: null,
    substitution: null,
    goalScorers: null,
  });

  useEffect(() => {
    console.log('Connecting to socket...');
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected: ' + socket?.id)
      setState((prev) => ({ ...prev, isConnected: true }));
      newSocket.emit('join-room', fixtureId);
      console.log(`Sent join-room for fixtureId: ${fixtureId}`)
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setState((prev) => ({ ...prev, isConnected: false }));
    });

    newSocket.on('disconnect', () => {
      setState((prev) => ({ ...prev, isConnected: false }));
    });

    newSocket.on('room-count-update', (data: {watchers: number}) => {
      setState((prev) => ({ ...prev, liveWatchers: data.watchers}))
    })

    newSocket.on('score-update', (result: FixtureResult) => {
      setState((prev) => ({ ...prev, score: result }));
    });

    newSocket.on('minute-update', (data: { minute: number; injuryTime?: number }) => {
      setState((prev) => ({ ...prev, minute: data }));
    });

    newSocket.on('timeline-update', (timeline: FixtureTimeline) => {
      setState((prev) => ({ ...prev, timeline }));
    });

    newSocket.on('statistics-update', (statistics: { home: FixtureStat; away: FixtureStat }) => {
      setState((prev) => ({ ...prev, statistics }));
    });

    newSocket.on('status-update', (status: LiveStatus) => {
      setState((prev) => ({ ...prev, status }));
    });

    newSocket.on('general-update', (info: Partial<{
      kickoffTime: string;
      referee: string;
      attendance: number;
      weather: { condition: string; temperature: number; humidity: number };
    }>) => {
      setState((prev) => ({ ...prev, generalInfo: info }));
    });

    newSocket.on('cheer-update', (cheerMeter: FixtureCheerMeter) => {
      setState((prev) => ({ ...prev, cheerMeter }));
    });

    newSocket.on('potm-update', (playerOfTheMatch: FixturePlayerOfTheMatch) => {
      setState((prev) => ({ ...prev, playerOfTheMatch }));
    });

    newSocket.on('substitution-update', (substitution: FixtureSubstitutions) => {
      setState((prev) => ({ ...prev, substitution }));
    });

    newSocket.on('goalscorer-update', (goalScorers: { player: string; team: string; time: number }[]) => {
      setState((prev) => ({ ...prev, goalScorers }));
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [fixtureId]);

  return state;
};

export default useFixtureSocket;