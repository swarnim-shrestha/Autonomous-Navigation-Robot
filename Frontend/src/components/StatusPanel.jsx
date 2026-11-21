import { ROOMS } from '../data/rooms';

const TEXT = {
  idle: ['Idle', 'Pick a destination on the map.'],
  ready: ['Ready', 'Route planned. Press Start.'],
  driving: ['Driving', 'Robot is moving along the route.'],
  stopped: ['Stopped', 'Robot stopped. Press Start to resume.'],
  arrived: ['Arrived', 'Robot reached the destination.'],
  no_route: ['No route', 'No path to that place. Pick another one.'],
};

// name of the closest room, so the position reads like "Near Lab 2"
const where = (p) => {
  if (!p) return '–';
  const near = ROOMS.map((r) => ({ r, d: Math.hypot(p.x - (r.x + r.w / 2), p.y - (r.y + r.h / 2)) })).sort((a, b) => a.d - b.d)[0];
  return `Near ${near.r.name}`;
};

export default function StatusPanel({ status, onStart, onStop }) {
  const st = status?.state || 'idle';
  const [title, sub] = TEXT[st];
  const dest = ROOMS.find((r) => r.id === status?.destination);
  const total = status?.distanceTotal || 0;
  const leftM = status?.distanceLeft || 0;
  const pct = total ? Math.round(((total - leftM) / total) * 100) : 0;
  const hasRoute = total > 0;

  return (
    <section className="panel" aria-live="polite">
      <h2>Robot status</h2>
      <div className={'state' + (st === 'arrived' ? ' ok' : '')}>{title}</div>
      <div className="sub">{sub}</div>
      <div className="bar"><b style={{ width: pct + '%' }} /></div>
      <dl>
        <dt>Position</dt><dd>{where(status?.position)}</dd>
        <dt>Destination</dt><dd>{dest?.name || '–'}</dd>
        <dt>Route length</dt><dd>{hasRoute ? `${total.toFixed(0)} m` : '–'}</dd>
        <dt>Distance left</dt><dd>{hasRoute ? `${leftM.toFixed(0)} m` : '–'}</dd>
      </dl>
      <div className="actions">
        <button className="primary" disabled={st !== 'ready' && st !== 'stopped'} onClick={onStart}>Start</button>
        <button disabled={st !== 'driving'} onClick={onStop}>Stop</button>
      </div>
    </section>
  );
}
