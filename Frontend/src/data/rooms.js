// Map is 1000 x 640 units. door = where the robot parks when it "arrives".
export const MAP = { w: 1000, h: 640 };
export const PX_TO_M = 0.03; // 1 unit = 3 cm

export const ROOMS = [
  { id: 'reception', name: 'Reception', x: 40, y: 40, w: 200, h: 140, door: { x: 150, y: 210 } },
  { id: 'lab1', name: 'Lab 1', x: 280, y: 40, w: 220, h: 140, door: { x: 390, y: 210 } },
  { id: 'lab2', name: 'Lab 2', x: 540, y: 40, w: 200, h: 140, door: { x: 650, y: 210 } },
  { id: 'store', name: 'Store', x: 780, y: 40, w: 180, h: 140, door: { x: 870, y: 210 } },
  { id: 'workshop', name: 'Workshop', x: 800, y: 260, w: 160, h: 160, door: { x: 790, y: 330 } },
  { id: 'cafeteria', name: 'Cafeteria', x: 40, y: 460, w: 260, h: 140, door: { x: 170, y: 430 } },
  { id: 'library', name: 'Library', x: 340, y: 460, w: 220, h: 140, door: { x: 450, y: 430 } },
  { id: 'office', name: 'Office', x: 600, y: 460, w: 160, h: 140, door: { x: 690, y: 430 } },
  { id: 'charging', name: 'Charging', x: 800, y: 460, w: 160, h: 140, door: { x: 870, y: 430 } },
];

export const COURTYARD = { id: 'courtyard', name: 'Courtyard', x: 200, y: 260, w: 560, h: 160 };
export const HOME = { x: 870, y: 430 }; 
