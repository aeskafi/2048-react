# 2048 in React: Modern Sliding Tile Puzzle & Audio Engine

[![React](https://img.shields.io/badge/React-17+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-Synthesizer-orange?style=flat-square&logo=soundcharts&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![CSS3](https://img.shields.io/badge/CSS3-Hardware%20Accelerated-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

> A polished, market-ready React implementation of the classic 2048 sliding tile puzzle featuring real-time score tracking, persistent high scores, multi-step undo history, Web Audio sound effects, and celebratory confetti effects.

---

## ✨ Features & Market-Ready Polish

- 🎵 **Native Web Audio API Sound Synthesizer**:
  - Zero external MP3/WAV file dependencies; 100% offline, zero latency, and crystal clear.
  - Directional sliding swoosh, dynamic harmonic merge chimes that scale in pitch as tile numbers rise, triumphant victory arpeggio, soft game-over melody, and crisp button clicks.
  - Sound toggle with persistent preference memory in `localStorage`.
- 🏆 **Comprehensive Score Management System**:
  - Live Score accumulation when tiles merge.
  - Floating animated points badge (`+4`, `+8`, `+16`...) that pops up above the score box on every combination.
  - All-time **Best Score** tracking persisted in browser `localStorage`.
  - Move Counter tracking efficiency.
- ↩️ **Full Multi-Step Undo Engine**:
  - Snapshot state history stack allowing players to revert their last moves anytime.
- 🎉 **Canvas Confetti Celebration**:
  - Dynamic 60 FPS HTML5 Canvas confetti particle explosion upon reaching the **2048** tile!
  - "Keep Going" mode allowing players to continue playing for 4096, 8192, and beyond.
- 📱 **Dual Input Controls (Keyboard, Swipe, & Virtual D-Pad)**:
  - Desktop keyboard support: Arrow keys and <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>.
  - Mobile touch swipe gesture detection.
  - On-screen virtual directional D-pad for touchscreens and accessibility.
- ⚡ **Optimized CSS3 Hardware Acceleration**:
  - Orthogonal movement matrix ($2 \times 4^2$ animations rather than $4^4$) keeping animation CSS under 3 KB.
  - Elastic pop on new tile spawn and 1.2x scale pulse on merged tiles.
  - Frosted glassmorphism modal overlays for Victory and Game Over states.
  - Responsive viewport scaling for seamless gameplay across mobile, tablet, and desktop screens.

---

## 🎮 How to Play

1. **Move Tiles**: Use Arrow keys, <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>, swipe on mobile, or click the on-screen D-pad.
2. **Merge Numbers**: When two identical tiles collide, they combine into one with their sum ($2 + 2 = 4$, $4 + 4 = 8$, ..., $1024 + 1024 = 2048$).
3. **Reach 2048**: Build the 2048 tile to win, or choose **Keep Going** to chase higher scores!

---

## 🚀 Quickstart Guide

### 1. Clone the Repository

```bash
git clone https://github.com/aeskafi/2048-react.git
cd 2048-react
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start playing immediately.

---

## 🏗️ Production Build & Deployment

```bash
npm run build
```

Production-ready static bundles will be compiled to `build/`, ready for zero-config deployment on Vercel, Netlify, or GitHub Pages.

---

## 📁 Project Architecture

```
├── public/
│   ├── favicon.ico
│   └── index.html           # HTML5 shell (#boardDiv root, viewport & metadata)
├── src/
│   ├── components/
│   │   ├── cell.jsx         # Background grid cell
│   │   ├── endGame.jsx      # Glassmorphic Victory / Game Over modal with stats & actions
│   │   ├── mainBoard.jsx    # Core game loop, matrix rotation, score management, & undo
│   │   └── tileView.jsx     # Dynamic positioning, merge pop, & font scaling
│   ├── styles/
│   │   └── styles.css       # Orthogonal animations, tile color palette, & responsive rules
│   ├── utils/
│   │   ├── confetti.js      # Pure HTML5 Canvas confetti explosion system
│   │   └── sound.js         # Web Audio API procedural sound synthesizer
│   └── index.js             # React DOM mounting entrypoint
├── package.json
└── LICENSE                  # MIT License
```

---

## 👤 Author & Mission

Crafted and curated with precision by **Arham Eskafi** ([arham.dev](https://arham.dev)) — Rapid MVP Specialist, Full-Stack Architect, and Tech Nomad.

Follow the overland journey of building software while living on the open road at [Walk Cook Live](https://youtube.com/@walkcooklive).

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
