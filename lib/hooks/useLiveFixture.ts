import { useEffect, useState, useCallback, useRef } from 'react';
import { LiveFixtureResponse } from '@/lib/types/v1.response.types';
import getLiveFixtureSocketService, { LiveFixtureSocketEvent } from '../socket/live-fixture-socket.service';
import { footballLiveApi } from '../api/v1/football-live.api';

interface UseLiveFixtureOptions {
    /** Whether to automatically fetch initial data */
    autoFetch?: boolean;
    /** Whether to automatically join socket room */
    autoJoin?: boolean;
    /** Called when fixture is loaded */
    onLoad?: (fixture: LiveFixtureResponse) => void;
    /** Called on any error */
    onError?: (error: Error) => void;
}

export function useLiveFixture(fixtureId: string, options: UseLiveFixtureOptions = {}) {
    const {
        autoFetch = true,
        autoJoin = true,
        onLoad,
        onError
    } = options;

    const [fixture, setFixture] = useState<LiveFixtureResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const socketService = useRef(getLiveFixtureSocketService());

    // Fetch initial fixture data
    const fetchFixture = useCallback(async () => {
        if (!fixtureId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await footballLiveApi.getById(fixtureId);
            setFixture(response.data);
            onLoad?.(response.data);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch fixture');
            setError(error);
            onError?.(error);
        } finally {
            setLoading(false);
        }
    }, [fixtureId, onLoad, onError]);

    useEffect(() => {
        if (!fixtureId || !autoFetch) return;
        fetchFixture();
    }, [fixtureId, autoFetch, fetchFixture]);

    // Setup socket listeners
    useEffect(() => {
        if (!fixtureId || !autoJoin) return;

        const socket = socketService.current;
        socket.joinFixture(fixtureId);

        // Full update (initial state)
        const unsubscribeFull = socket.on(LiveFixtureSocketEvent.FULL_UPDATE, (payload) => {
            if (payload.fixtureId === fixtureId) {
                setFixture(payload.data);
            }
        });

        // Score updates
        const unsubscribeScore = socket.on(LiveFixtureSocketEvent.SCORE_UPDATE, (payload) => {
            if (payload.fixtureId === fixtureId) {
                setFixture(prev => prev ? {
                    ...prev,
                    result: payload.data.result,
                    goalScorers: payload.data.goalScorers || prev.goalScorers
                } : null);
            }
        });

        // Status updates
        const unsubscribeStatus = socket.on(LiveFixtureSocketEvent.STATUS_UPDATE, (payload) => {
            if (payload.fixtureId === fixtureId) {
                setFixture(prev => prev ? {
                    ...prev,
                    status: payload.data.status,
                    currentMinute: payload.data.currentMinute,
                    injuryTime: payload.data.injuryTime
                } : null);
            }
        });

        // Timeline events
        const unsubscribeTimeline = socket.on(LiveFixtureSocketEvent.TIMELINE_EVENT, (payload) => {
            if (payload.fixtureId === fixtureId) {
                setFixture(prev => prev ? {
                    ...prev,
                    timeline: payload.data.timeline
                } : null);
            }
        });

        // Goal scorers
        const unsubscribeGoal = socket.on(LiveFixtureSocketEvent.GOAL_SCORER_ADDED, (payload) => {
            if (payload.fixtureId === fixtureId) {
                setFixture(prev => prev ? {
                    ...prev,
                    goalScorers: payload.data.goalScorers,
                    result: payload.data.result
                } : null);
            }
        });

        // Substitutions
        const unsubscribeSub = socket.on(LiveFixtureSocketEvent.SUBSTITUTION_ADDED, (payload) => {
            if (payload.fixtureId === fixtureId) {
                setFixture(prev => prev ? {
                    ...prev,
                    substitutions: payload.data.substitutions
                } : null);
            }
        });

        // Commentary
        const unsubscribeCommentary = socket.on(LiveFixtureSocketEvent.COMMENTARY_ADDED, (payload) => {
            if (payload.fixtureId === fixtureId) {
                setFixture(prev => prev ? {
                    ...prev,
                    commentary: payload.data.commentary
                } : null);
            }
        });

        // Statistics
        const unsubscribeStats = socket.on(LiveFixtureSocketEvent.STATISTICS_UPDATE, (payload) => {
            if (payload.fixtureId === fixtureId) {
                setFixture(prev => prev ? {
                    ...prev,
                    statistics: payload.data.statistics
                } : null);
            }
        });

        // Lineup updates
        const unsubscribeLineup = socket.on(LiveFixtureSocketEvent.LINEUP_UPDATE, (payload) => {
            if (payload.fixtureId === fixtureId) {
                setFixture(prev => prev ? {
                    ...prev,
                    lineups: payload.data.lineups
                } : null);
            }
        });

        // POTM updates
        const unsubscribePOTM = socket.on(LiveFixtureSocketEvent.POTM_UPDATE, (payload) => {
            if (payload.fixtureId === fixtureId) {
                setFixture(prev => prev ? {
                    ...prev,
                    playerOfTheMatch: payload.data.playerOfTheMatch
                } : null);
            }
        });

        // Cheer meter updates
        const unsubscribeCheer = socket.on(LiveFixtureSocketEvent.CHEER_UPDATE, (payload) => {
            if (payload.fixtureId === fixtureId) {
                setFixture(prev => prev ? {
                    ...prev,
                    cheerMeter: payload.data.cheerMeter
                } : null);
            }
        });

        // Fixture ended
        const unsubscribeEnded = socket.on(LiveFixtureSocketEvent.FIXTURE_ENDED, (payload) => {
            if (payload.fixtureId === fixtureId) {
                setFixture(payload.data);
            }
        });

        // Cleanup
        return () => {
            socket.leaveFixture(fixtureId);
            unsubscribeFull();
            unsubscribeScore();
            unsubscribeStatus();
            unsubscribeTimeline();
            unsubscribeGoal();
            unsubscribeSub();
            unsubscribeCommentary();
            unsubscribeStats();
            unsubscribeLineup();
            unsubscribePOTM();
            unsubscribeCheer();
            unsubscribeEnded();
        };
    }, [fixtureId, autoJoin]);

    return {
        fixture,
        loading,
        error,
        refetch: fetchFixture,
        isConnected: socketService.current.isConnected()
    };
}

