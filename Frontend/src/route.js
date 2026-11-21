import { ROOMS, COURTYARD } from './data/rooms';

// Small A* on a 20-unit grid. Only used in demo mode.
// In real mode the Express backend sends the route.
const C = 20, W = 50, H = 32;
const BLOCKS = [...ROOMS, COURTYARD];
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const blocked = (cx, cy) => {
  const x = cx * C + C / 2, y = cy * C + C / 2;
  return BLOCKS.some((r) => x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h);
};

export function findRoute(from, to) {
  const s = { cx: Math.floor(from.x / C), cy: Math.floor(from.y / C) };
  const g = { cx: Math.floor(to.x / C), cy: Math.floor(to.y / C) };
  if (blocked(g.cx, g.cy)) return null;
  const h = (cx, cy) => Math.abs(cx - g.cx) + Math.abs(cy - g.cy);
  const open = [{ ...s, d: 4, g: 0, f: h(s.cx, s.cy), p: null }];
  const best = new Map([[`${s.cx},${s.cy},4`, 0]]);
  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const n = open.shift();
    if (n.cx === g.cx && n.cy === g.cy) {
      const cells = [];
      for (let c = n; c; c = c.p) cells.unshift({ x: c.cx * C + C / 2, y: c.cy * C + C / 2 });
      return simplify([from, ...cells.slice(1, -1), to]);
    }
    DIRS.forEach(([dx, dy], d) => {
      const cx = n.cx + dx, cy = n.cy + dy;
      if (cx < 0 || cy < 0 || cx >= W || cy >= H || blocked(cx, cy)) return;
      const ng = n.g + 1 + (n.d !== 4 && n.d !== d ? 0.6 : 0); // small turn penalty
      const k = `${cx},${cy},${d}`;
      if (best.has(k) && best.get(k) <= ng) return;
      best.set(k, ng);
      open.push({ cx, cy, d, g: ng, f: ng + h(cx, cy), p: n });
    });
  }
  return null;
}

// remove points that sit on a straight line
function simplify(pts) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = out[out.length - 1], b = pts[i], c = pts[i + 1];
    if ((b.x - a.x) * (c.y - b.y) !== (b.y - a.y) * (c.x - b.x)) out.push(b);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

export const routeLength = (r) =>
  r.slice(1).reduce((s, p, i) => s + Math.hypot(p.x - r[i].x, p.y - r[i].y), 0);

// point after travelling distance d along the route, plus the index of the next vertex
export function pointAt(route, d) {
  let left = d;
  for (let i = 1; i < route.length; i++) {
    const seg = Math.hypot(route[i].x - route[i - 1].x, route[i].y - route[i - 1].y);
    if (left <= seg) {
      const t = seg ? left / seg : 0;
      return {
        point: { x: route[i - 1].x + (route[i].x - route[i - 1].x) * t, y: route[i - 1].y + (route[i].y - route[i - 1].y) * t },
        index: i,
      };
    }
    left -= seg;
  }
  return { point: route[route.length - 1], index: route.length };
}
