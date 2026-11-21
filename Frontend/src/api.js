import { ROOMS, HOME, PX_TO_M } from './data/rooms';
import { findRoute, routeLength, pointAt } from './route';


const DEMO = import.meta.env.VITE_DEMO !== 'false';

/* ---------- real backend ---------- */
const call = async (path, method = 'GET', body) => {
  const r = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(r.status);
  return r.json();
};
const real = {
  getStatus: () => call('/status'),
  setDestination: (roomId) => call('/destination', 'POST', { roomId }),
  start: () => call('/start', 'POST'),
  stop: () => call('/stop', 'POST'),
};

/* ---------- demo robot (runs in the browser) ---------- */
const SPEED = 70; // units per second
let s = { state: 'idle', position: HOME, destination: null, route: [], total: 0, traveled: 0, nextIndex: 1, log: [] };
let t0 = 0, base = 0;
const log = (m) => { s.log = [{ t: new Date().toTimeString().slice(0, 8), m }, ...s.log].slice(0, 30); };

const snap = () => {
  if (s.state === 'driving') {
    s.traveled = Math.min(s.total, base + ((Date.now() - t0) / 1000) * SPEED);
    const { point, index } = pointAt(s.route, s.traveled);
    s.position = point;
    s.nextIndex = index;
    if (s.traveled >= s.total) { s.state = 'arrived'; log('Arrived'); }
  }
  return { ...s, distanceTotal: s.total * PX_TO_M, distanceLeft: (s.total - s.traveled) * PX_TO_M };
};

const demo = {
  getStatus: async () => snap(),
  setDestination: async (roomId) => {
    snap();
    if (s.state === 'driving') return snap();
    if (!roomId) { s = { ...s, state: 'idle', destination: null, route: [], total: 0, traveled: 0 }; return snap(); }
    const room = ROOMS.find((r) => r.id === roomId);
    const route = findRoute(s.position, room.door);
    s.destination = roomId;
    s.traveled = 0;
    s.nextIndex = 1;
    log(`Destination set to ${room.name}`);
    if (!route || route.length < 2) {
      s.route = []; s.total = 0; s.state = route ? 'arrived' : 'no_route';
      log(route ? 'Robot is already there' : 'No route found');
    } else {
      s.route = route; s.total = routeLength(route); s.state = 'ready';
      log(`Route planned: ${(s.total * PX_TO_M).toFixed(0)} m`);
    }
    return snap();
  },
  start: async () => {
    if (s.state === 'ready' || s.state === 'stopped') {
      base = s.traveled; t0 = Date.now(); s.state = 'driving'; log('Start command sent');
    }
    return snap();
  },
  stop: async () => {
    snap();
    if (s.state === 'driving') { s.state = 'stopped'; log('Stop command sent'); }
    return snap();
  },
};

const api = DEMO ? demo : real;
export const { getStatus, setDestination, start, stop } = api;
export const isDemo = DEMO;
