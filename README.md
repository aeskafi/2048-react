# 2048 in React: Smooth Sliding Tile Puzzle

[![React](https://img.shields.io/badge/React-17+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![CSS3](https://img.shields.io/badge/CSS3-Animations-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

> A high-performance, responsive React implementation of the classic 2048 sliding puzzle game featuring hardware-accelerated CSS3 animations and mobile swipe gestures.

---

## ⚡ Architectural Highlights

- **Component-Driven State Engine**: The central `MainBoard` component orchestrates board state transitions, tile movements, and scoring using clean immutable state patterns with zero direct DOM mutations.
- **Optimized CSS3 Animation Matrix**:
  - Rather than generating 256 ($4^4$) complex diagonal/quadruple keyframe rules, tile translations are orthogonally decomposed into independent horizontal and vertical translations ($2 \times 4^2 = 32$ keyframes).
  - This design reduced stylesheet footprint from **~70 KB down to under 10 KB** while delivering 60 FPS hardware-accelerated transitions.
- **Dual Input Architecture**: Seamless control via desktop arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) alongside touch swipe detection (`TouchStart`, `TouchEnd`) for mobile gameplay.
- **Smart Re-render Optimization**: `shouldComponentUpdate` lifecycle hooks on `Cell` and `TileView` ensure that only active or transitioning tiles trigger render cycles.

---

## 🎮 How to Play

1. **Move Tiles**: Use the arrow keys on your keyboard (or swipe on touch screens) to slide all tiles across the 4x4 grid.
2. **Merge Numbers**: When two tiles with the same number collide, they merge into one with double the value ($2 + 2 = 4$, $4 + 4 = 8$, ..., $1024 + 1024 = 2048$).
3. **Win Condition**: Create a tile with the number **2048** to win the game!

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

## 🏗️ Production Build

To create an optimized production bundle:

```bash
npm run build
```

The compiled assets will be output to the `build/` directory, ready to deploy to Vercel, Netlify, or GitHub Pages.

---

## 📁 Project Structure

```
├── public/
│   ├── favicon.ico
│   └── index.html           # HTML entry shell (#boardDiv mount point)
├── src/
│   ├── components/
│   │   ├── cell.jsx         # Static background grid slot
│   │   ├── endGame.jsx      # Win / Game Over modal overlay
│   │   ├── mainBoard.jsx    # Matrix transformations, sliding algorithms, & event handlers
│   │   └── tileView.jsx     # Position styling & dynamic translation classes
│   ├── styles/
│   │   └── styles.css       # Orthogonal CSS3 keyframes and tile color palettes
│   └── index.js             # React DOM rendering root
├── package.json
└── LICENSE
```

---

## 👤 Author & Mission

Crafted and maintained with precision by **Arham Eskafi** ([arham.dev](https://arham.dev)) — Rapid MVP Specialist, Full-Stack Architect, and Tech Nomad.

Follow the overland journey of building software while living on the open road at [Walk Cook Live](https://youtube.com/@walkcooklive).

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
