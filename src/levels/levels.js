// Level definitions with normalized coordinates (0-1)
// Original design resolution: ~1024x768
// Coordinates normalized by dividing by 1024 (x) and 768 (y)

const W = 1024;
const H = 768;

const levelNames = [
  'Gentle Curve',
  'Two Bodies',
  'The Blockade',
  'The Right Choice',
  'The Corridor',
  'Asteroid Alley',
  'The Puzzle Box',
  'The Hunt',
  'Escort Run',
  'Crossfire',
  'The Swarm',
  'Gravity Shield',
  'Ambush',
  'The Gauntlet',
  'Open Waters',
  'Fortress',
  'Speed Demon',
  'The Maze',
  'Tight Quarters',
  'Predator',
  'The Arena',
  'Dark Passage',
  'Convergence',
  'No Mercy',
  'The Void',
  'Entropy',
  'Event Horizon',
  'Singularity',
];

function n(lvl, index) {
  return {
    name: levelNames[index],
    ship: {
      x: lvl.s.x / W,
      y: lvl.s.y / H,
      fuel: lvl.s.f,
    },
    planets: lvl.ps.map((p) => ({
      x: p.x / W,
      y: p.y / H,
      radius: p.r,
      mass: p.m,
      texture: 'p' + p.t,
    })),
    wormhole: {
      x: lvl.wh.x / W,
      y: lvl.wh.y / H,
      radius: lvl.wh.r,
      mass: lvl.wh.m,
    },
    asteroids: lvl.ast.map((a) => ({
      x: a.x / W,
      y: a.y / H,
      rotationSpeed: a.r,
      mass: a.m,
      scale: a.z,
      speedX: a.sx,
      speedY: a.sy,
    })),
    fuelPickups: (lvl.fp || []).map((fp) => ({
      x: fp.x / W,
      y: fp.y / H,
      amount: fp.amount,
    })),
    aliens: (lvl.al || []).map((a) => ({
      x: a.x / W,
      y: a.y / H,
      speed: a.speed,
    })),
    abilities: lvl.abilities || { gravityWell: 0 },
  };
}

// Level design principles:
// - Levels 0-1: Tutorial — learn gravity slingshot, no abilities
// - Level 2: Intro flip — obvious blocker planet, 1 flip
// - Level 3: Flip choice — 2 planets, 1 flip, only one correct
// - Level 4: Double flip — create a "corridor" of repulsion
// - Level 5: Flip + hazards — asteroids + strategic flipping
// - Level 6: Expert puzzle — 4 planets, 2 flips, tight fuel