// Hook for monitoring all active fixtures
export function useActiveLiveFixtures() {
    const [fixtures, setFixtures] = useState<LiveFixtureResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const socketService = useRef(getLiveFixtureSocketService());

    const fetchFixtures = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await footballLiveApi.getActive();
            setFixtures(response.data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch fixtures'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFixtures();
    }, [fetchFixtures]);

    useEffect(() => {
        const socket = socketService.current;
        socket.joinAllActive();

        // New fixture created
        const unsubscribeCreated = socket.on(LiveFixtureSocketEvent.FIXTURE_CREATED, (payload) => {
            setFixtures(prev => [...prev, payload.data]);
        });

        // Fixture deleted
        const unsubscribeDeleted = socket.on(LiveFixtureSocketEvent.FIXTURE_DELETED, (payload) => {
            setFixtures(prev => prev.filter(f => f.id !== payload.fixtureId));
        });

        // Score updates
        const unsubscribeScore = socket.on(LiveFixtureSocketEvent.SCORE_UPDATE, (payload) => {
            setFixtures(prev => prev.map(f =>
                f.id === payload.fixtureId
                    ? { ...f, result: payload.data.result }
                    : f
            ));
        });

        // Status updates
        const unsubscribeStatus = socket.on(LiveFixtureSocketEvent.STATUS_UPDATE, (payload) => {
            setFixtures(prev => prev.map(f =>
                f.id === payload.fixtureId
                    ? {
                        ...f,
                        status: payload.data.status,
                        currentMinute: payload.data.currentMinute
                    }
                    : f
            ));
        });

        // Fixture ended - remove from active list
        const unsubscribeEnded = socket.on(LiveFixtureSocketEvent.FIXTURE_ENDED, (payload) => {
            setFixtures(prev => prev.filter(f => f.id !== payload.fixtureId));
        });

        return () => {
            socket.leaveAllActive();
            unsubscribeCreated();
            unsubscribeDeleted();
            unsubscribeScore();
            unsubscribeStatus();
            unsubscribeEnded();
        };
    }, []);

    return {
        fixtures,
        loading,
        error,
        refetch: fetchFixtures,
        isConnected: socketService.current.isConnected()
    };
}

// Hook for specific event subscriptions
export function useLiveFixtureEvent<T = any>(
    fixtureId: string | null,
    event: LiveFixtureSocketEvent,
    callback: (data: T) => void
) {
    const socketService = useRef(getLiveFixtureSocketService());
    const callbackRef = useRef(callback);

    // Keep callback ref updated
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!fixtureId) return;

        const socket = socketService.current;

        const unsubscribe = socket.on(event, (payload) => {
            if (payload.fixtureId === fixtureId) {
                callbackRef.current(payload.data);
            }
        });

        return unsubscribe;
    }, [fixtureId, event]);
}