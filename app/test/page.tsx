'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // or your live backend URL
const fixtureId = '12345';

let socket: ReturnType<typeof io> | null = null;

export default function TestFixturePage() {
  const [logs, setLogs] = useState<string[]>([]);

  const log = (msg: string) => {
    console.log('[Socket Test]', msg);
    setLogs((prev) => [...prev, msg]);
  };

  useEffect(() => {
    log('Connecting to socket...');
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      log('Socket connected: ' + socket?.id);
      socket?.emit('join-room', fixtureId);
      log(`Sent join-room for fixtureId: ${fixtureId}`);
    });

    socket.on('room-count-update', (data: {watchers: number}) => setLogs((prev) => [...prev, `watchers: ${data.watchers.toString()}`]))

    socket.on('connect_error', (err) => {
      log('Connection error: ' + err.message);
    });

    socket.on('fixture-update', (data: any) => {
      log('Received fixture-update: ' + JSON.stringify(data));
    });

    socket.on('disconnect', () => {
      log('Socket disconnected');
    });

    return () => {
      socket?.emit('leave-fixture', fixtureId);
      log('Left fixture room: ' + fixtureId);
      socket?.disconnect();
      log('Socket disconnected');
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Socket Fixture Test</h1>
      <p><strong>Fixture ID:</strong> {fixtureId}</p>
      <h3>Debug Log:</h3>
      <ul>
        {logs.map((msg, i) => (
          <li key={i} style={{ fontSize: '0.9em' }}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