const rawLevels = [
  // ── Level 0: "Gentle Curve" ──
  // One planet, generous fuel. Learn to slingshot.
  // Thrust toward the planet, let gravity curve you to the wormhole.
  {
    s: { x: 80, y: 120, f: 5 },
    ps: [{ x: 480, y: 350, r: 60, m: 2.5, t: 1 }],
    wh: { x: 850, y: 400, r: 35, m: 2 },
    ast: [
      { x: 300, y: 550, r: 0.02, m: 0.01, z: 1.2, sx: 0.05, sy: -0.02 },
      { x: 700, y: 180, r: 0.01, m: 0.01, z: 1, sx: -0.03, sy: 0.04 },
    ],
  },

  // ── Level 1: "Two Bodies" ──
  // Two planets in staggered positions. Navigate between their gravity wells.
  // Teaches: multiple gravitational fields interact.
  {
    s: { x: 60, y: 400, f: 5 },
    ps: [
      { x: 350, y: 200, r: 45, m: 2, t: 2 },
      { x: 600, y: 550, r: 55, m: 2.5, t: 3 },
    ],
    wh: { x: 900, y: 350, r: 35, m: 2 },
    ast: [
      { x: 450, y: 400, r: 0.02, m: 0.01, z: 1, sx: 0.03, sy: 0.03 },
      { x: 700, y: 150, r: 0.01, m: 0.01, z: 1.3, sx: -0.02, sy: 0.02 },
      { x: 200, y: 620, r: 0.02, m: 0.01, z: 1.5, sx: 0.04, sy: -0.01 },
    ],
  },

  // ── Level 2: "The Blockade" ──
  // A large planet blocks the direct path to the wormhole.
  // Without flip: gravity pulls you into it = death.
  // With flip: repulsion pushes you safely past. Aha!
  {
    s: { x: 70, y: 380, f: 5 },
    ps: [
      { x: 500, y: 380, r: 70, m: 3.5, t: 1 },
      { x: 280, y: 160, r: 25, m: 1.5, t: 4 },
    ],
    wh: { x: 880, y: 380, r: 30, m: 2 },
    ast: [
      { x: 650, y: 200, r: 0.02, m: 0.01, z: 1, sx: 0.02, sy: 0.03 },
      { x: 700, y: 580, r: 0.01, m: 0.01, z: 1.4, sx: -0.03, sy: -0.02 },
    ],
    abilities: { gravityWell: 1 },
  },

  // ── Level 3: "The Right Choice" ──
  // Two planets, only 1 flip. Ship bottom-left, wormhole top-right.
  // Planet A (center): flip this → repulsion boosts you upward toward goal. CORRECT.
  // Planet B (near goal): flip this → repulsion pushes you AWAY from wormhole. WRONG.
  // Teaches: think about WHERE the repulsion sends you.
  {
    s: { x: 100, y: 650, f: 5 },
    ps: [
      { x: 420, y: 420, r: 40, m: 2.5, t: 2 },
      { x: 780, y: 180, r: 50, m: 3, t: 3 },
    ],
    wh: { x: 920, y: 80, r: 30, m: 2 },
    ast: [
      { x: 250, y: 300, r: 0.02, m: 0.01, z: 1.2, sx: 0.04, sy: 0.02 },
      { x: 600, y: 600, r: 0.01, m: 0.01, z: 1, sx: -0.02, sy: -0.03 },
      { x: 700, y: 450, r: 0.02, m: 0.01, z: 1.5, sx: 0.01, sy: -0.02 },
    ],
    abilities: { gravityWell: 1 },
  },

  // ── Level 4: "The Corridor" ──
  // Three planets in a diagonal. Flip the outer two to create
  // repulsion "walls" — the middle planet's gravity guides you through.
  // 2 flips, 3 planets = must choose the right pair.
  {
    s: { x: 80, y: 100, f: 5 },
    ps: [
      { x: 300, y: 230, r: 35, m: 2, t: 1 },
      { x: 520, y: 400, r: 30, m: 2, t: 2 },
      { x: 740, y: 560, r: 35, m: 2, t: 4 },
    ],
    wh: { x: 920, y: 650, r: 30, m: 2 },
    ast: [
      { x: 400, y: 140, r: 0.02, m: 0.01, z: 1, sx: 0.03, sy: 0.02 },
      { x: 620, y: 280, r: 0.01, m: 0.01, z: 1.3, sx: -0.02, sy: 0.03 },
      { x: 850, y: 400, r: 0.02, m: 0.01, z: 1.5, sx: 0.01, sy: -0.01 },
      { x: 180, y: 500, r: 0.01, m: 0.01, z: 1.2, sx: 0.02, sy: -0.03 },
    ],
    abilities: { gravityWell: 2 },
  },

  // ── Level 5: "Asteroid Alley" ──
  // Ship starts right, wormhole on far left (reversed direction!).
  // Dense asteroid field in the center. Three planets around it.
  // Flip the right planets to create a safe "tunnel" through the field.
  // Fuel pickup rewards the optimal path.
  {
    s: { x: 950, y: 400, f: 4.5 },
    ps: [
      { x: 700, y: 250, r: 40, m: 2.5, t: 3 },
      { x: 450, y: 500, r: 35, m: 2, t: 1 },
      { x: 200, y: 280, r: 30, m: 2, t: 2 },
    ],
    wh: { x: 80, y: 400, r: 30, m: 2 },
    ast: [
      { x: 550, y: 200, r: 0.02, m: 0.01, z: 1, sx: -0.05, sy: 0.03 },
      { x: 500, y: 350, r: 0.01, m: 0.01, z: 1.4, sx: 0.03, sy: -0.04 },
      { x: 600, y: 480, r: 0.02, m: 0.01, z: 1.2, sx: -0.02, sy: 0.02 },
      { x: 380, y: 330, r: 0.01, m: 0.01, z: 1.6, sx: 0.04, sy: 0.01 },
      { x: 320, y: 600, r: 0.02, m: 0.01, z: 1, sx: -0.01, sy: -0.03 },
    ],
    fp: [{ x: 500, y: 150, amount: 1.5 }],
    abilities: { gravityWell: 2 },
  },

  // ── Level 6: "The Puzzle Box" ──
  // Four planets in a diamond around center. Ship at bottom, wormhole at top.
  // Only 2 flips for 4 planets — real decision-making.
  // Tight fuel (4) forces efficient planning. Two fuel pickups reward
  // the optimal path for 3-star rating.
  {
    s: { x: 512, y: 700, f: 4 },
    ps: [
      { x: 250, y: 400, r: 35, m: 2, t: 1 },
      { x: 512, y: 220, r: 45, m: 3, t: 2 },
      { x: 770, y: 400, r: 35, m: 2, t: 3 },
      { x: 512, y: 560, r: 30, m: 2, t: 4 },
    ],
    wh: { x: 512, y: 60, r: 30, m: 2 },
    ast: [
      { x: 350, y: 180, r: 0.02, m: 0.01, z: 1, sx: 0.03, sy: 0.02 },
      { x: 670, y: 180, r: 0.01, m: 0.01, z: 1.3, sx: -0.03, sy: 0.02 },
      { x: 350, y: 620, r: 0.02, m: 0.01, z: 1.5, sx: 0.02, sy: -0.03 },
      { x: 670, y: 620, r: 0.01, m: 0.01, z: 1.2, sx: -0.02, sy: -0.03 },
      { x: 140, y: 280, r: 0.01, m: 0.01, z: 1.4, sx: 0.01, sy: 0.01 },
      { x: 880, y: 280, r: 0.02, m: 0.01, z: 1, sx: -0.01, sy: 0.01 },
    ],
    fp: [
      { x: 160, y: 200, amount: 1 },
      { x: 860, y: 200, amount: 1 },
    ],
    abilities: { gravityWell: 2 },
  },

  // ── Level 7: "The Hunt" ──
  // First level with aliens! Ship bottom-left, wormhole top-right.
  // Aliens actively chase the ship — use gravity and thrust to outrun them.
  // Gravity wells can deflect or slow aliens via planet gravity.
  {
    s: { x: 100, y: 650, f: 5 },
    ps: [
      { x: 400, y: 350, r: 50, m: 2.5, t: 1 },
      { x: 700, y: 200, r: 40, m: 2, t: 3 },
      { x: 300, y: 550, r: 35, m: 1.8, t: 2 },
    ],
    wh: { x: 900, y: 100, r: 35, m: 2 },
    ast: [
      { x: 550, y: 500, r: 0.02, m: 0.01, z: 1.2, sx: 0.03, sy: -0.02 },
      { x: 800, y: 450, r: 0.01, m: 0.01, z: 1, sx: -0.02, sy: 0.03 },
    ],
    al: [
      { x: 500, y: 400, speed: 1.0 },
      { x: 850, y: 150, speed: 0.8 },
    ],
    abilities: { gravityWell: 1 },
  },

  // ── Level 8: "Escort Run" ──
  // Two aliens chase you through a planet field. Learn to outrun them.
  {
    s: { x: 120, y: 650, f: 5 },
    ps: [
      { x: 400, y: 400, r: 45, m: 2.5, t: 3 },
      { x: 700, y: 300, r: 40, m: 2, t: 1 },
    ],
    wh: { x: 900, y: 80, r: 35, m: 2 },
    ast: [
      { x: 300, y: 200, r: 0.02, m: 0.01, z: 1, sx: 0.03, sy: 0.02 },
      { x: 600, y: 550, r: 0.01, m: 0.01, z: 1.3, sx: -0.02, sy: -0.01 },
    ],
    al: [
      { x: 250, y: 500, speed: 0.9 },
      { x: 600, y: 200, speed: 0.85 },
    ],
    abilities: { gravityWell: 1 },
  },

  // ── Level 9: "Crossfire" ──
  // Aliens approach from multiple angles. Navigate the planet chain.
  {
    s: { x: 60, y: 384, f: 5 },
    ps: [
      { x: 350, y: 250, r: 40, m: 2, t: 2 },
      { x: 500, y: 500, r: 35, m: 2, t: 4 },
      { x: 700, y: 350, r: 45, m: 2.5, t: 1 },
    ],
    wh: { x: 950, y: 384, r: 30, m: 2 },
    ast: [
      { x: 450, y: 150, r: 0.01, m: 0.01, z: 1.2, sx: 0.02, sy: 0.03 },
      { x: 550, y: 650, r: 0.02, m: 0.01, z: 1, sx: -0.03, sy: -0.02 },
    ],
    al: [
      { x: 400, y: 100, speed: 0.9 },
      { x: 400, y: 650, speed: 0.9 },
      { x: 800, y: 384, speed: 0.85 },
    ],
    abilities: { gravityWell: 1 },
  },

  // ── Level 10: "The Swarm" ──
  // Four slow aliens. Momentum is survival.
  {
    s: { x: 512, y: 700, f: 5 },
    ps: [
      { x: 300, y: 400, r: 50, m: 2.5, t: 1 },
      { x: 720, y: 350, r: 45, m: 2, t: 3 },
    ],
    wh: { x: 512, y: 60, r: 35, m: 2 },
    ast: [
      { x: 500, y: 300, r: 0.02, m: 0.01, z: 1.4, sx: 0.01, sy: -0.02 },
    ],
    al: [
      { x: 200, y: 200, speed: 0.7 },
      { x: 800, y: 200, speed: 0.7 },
      { x: 200, y: 550, speed: 0.75 },
      { x: 800, y: 550, speed: 0.75 },
    ],
    abilities: { gravityWell: 1 },
  },

  // ── Level 11: "Gravity Shield" ──
  // Planets form a diagonal barrier. Aliens lurk on the other side.
  {
    s: { x: 80, y: 680, f: 4.5 },
    ps: [
      { x: 300, y: 550, r: 35, m: 2, t: 2 },
      { x: 500, y: 380, r: 40, m: 2.5, t: 4 },
      { x: 700, y: 210, r: 35, m: 2, t: 1 },
    ],
    wh: { x: 920, y: 80, r: 30, m: 2 },
    ast: [
      { x: 400, y: 200, r: 0.02, m: 0.01, z: 1, sx: -0.03, sy: 0.02 },
      { x: 600, y: 600, r: 0.01, m: 0.01, z: 1.3, sx: 0.02, sy: -0.03 },
      { x: 850, y: 350, r: 0.02, m: 0.01, z: 1.5, sx: -0.01, sy: 0.01 },
    ],
    al: [
      { x: 850, y: 150, speed: 0.95 },
      { x: 750, y: 300, speed: 0.9 },
    ],
    abilities: { gravityWell: 1 },
  },

  // ── Level 12: "Ambush" ──
  // The wormhole is guarded. Lure the aliens away or dash through.
  {
    s: { x: 80, y: 384, f: 5 },
    ps: [
      { x: 400, y: 250, r: 45, m: 2.5, t: 3 },
      { x: 400, y: 530, r: 40, m: 2, t: 2 },
    ],
    wh: { x: 920, y: 384, r: 30, m: 2 },
    ast: [
      { x: 250, y: 150, r: 0.01, m: 0.01, z: 1, sx: 0.02, sy: 0.03 },
      { x: 250, y: 620, r: 0.02, m: 0.01, z: 1.2, sx: 0.02, sy: -0.03 },
      { x: 650, y: 384, r: 0.01, m: 0.01, z: 1.5, sx: -0.01, sy: 0.02 },
    ],
    al: [
      { x: 800, y: 300, speed: 1.0 },
      { x: 800, y: 470, speed: 1.0 },
    ],
    abilities: { gravityWell: 1 },
  },

  // ── Level 13: "The Gauntlet" ──
  // Long horizontal run. Aliens scattered along the path.
  {
    s: { x: 60, y: 384, f: 5 },
    ps: [
      { x: 250, y: 300, r: 35, m: 2, t: 1 },
      { x: 500, y: 500, r: 40, m: 2.5, t: 4 },
      { x: 750, y: 280, r: 35, m: 2, t: 2 },
    ],
    wh: { x: 960, y: 384, r: 30, m: 2 },
    ast: [
      { x: 350, y: 500, r: 0.02, m: 0.01, z: 1.2, sx: 0.03, sy: -0.02 },
      { x: 600, y: 200, r: 0.01, m: 0.01, z: 1, sx: -0.02, sy: 0.03 },
      { x: 850, y: 550, r: 0.02, m: 0.01, z: 1.4, sx: 0.01, sy: -0.01 },
    ],
    al: [
      { x: 300, y: 450, speed: 0.9 },
      { x: 550, y: 300, speed: 0.95 },
      { x: 800, y: 450, speed: 1.0 },
    ],
    abilities: { gravityWell: 2 },
  },

  // ── Level 14: "Open Waters" ──
  // Almost no gravity help. Pure piloting against aliens.
  {
    s: { x: 512, y: 700, f: 5.5 },
    ps: [
      { x: 512, y: 384, r: 30, m: 1.5, t: 3 },
    ],
    wh: { x: 512, y: 60, r: 35, m: 2 },
    ast: [
      { x: 300, y: 300, r: 0.01, m: 0.01, z: 1.3, sx: 0.04, sy: 0.01 },
      { x: 700, y: 300, r: 0.02, m: 0.01, z: 1, sx: -0.04, sy: 0.01 },
    ],
    al: [
      { x: 200, y: 400, speed: 1.0 },
      { x: 820, y: 400, speed: 1.0 },
      { x: 512, y: 200, speed: 0.9 },
    ],
    abilities: { gravityWell: 1 },
  },

  // ── Level 15: "Fortress" ──
  // Planets form a defensive ring around the wormhole. Aliens inside.
  {
    s: { x: 512, y: 700, f: 5 },
    ps: [
      { x: 350, y: 350, r: 40, m: 2, t: 1 },
      { x: 670, y: 350, r: 40, m: 2, t: 2 },
      { x: 512, y: 550, r: 35, m: 2, t: 4 },
      { x: 512, y: 180, r: 45, m: 2.5, t: 3 },
    ],
    wh: { x: 512, y: 60, r: 30, m: 2 },
    ast: [
      { x: 400, y: 150, r: 0.02, m: 0.01, z: 1, sx: 0.02, sy: 0.01 },
      { x: 620, y: 150, r: 0.01, m: 0.01, z: 1.2, sx: -0.02, sy: 0.01 },
      { x: 300, y: 600, r: 0.02, m: 0.01, z: 1.5, sx: 0.03, sy: -0.02 },
    ],
    al: [
      { x: 512, y: 350, speed: 0.9 },
      { x: 420, y: 250, speed: 0.85 },
      { x: 600, y: 250, speed: 0.85 },
    ],
    abilities: { gravityWell: 2 },
  },

  // ── Level 16: "Speed Demon" ──
  // Two fast aliens. Quick slingshot is essential.
  {
    s: { x: 100, y: 100, f: 5 },
    ps: [
      { x: 350, y: 350, r: 50, m: 3, t: 1 },
      { x: 700, y: 500, r: 40, m: 2, t: 3 },
    ],
    wh: { x: 900, y: 680, r: 30, m: 2 },
    ast: [
      { x: 500, y: 200, r: 0.02, m: 0.01, z: 1, sx: -0.03, sy: 0.04 },
      { x: 550, y: 650, r: 0.01, m: 0.01, z: 1.3, sx: 0.02, sy: -0.02 },
    ],
    al: [
      { x: 200, y: 350, speed: 1.3 },
      { x: 600, y: 300, speed: 1.25 },
    ],
    abilities: { gravityWell: 1 },
  },

  // ── Level 17: "The Maze" ──
  // Dense planet field creates corridors. Aliens patrol between them.
  {
    s: { x: 60, y: 384, f: 5 },
    ps: [
      { x: 250, y: 200, r: 30, m: 2, t: 2 },
      { x: 250, y: 580, r: 30, m: 2, t: 4 },
      { x: 500, y: 384, r: 35, m: 2.5, t: 1 },
      { x: 750, y: 200, r: 30, m: 2, t: 3 },
      { x: 750, y: 580, r: 30, m: 2, t: 2 },
    ],
    wh: { x: 960, y: 384, r: 30, m: 2 },
    ast: [
      { x: 380, y: 300, r: 0.02, m: 0.01, z: 1, sx: 0.01, sy: 0.03 },
      { x: 620, y: 500, r: 0.01, m: 0.01, z: 1.2, sx: -0.01, sy: -0.03 },
    ],
    al: [
      { x: 380, y: 384, speed: 0.85 },
      { x: 620, y: 200, speed: 0.9 },
      { x: 620, y: 580, speed: 0.9 },
    ],
    abilities: { gravityWell: 2 },
  },

  // ── Level 18: "Tight Quarters" ──
  // Planets close together. Thread the needle while dodging aliens.
  {
    s: { x: 80, y: 680, f: 4 },
    ps: [
      { x: 300, y: 300, r: 55, m: 3, t: 1 },
      { x: 500, y: 500, r: 50, m: 2.5, t: 3 },
      { x: 700, y: 280, r: 45, m: 2, t: 2 },
      { x: 500, y: 150, r: 35, m: 2, t: 4 },
    ],
    wh: { x: 920, y: 80, r: 30, m: 2 },
    ast: [
      { x: 400, y: 650, r: 0.02, m: 0.01, z: 1.3, sx: 0.02, sy: -0.03 },
      { x: 800, y: 500, r: 0.01, m: 0.01, z: 1, sx: -0.02, sy: -0.01 },
    ],
    al: [
      { x: 600, y: 400, speed: 1.0 },
      { x: 400, y: 100, speed: 0.95 },
      { x: 850, y: 200, speed: 1.05 },
    ],
    fp: [{ x: 650, y: 600, amount: 1 }],
    abilities: { gravityWell: 1 },
  },

  // ── Level 19: "Predator" ──
  // Few planets, many aliens. Must be aggressive with thrust.
  {
    s: { x: 950, y: 400, f: 4.5 },
    ps: [
      { x: 500, y: 300, r: 45, m: 2.5, t: 4 },
      { x: 300, y: 550, r: 35, m: 2, t: 1 },
    ],
    wh: { x: 80, y: 384, r: 30, m: 2 },
    ast: [
      { x: 700, y: 200, r: 0.02, m: 0.01, z: 1.2, sx: -0.03, sy: 0.02 },
      { x: 700, y: 600, r: 0.01, m: 0.01, z: 1, sx: -0.02, sy: -0.03 },
      { x: 200, y: 200, r: 0.02, m: 0.01, z: 1.4, sx: 0.01, sy: 0.02 },
    ],
    al: [
      { x: 600, y: 500, speed: 1.0 },
      { x: 400, y: 200, speed: 1.0 },
      { x: 200, y: 400, speed: 1.05 },
      { x: 700, y: 350, speed: 0.95 },
    ],
    abilities: { gravityWell: 2 },
  },

  // ── Level 20: "The Arena" ──
  // Ring of planets. Aliens converge from all directions.
  {
    s: { x: 512, y: 700, f: 5 },
    ps: [
      { x: 250, y: 200, r: 40, m: 2, t: 1 },
      { x: 770, y: 200, r: 40, m: 2, t: 2 },
      { x: 250, y: 560, r: 40, m: 2, t: 3 },
      { x: 770, y: 560, r: 40, m: 2, t: 4 },
    ],
    wh: { x: 512, y: 60, r: 30, m: 2 },
    ast: [
      { x: 512, y: 384, r: 0.02, m: 0.01, z: 1.5, sx: 0.01, sy: -0.01 },
      { x: 400, y: 300, r: 0.01, m: 0.01, z: 1, sx: 0.03, sy: 0.02 },
      { x: 620, y: 460, r: 0.02, m: 0.01, z: 1.3, sx: -0.03, sy: -0.02 },
    ],
    al: [
      { x: 150, y: 384, speed: 1.0 },
      { x: 870, y: 384, speed: 1.0 },
      { x: 512, y: 300, speed: 0.95 },
      { x: 512, y: 500, speed: 0.95 },
    ],
    abilities: { gravityWell: 2 },
  },

  // ── Level 21: "Dark Passage" ──
  // Tight fuel. Must plan well placement carefully.
  {
    s: { x: 950, y: 100, f: 3.5 },
    ps: [
      { x: 700, y: 300, r: 45, m: 2.5, t: 2 },
      { x: 400, y: 500, r: 50, m: 3, t: 1 },
      { x: 200, y: 300, r: 35, m: 2, t: 3 },
    ],
    wh: { x: 80, y: 680, r: 30, m: 2 },
    ast: [
      { x: 550, y: 200, r: 0.02, m: 0.01, z: 1, sx: -0.02, sy: 0.03 },
      { x: 300, y: 650, r: 0.01, m: 0.01, z: 1.4, sx: 0.03, sy: -0.01 },
      { x: 800, y: 500, r: 0.02, m: 0.01, z: 1.2, sx: -0.01, sy: 0.02 },
    ],
    al: [
      { x: 550, y: 400, speed: 1.0 },
      { x: 250, y: 550, speed: 1.05 },
      { x: 100, y: 400, speed: 0.9 },
    ],
    fp: [{ x: 500, y: 350, amount: 1.5 }],
    abilities: { gravityWell: 1 },
  },

  // ── Level 22: "Convergence" ──
  // Aliens converge on the center chokepoint.
  {
    s: { x: 512, y: 700, f: 4.5 },
    ps: [
      { x: 300, y: 200, r: 35, m: 2, t: 4 },
      { x: 720, y: 200, r: 35, m: 2, t: 1 },
      { x: 300, y: 550, r: 40, m: 2.5, t: 2 },
      { x: 720, y: 550, r: 40, m: 2.5, t: 3 },
    ],
    wh: { x: 512, y: 60, r: 30, m: 2 },
    ast: [
      { x: 512, y: 200, r: 0.01, m: 0.01, z: 1.2, sx: 0.02, sy: 0.01 },
      { x: 400, y: 450, r: 0.02, m: 0.01, z: 1, sx: -0.01, sy: -0.02 },
      { x: 620, y: 450, r: 0.01, m: 0.01, z: 1.5, sx: 0.01, sy: -0.02 },
    ],
    al: [
      { x: 100, y: 384, speed: 1.0 },
      { x: 920, y: 384, speed: 1.0 },
      { x: 512, y: 150, speed: 1.05 },
      { x: 512, y: 384, speed: 0.85 },
    ],
    abilities: { gravityWell: 2 },
  },

  // ── Level 23: "No Mercy" ──
  // Many asteroids, many aliens, tight fuel.
  {
    s: { x: 60, y: 680, f: 4 },
    ps: [
      { x: 350, y: 400, r: 45, m: 2.5, t: 1 },
      { x: 650, y: 300, r: 40, m: 2, t: 3 },
      { x: 500, y: 600, r: 35, m: 2, t: 2 },
    ],
    wh: { x: 950, y: 80, r: 30, m: 2 },
    ast: [
      { x: 200, y: 200, r: 0.02, m: 0.01, z: 1, sx: 0.04, sy: 0.02 },
      { x: 500, y: 150, r: 0.01, m: 0.01, z: 1.3, sx: -0.02, sy: 0.03 },
      { x: 800, y: 400, r: 0.02, m: 0.01, z: 1.5, sx: -0.03, sy: -0.01 },
      { x: 300, y: 550, r: 0.01, m: 0.01, z: 1.2, sx: 0.02, sy: -0.04 },
      { x: 700, y: 600, r: 0.02, m: 0.01, z: 1, sx: -0.01, sy: 0.02 },
    ],
    al: [
      { x: 500, y: 300, speed: 1.05 },
      { x: 200, y: 400, speed: 1.0 },
      { x: 800, y: 200, speed: 1.1 },
      { x: 700, y: 500, speed: 0.95 },
    ],
    abilities: { gravityWell: 2 },
  },

  // ── Level 24: "The Void" ──
  // Almost no gravity assistance. Pure piloting against fast aliens.
  {
    s: { x: 80, y: 680, f: 5 },
    ps: [
      { x: 512, y: 384, r: 25, m: 1.5, t: 4 },
    ],
    wh: { x: 940, y: 80, r: 30, m: 2 },
    ast: [
      { x: 300, y: 300, r: 0.02, m: 0.01, z: 1, sx: 0.03, sy: -0.02 },
      { x: 700, y: 500, r: 0.01, m: 0.01, z: 1.4, sx: -0.02, sy: 0.03 },
    ],
    al: [
      { x: 300, y: 500, speed: 1.2 },
      { x: 700, y: 300, speed: 1.2 },
      { x: 500, y: 200, speed: 1.15 },
      { x: 500, y: 600, speed: 1.15 },
    ],
    abilities: { gravityWell: 2 },
  },

  // ── Level 25: "Entropy" ──
  // Everything moving, many asteroids, many aliens. Chaos.
  {
    s: { x: 80, y: 384, f: 4.5 },
    ps: [
      { x: 300, y: 250, r: 35, m: 2, t: 1 },
      { x: 550, y: 500, r: 40, m: 2.5, t: 2 },
      { x: 750, y: 200, r: 30, m: 1.8, t: 3 },
      { x: 700, y: 600, r: 35, m: 2, t: 4 },
    ],
    wh: { x: 950, y: 384, r: 30, m: 2 },
    ast: [
      { x: 200, y: 150, r: 0.03, m: 0.01, z: 1, sx: 0.05, sy: 0.03 },
      { x: 400, y: 600, r: 0.02, m: 0.01, z: 1.3, sx: -0.04, sy: -0.02 },
      { x: 600, y: 350, r: 0.01, m: 0.01, z: 1.5, sx: 0.03, sy: -0.04 },
      { x: 850, y: 150, r: 0.02, m: 0.01, z: 1.2, sx: -0.05, sy: 0.02 },
      { x: 450, y: 250, r: 0.03, m: 0.01, z: 1, sx: 0.02, sy: 0.05 },
      { x: 150, y: 550, r: 0.01, m: 0.01, z: 1.4, sx: 0.04, sy: -0.01 },
    ],
    al: [
      { x: 400, y: 350, speed: 1.0 },
      { x: 600, y: 200, speed: 1.05 },
      { x: 500, y: 550, speed: 1.1 },
      { x: 800, y: 400, speed: 0.95 },
    ],
    abilities: { gravityWell: 2 },
  },

  // ── Level 26: "Event Horizon" ──
  // Dense gravity, fast aliens, tight fuel. Near-impossible.
  {
    s: { x: 512, y: 720, f: 3.5 },
    ps: [
      { x: 250, y: 350, r: 50, m: 3, t: 1 },
      { x: 512, y: 200, r: 55, m: 3.5, t: 2 },
      { x: 770, y: 350, r: 50, m: 3, t: 3 },
      { x: 512, y: 520, r: 45, m: 2.5, t: 4 },
    ],
    wh: { x: 512, y: 50, r: 25, m: 2 },
    ast: [
      { x: 380, y: 100, r: 0.02, m: 0.01, z: 1, sx: 0.03, sy: 0.01 },
      { x: 640, y: 100, r: 0.01, m: 0.01, z: 1.3, sx: -0.03, sy: 0.01 },
      { x: 150, y: 550, r: 0.02, m: 0.01, z: 1.5, sx: 0.02, sy: -0.02 },
      { x: 870, y: 550, r: 0.01, m: 0.01, z: 1.2, sx: -0.02, sy: -0.02 },
    ],
    al: [
      { x: 380, y: 380, speed: 1.15 },
      { x: 640, y: 380, speed: 1.15 },
      { x: 512, y: 350, speed: 1.2 },
      { x: 300, y: 150, speed: 1.1 },
      { x: 720, y: 150, speed: 1.1 },
    ],
    fp: [
      { x: 150, y: 200, amount: 1 },
      { x: 870, y: 200, amount: 1 },
    ],
    abilities: { gravityWell: 2 },
  },

  // ── Level 27: "Singularity" ──
  // The final test. Dense planet field, 5 fast aliens, minimal fuel.
  {
    s: { x: 80, y: 700, f: 3 },
    ps: [
      { x: 250, y: 550, r: 40, m: 2.5, t: 1 },
      { x: 400, y: 350, r: 45, m: 3, t: 2 },
      { x: 600, y: 200, r: 40, m: 2.5, t: 3 },
      { x: 750, y: 400, r: 35, m: 2, t: 4 },
      { x: 500, y: 550, r: 30, m: 2, t: 1 },
    ],
    wh: { x: 940, y: 60, r: 25, m: 2 },
    ast: [
      { x: 150, y: 300, r: 0.02, m: 0.01, z: 1.2, sx: 0.03, sy: -0.02 },
      { x: 350, y: 150, r: 0.01, m: 0.01, z: 1, sx: -0.02, sy: 0.04 },
      { x: 700, y: 600, r: 0.02, m: 0.01, z: 1.5, sx: -0.01, sy: -0.03 },
      { x: 850, y: 250, r: 0.01, m: 0.01, z: 1.3, sx: 0.02, sy: 0.02 },
      { x: 500, y: 450, r: 0.02, m: 0.01, z: 1, sx: -0.03, sy: -0.01 },
    ],
    al: [
      { x: 300, y: 250, speed: 1.2 },
      { x: 550, y: 400, speed: 1.25 },
      { x: 700, y: 300, speed: 1.2 },
      { x: 450, y: 600, speed: 1.15 },
      { x: 850, y: 150, speed: 1.3 },
    ],
    fp: [{ x: 200, y: 450, amount: 1.5 }],
    abilities: { gravityWell: 3 },
  },
];

export const levels = rawLevels.map(n);
export const LEVEL_COUNT = levels.length;
