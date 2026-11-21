Backend API

The frontend talks to the backend through these endpoints:

- GET /api/status - returns the current robot status
- POST /api/destination - body is { "roomId": "lab2" }, or null to clear the destination. Returns the updated status
- POST /api/start - starts the robot, returns the updated status
- POST /api/stop - stops the robot, returns the updated status

/api/status looks like this:

```json
{
  "state": "idle",
  "position": { "x": 650, "y": 210 },
  "destination": "lab2",
  "route": [
    { "x": 870, "y": 430 },
    { "x": 870, "y": 210 }
  ],
  "nextIndex": 1,
  "distanceTotal": 18,
  "distanceLeft": 12,
  "log": [
    { "t": "10:42:08", "m": "Start command sent" }
  ]
}
```

state can be idle, ready, driving, stopped, arrived or no_route.

Map coordinates go from 0 to 1000 on x and 0 to 640 on y. nextIndex is the index of the route point the robot is currently heading to. Rooms and their map positions are in src/data/rooms.js.

Project structure

- src/api.js - talks to the backend, also has the demo robot logic
- src/route.js - A* pathfinding used by the demo robot
- src/data/rooms.js - floor plan and room info
- src/components/ - MapView.jsx, StatusPanel.jsx, ActivityLog.jsx
