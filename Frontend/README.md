



API the backend must provide
| Method | Path | Body | Returns |

| GET | `/api/status` | – | status |
| POST | `/api/destination` | { roomId } (or `null` to clear) | status |
| POST | `/api/start` | – | status |
| POST | `/api/stop` | – | status |

status =
```json
{ "state": "idle|ready|driving|stopped|arrived|no_route",
  "position": {"x": 650, "y": 210},
  "destination": "lab2",
  "route": [{"x": 870, "y": 430}, {"x": 870, "y": 210}],
  "nextIndex": 1,
  "distanceTotal": 18, "distanceLeft": 12,
  "log": [{"t": "10:42:08", "m": "Start command sent"}] }
```
Map coordinates are 0–1000 (x) and 0–640 (y). Rooms are in `src/data/rooms.js`.
`nextIndex` = index of the next route point the robot is heading to.

## Files
- `src/api.js` – demo robot + real fetch calls (the only file that talks to the backend)
- `src/route.js` – A* used by the demo robot
- `src/data/rooms.js` – floor plan
- `src/components/` – MapView, StatusPanel, ActivityLog
