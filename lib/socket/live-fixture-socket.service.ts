import { io, Socket } from 'socket.io-client';

export enum LiveFixtureSocketEvent {
    // Client -> Server events
    JOIN_FIXTURE = 'live_fixture:join',
    LEAVE_FIXTURE = 'live_fixture:leave',
    JOIN_ALL_ACTIVE = 'live_fixture:join_all_active',
    LEAVE_ALL_ACTIVE = 'live_fixture:leave_all_active',
    
    // Server -> Client events
    FIXTURE_CREATED = 'live_fixture:created',
    FIXTURE_DELETED = 'live_fixture:deleted',
    STATUS_UPDATE = 'live_fixture:status_update',
    SCORE_UPDATE = 'live_fixture:score_update',
    TIMELINE_EVENT = 'live_fixture:timeline_event',
    TIMELINE_DELETED = 'live_fixture:timeline_deleted',
    SUBSTITUTION_ADDED = 'live_fixture:substitution_added',
    SUBSTITUTION_DELETED = 'live_fixture:substitution_deleted',
    GOAL_SCORER_ADDED = 'live_fixture:goal_scorer_added',
    GOAL_SCORER_DELETED = 'live_fixture:goal_scorer_deleted',
    COMMENTARY_ADDED = 'live_fixture:commentary_added',
    COMMENTARY_DELETED = 'live_fixture:commentary_deleted',
    STATISTICS_UPDATE = 'live_fixture:statistics_update',
    STREAM_LINK_ADDED = 'live_fixture:stream_link_added',
    LINEUP_UPDATE = 'live_fixture:lineup_update',
    POTM_UPDATE = 'live_fixture:potm_update',
    CHEER_UPDATE = 'live_fixture:cheer_update',
    FIXTURE_ENDED = 'live_fixture:ended',
    FULL_UPDATE = 'live_fixture:full_update',
    ERROR = 'live_fixture:error',
}

export interface LiveFixtureSocketPayload<T = any> {
    fixtureId: string;
    timestamp: Date;
    data: T;
}

export interface SocketError {
    message: string;
    code?: string;
}

type EventCallback<T = any> = (payload: LiveFixtureSocketPayload<T>) => void;

class LiveFixtureSocketService {
    private socket: Socket | null = null;
    private eventHandlers: Map<LiveFixtureSocketEvent, EventCallback[]> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private isConnecting = false;

    constructor() {
        if (typeof window !== 'undefined') {
            this.connect();
        }
    }

    private connect(): void {
        if (this.socket?.connected || this.isConnecting) return;
        
        this.isConnecting = true;
        const serverUrl =
            process.env.NODE_ENV === 'production'
                ? (process.env.NEXT_PUBLIC_PROD_SOCKET_URL || 'http://localhost:5000')
                : (process.env.NEXT_PUBLIC_DEV_SOCKET_URL || 'http://localhost:5000');

        this.socket = io(serverUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: this.maxReconnectAttempts,
            timeout: 20000,
        });

        this.setupConnectionHandlers();
        this.setupEventListeners();
    }

    private setupConnectionHandlers(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('[LiveFixtureSocket] Connected:', this.socket?.id);
            this.isConnecting = false;
            this.reconnectAttempts = 0;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('[LiveFixtureSocket] Disconnected:', reason);
            this.isConnecting = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('[LiveFixtureSocket] Connection error:', error.message);
            this.isConnecting = false;
            this.reconnectAttempts++;
            
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('[LiveFixtureSocket] Max reconnection attempts reached');
            }
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`[LiveFixtureSocket] Reconnected after ${attemptNumber} attempts`);
            this.reconnectAttempts = 0;
        });
    }

    private setupEventListeners(): void {
        if (!this.socket) return;

        // Listen to all live fixture events
        Object.values(LiveFixtureSocketEvent).forEach((event) => {
            this.socket!.on(event, (payload: LiveFixtureSocketPayload) => {
                this.handleEvent(event as LiveFixtureSocketEvent, payload);
            });
        });
    }

    private handleEvent(event: LiveFixtureSocketEvent, payload: LiveFixtureSocketPayload): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers && handlers.length > 0) {
            handlers.forEach(handler => {
                try {
                    handler(payload);
                } catch (error) {
                    console.error(`[LiveFixtureSocket] Error in event handler for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Join a specific fixture room
     */
    joinFixture(fixtureId: string): void {
        if (!this.socket?.connected) {
            console.warn('[LiveFixtureSocket] Not connected. Attempting to connect...');
            this.connect();
            // Retry after connection
            setTimeout(() => this.joinFixture(fixtureId), 1000);
            return;
        }

        this.socket.emit(LiveFixtureSocketEvent.JOIN_FIXTURE, { fixtureId });
        console.log(`[LiveFixtureSocket] Joined fixture: ${fixtureId}`);
    }

    /**
     * Leave a specific fixture room
     */
    leaveFixture(fixtureId: string): void {
        if (!this.socket?.connected) return;
        
        this.socket.emit(LiveFixtureSocketEvent.LEAVE_FIXTURE, { fixtureId });
        console.log(`[LiveFixtureSocket] Left fixture: ${fixtureId}`);
    }

    /**
     * Join all active fixtures room
     */
    joinAllActive(): void {
        if (!this.socket?.connected) {
            console.warn('[LiveFixtureSocket] Not connected. Attempting to connect...');
            this.connect();
            setTimeout(() => this.joinAllActive(), 1000);
            return;
        }

        this.socket.emit(LiveFixtureSocketEvent.JOIN_ALL_ACTIVE);
        console.log('[LiveFixtureSocket] Joined all active fixtures');
    }

    /**
     * Leave all active fixtures room
     */
    leaveAllActive(): void {
        if (!this.socket?.connected) return;
        
        this.socket.emit(LiveFixtureSocketEvent.LEAVE_ALL_ACTIVE);
        console.log('[LiveFixtureSocket] Left all active fixtures');
    }

    /**
     * Subscribe to an event
     */
    on<T = any>(event: LiveFixtureSocketEvent, handler: EventCallback<T>): () => void {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        
        this.eventHandlers.get(event)!.push(handler as EventCallback);

        // Return unsubscribe function
        return () => this.off(event, handler);
    }

    /**
     * Unsubscribe from an event
     */
    off(event: LiveFixtureSocketEvent, handler?: EventCallback): void {
        if (!handler) {
            this.eventHandlers.delete(event);
            return;
        }

        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    /**
     * Manually disconnect
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.eventHandlers.clear();
        this.isConnecting = false;
    }

    /**
     * Manually reconnect
     */
    reconnect(): void {
        this.disconnect();
        this.connect();
    }
}

// Singleton instance
let socketServiceInstance: LiveFixtureSocketService | null = null;

export const getLiveFixtureSocketService = (): LiveFixtureSocketService => {
    if (typeof window === 'undefined') {
        // Return a mock on server-side
        return {
            joinFixture: () => {},
            leaveFixture: () => {},
            joinAllActive: () => {},
            leaveAllActive: () => {},
            on: () => () => {},
            off: () => {},
            isConnected: () => false,
            disconnect: () => {},
            reconnect: () => {},
        } as any;
    }

    if (!socketServiceInstance) {
        socketServiceInstance = new LiveFixtureSocketService();
    }

    return socketServiceInstance;
};

export default getLiveFixtureSocketService;
