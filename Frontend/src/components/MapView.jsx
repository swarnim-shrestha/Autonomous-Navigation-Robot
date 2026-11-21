import { useState } from 'react';
import { MAP, ROOMS, COURTYARD } from '../data/rooms';

export default function MapView({ status, onSelect }) {
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);
  const [zoom, setZoom] = useState(1);

  const driving = status?.state === 'driving';
  const dest = ROOMS.find((r) => r.id === status?.destination);
  const pos = status?.position;
  const route = status?.route || [];
  const idx = status?.nextIndex ?? 1;

  const pts = (a) => a.map((p) => `${p.x},${p.y}`).join(' ');
  const done = pos && route.length ? [...route.slice(0, idx), pos] : [];
  const left = pos && route.length ? [pos, ...route.slice(idx)] : [];

  const matches = ROOMS.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  const pick = (id) => { if (!driving) { onSelect(id); setQ(''); setFocus(false); } };

  return (
    <section className="panel">
      <h2>Pick a destination</h2>
      <div className="map">
        <div className="map-inner" style={{ transform: `scale(${zoom})` }}>
          <svg viewBox={`0 0 ${MAP.w} ${MAP.h}`} role="img" aria-label="Floor plan">
            {ROOMS.map((r) => (
              <g key={r.id} className={'room' + (driving ? ' locked' : '')} onClick={() => pick(r.id)}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="6" fill={r.id === dest?.id ? '#DBEAFE' : '#E5E7EB'} />
                <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" dominantBaseline="middle">{r.name}</text>
              </g>
            ))}
            <rect x={COURTYARD.x} y={COURTYARD.y} width={COURTYARD.w} height={COURTYARD.h} rx="6" fill="#E3EEE3" />
            <text x={COURTYARD.x + COURTYARD.w / 2} y={COURTYARD.y + COURTYARD.h / 2} textAnchor="middle" dominantBaseline="middle" className="lbl">Courtyard</text>

            {done.length > 1 && <polyline points={pts(done)} className="route done" />}
            {left.length > 1 && <polyline points={pts(left)} className="route" />}

            {dest && (
              <g>
                <circle cx={dest.x + dest.w / 2} cy={dest.y + dest.h / 2 + 28} r="13" fill="#DC2626" stroke="#fff" strokeWidth="2" />
                <circle cx={dest.x + dest.w / 2} cy={dest.y + dest.h / 2 + 28} r="4" fill="#fff" />
              </g>
            )}
            {pos && (
              <g>
                <circle cx={pos.x} cy={pos.y} r="22" fill="#1D4ED8" opacity="0.2" />
                <circle cx={pos.x} cy={pos.y} r="10" fill="#1D4ED8" stroke="#fff" strokeWidth="3" />
              </g>
            )}
          </svg>
        </div>

        <div className="search">
          {dest ? (
            <div className="chip">
              <span>{dest.name}</span>
              <button aria-label="Clear destination" disabled={driving} onClick={() => pick(null)}>×</button>
            </div>
          ) : (
            <>
              <input
                value={q}
                placeholder="Search a place"
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setFocus(true)}
                onBlur={() => setTimeout(() => setFocus(false), 150)}
              />
              {focus && (
                <ul>
                  {matches.map((r) => (
                    <li key={r.id}><button onMouseDown={() => pick(r.id)}>{r.name}</button></li>
                  ))}
                  {!matches.length && <li className="none">No place found</li>}
                </ul>
              )}
            </>
          )}
        </div>

        <div className="zoom">
          <button aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(2, +(z + 0.25).toFixed(2)))}>+</button>
          <button aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}>−</button>
        </div>
      </div>
    </section>
  );
}
