# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Space13k is a browser-based space game built for the [js13kgames.com](https://js13kgames.com/) competition (13KB size limit). Pure vanilla JavaScript + HTML5 Canvas with no dependencies or build tools.

## Running the Game

Open `index.html` directly in a browser. No build step, no server required. There is no package.json, linter, test framework, or bundler.

The `.gitignore` excludes `out/` and `out.zip`, suggesting a manual zip-based packaging step for competition submission.

## Architecture

**Entry point:** `index.html` — contains the game loop, state management, input handling, collision detection, and scene transitions in an inline `<script>` IIFE. All other JS files are loaded via `<script>` tags (no modules).

**Entity system:** Each game object is a constructor function with prototype methods following a shared interface:
- `draw(ctx)` — Canvas 2D rendering
- `update()` — per-frame logic; returns a collision object `{type: string}` or null

All active objects live in a single `world` array that gets iterated each frame for update + draw.

**Game objects:**
- `ship.js` — player ship with thrust, rotation, fuel consumption, and gravity accumulation (`ship.gravi` array)
- `planet.js` — static gravitating bodies with sprite rendering (4 planet textures: p1-p4.png)
- `asteroid.js` — moving obstacles with velocity (sx, sy)
- `wormhole.js` — level exit portal
- `star.js` — background parallax starfield (z-depth scrolling)

**UI objects** (same draw/update interface): `menu.js`, `end.js`, `toolbar.js` (fuel HUD), `keylayout.js` (controls display), `progress.js` (level indicator)

**Level data:** `lvl.js` defines a `lvls` array. Each level specifies ship start position/fuel (`s`), planets (`ps`), asteroids (`ast`), and wormhole exit (`wh`).

**Physics:** Inverse-square gravity — each frame the ship accumulates forces from all gravitating bodies via `atan2` directional force application. Collision is distance-based (`r - g.r < 5.0`).

**Scene flow:** Menu (ESC to start) → Game levels 0-6 → End screen. Planet/asteroid/boundary collision restarts current level. Wormhole collision advances to next level. X key resets level.

## Key Constraints

- **13KB size limit** — code must stay minimal; avoid adding libraries or verbose patterns
- **ES5-style code** — uses constructor functions and prototypes, not classes or modules
- **Global scope** — objects are implicitly global; no module system
- **Controls:** W (thrust), A/D (rotate), X (reset level), ESC (start/menu)
