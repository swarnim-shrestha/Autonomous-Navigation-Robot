import { useCallback, useEffect, useState } from 'react';
import * as api from './api';
import MapView from './components/MapView';
import StatusPanel from './components/StatusPanel';
import ActivityLog from './components/ActivityLog';

export default function App() {
  const [status, setStatus] = useState(null);
  const [online, setOnline] = useState(true);

  const run = useCallback(async (fn, ...args) => {
    try {
      setStatus(await fn(...args));
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, []);

  // poll the robot every 400 ms
  useEffect(() => {
    run(api.getStatus);
    const id = setInterval(() => run(api.getStatus), 400);
    return () => clearInterval(id);
  }, [run]);

  return (
    <>
      <header className="header">
        <h1>Hamro Robot</h1>
        <div className="conn">
          <span className={'dot' + (online ? '' : ' off')} />
          {online ? `Robot connected${api.isDemo ? ' (demo)' : ''}` : 'Robot offline'}
        </div>
      </header>
      <main className="main">
        <MapView status={status} onSelect={(id) => run(api.setDestination, id)} />
        <aside className="side">
          <StatusPanel status={status} onStart={() => run(api.start)} onStop={() => run(api.stop)} />
          <ActivityLog log={status?.log || []} />
        </aside>
      </main>
    </>
  );
}
