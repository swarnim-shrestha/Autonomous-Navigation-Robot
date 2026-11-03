# Autonomous-Navigation-Robot


A small robot car that drives itself to a destination selected on a web page. The user picks a target cell on a grid map, the robot plans the shortest route with A* and drives there without remote control.

**Course:** COMP 206 (Year II / Semester I), Computer Engineering, Kathmandu University


## How it works

1. User selects a destination cell on the website.
2. The server on the compute board runs A* (4-direction, Manhattan heuristic) on a pre-made grid map and builds a command list. If no route exists, it reports an error.
3. Commands (e.g. `F120` = forward 120 cm, 90° turns, stop) are sent to the ESP32 over USB serial, one per line.
4. The ESP32 drives the motors and reads the sensors.
5. Position drift is corrected using wheel encoders, an MPU6050 gyroscope, and IR checkpoint markers.
6. A front ultrasonic sensor stops or reroutes the robot on obstacles.
7. On arrival, the website shows "Arrived".

## Architecture

| Layer | Component |
|---|---|
| Brain | Raspberry Pi / Orange Pi / Android phone (web server + A*) |
| Muscles | ESP32 + L298N motor driver |
| Position tracking | Wheel encoders, MPU6050, IR checkpoint markers |
| Obstacle safety | Front ultrasonic sensor |
| Interface | Web page (HTML/CSS/JS) |

## Tech stack

- ESP32 firmware: C++ (Arduino framework)
- Server: A* planner + web server on the compute board
- Web: HTML, CSS, JavaScript
- Communication: HTTP (browser to server), USB serial (server to ESP32)

## Roadmap

- [ ] V1:Basic manually controlled car (chassis, motors, driver)
- [ ] V2:A planner, web interface, sensors, self-driving logic
- [ ] V3: 3D-printed chassis, cleaned-up wiring

