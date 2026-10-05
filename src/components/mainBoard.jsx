import React, { Component } from 'react';
import '../styles/styles.css';
import TileView from './tileView';
import Cell from './cell';
import { EndGame } from './endGame';
import { sound } from '../utils/sound';
import { triggerConfetti } from '../utils/confetti';

const rotateLeft = function (matrix) {
    const rows = matrix.length;
    const columns = matrix[0].length;
    const res = [];
    for (let row = 0; row < rows; ++row) {
        res.push([]);
        for (let column = 0; column < columns; ++column) {
            res[row][column] = matrix[column][columns - row - 1];
        }
    }
    return res;
};

const Tile = function (value, row, column) {
    this.value = value || 0;
    this.row = row !== undefined ? row : -1;
    this.column = column !== undefined ? column : -1;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.markForDeletion = false;
    this.mergedInto = null;
    this.isMerged = false;
    this.id = Tile.id++;
};

Tile.id = 0;

Tile.prototype.moveTo = function (row, column) {
    this.oldRow = this.row;
    this.oldColumn = this.column;
    this.row = row;
    this.column = column;
};

Tile.prototype.isNew = function () {
    return this.oldRow === -1 && !this.mergedInto;
};

Tile.prototype.hasMoved = function () {
    return (
        (this.fromRow() !== -1 &&
            (this.fromRow() !== this.toRow() || this.fromColumn() !== this.toColumn())) ||
        this.mergedInto
    );
};

Tile.prototype.fromRow = function () {
    return this.mergedInto ? this.row : this.oldRow;
};

Tile.prototype.fromColumn = function () {
    return this.mergedInto ? this.column : this.oldColumn;
};

Tile.prototype.toRow = function () {
    return this.mergedInto ? this.mergedInto.row : this.row;
};

Tile.prototype.toColumn = function () {
    return this.mergedInto ? this.mergedInto.column : this.column;
};

const Board = function (empty = false) {
    this.tiles = [];
    this.cells = [];
    for (let i = 0; i < Board.size; ++i) {
        this.cells[i] = [this.addTile(), this.addTile(), this.addTile(), this.addTile()];
    }
    this.won = false;
    this.keepPlaying = false;
    if (!empty) {
        this.addRandomTile();
        this.addRandomTile();
        this.setPositions();
    }
};

Board.prototype.addTile = function () {
    const res = new Tile();
    Tile.apply(res, arguments);
    this.tiles.push(res);
    return res;
};

Board.size = 4;
Board.fourProbability = 0.1;

Board.prototype.addRandomTile = function () {
    const emptyCells = [];
    for (let r = 0; r < Board.size; ++r) {
        for (let c = 0; c < Board.size; ++c) {
            if (this.cells[r][c].value === 0) {
                emptyCells.push({ r, c });
            }
        }
    }
    if (emptyCells.length === 0) return;
    const index = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[index];
    const newValue = Math.random() < Board.fourProbability ? 4 : 2;
    this.cells[cell.r][cell.c] = this.addTile(newValue);
};

Board.prototype.moveLeft = function () {
    let hasChanged = false;
    let pointsAdded = 0;
    let maxMerged = 0;
    for (let row = 0; row < Board.size; ++row) {
        const currentRow = this.cells[row].filter((tile) => tile.value !== 0);
        const resultRow = [];
        for (let target = 0; target < Board.size; ++target) {
            let targetTile = currentRow.length ? currentRow.shift() : this.addTile();
            if (currentRow.length > 0 && currentRow[0].value === targetTile.value) {
                const tile1 = targetTile;
                targetTile = this.addTile(targetTile.value);
                tile1.mergedInto = targetTile;
                const tile2 = currentRow.shift();
                tile2.mergedInto = targetTile;
                targetTile.value += tile2.value;
                targetTile.isMerged = true;
                pointsAdded += targetTile.value;
                if (targetTile.value > maxMerged) {
                    maxMerged = targetTile.value;
                }
            }
            resultRow[target] = targetTile;
            this.won = this.won || targetTile.value === 2048;
            hasChanged = hasChanged || targetTile.value !== this.cells[row][target].value;
        }
        this.cells[row] = resultRow;
    }
    return { hasChanged, pointsAdded, maxMerged };
};

Board.prototype.setPositions = function () {
    this.cells.forEach((row, rowIndex) => {
        row.forEach((tile, columnIndex) => {
            tile.oldRow = tile.row;
            tile.oldColumn = tile.column;
            tile.row = rowIndex;
            tile.column = columnIndex;
            tile.markForDeletion = false;
        });
    });
};

Board.prototype.move = function (direction) {
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down
    this.clearOldTiles();
    for (let i = 0; i < direction; ++i) {
        this.cells = rotateLeft(this.cells);
    }
    const result = this.moveLeft();
    for (let j = direction; j < 4; ++j) {
        this.cells = rotateLeft(this.cells);
    }
    if (result.hasChanged) {
        this.addRandomTile();
    }
    this.setPositions();
    return result;
};

Board.prototype.clearOldTiles = function () {
    this.tiles = this.tiles.filter((tile) => tile.markForDeletion === false);
    this.tiles.forEach((tile) => {
        tile.markForDeletion = true;
        tile.isMerged = false;
    });
};

Board.prototype.hasWon = function () {
    return this.won;
};

Board.deltaX = [-1, 0, 1, 0];
Board.deltaY = [0, -1, 0, 1];

Board.prototype.hasLost = function () {
    for (let row = 0; row < Board.size; ++row) {
        for (let column = 0; column < Board.size; ++column) {
            if (this.cells[row][column].value === 0) {
                return false;
            }
            for (let dir = 0; dir < 4; ++dir) {
                const newRow = row + Board.deltaX[dir];
                const newColumn = column + Board.deltaY[dir];
                if (
                    newRow >= 0 &&
                    newRow < Board.size &&
                    newColumn >= 0 &&
                    newColumn < Board.size &&
                    this.cells[row][column].value === this.cells[newRow][newColumn].value
                ) {
                    return false;
                }
            }
        }
    }
    return true;
};

Board.fromGrid = function (grid) {
    const b = new Board(true);
    b.cells = [];
    b.tiles = [];
    for (let r = 0; r < Board.size; ++r) {
        b.cells[r] = [];
        for (let c = 0; c < Board.size; ++c) {
            const val = grid[r][c];
            const tile = b.addTile(val, r, c);
            b.cells[r][c] = tile;
        }
    }
    b.setPositions();
    return b;
};

export default class MainBoard extends Component {
    constructor(props) {
        super(props);
        let best = 0;
        try {
            best = parseInt(localStorage.getItem('2048_best_score') || '0', 10) || 0;
        } catch (e) {}

        this.state = {
            board: new Board(),
            score: 0,
            bestScore: best,
            moves: 0,
            scoreDelta: null,
            history: [],
            isMuted: sound.isMuted(),
            wonCelebrated: false,
            scale: 1,
            showHelp: false,
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleKeepGoing = this.handleKeepGoing.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.toggleSound = this.toggleSound.bind(this);
        this.toggleHelp = this.toggleHelp.bind(this);
        this.makeMove = this.makeMove.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    updateDimensions() {
        if (typeof window !== 'undefined') {
            const availableWidth = Math.min(window.innerWidth - 32, 480);
            const scale = Math.min(1, Math.max(0.64, availableWidth / 450));
            if (scale !== this.state.scale) {
                this.setState({ scale });
            }
        }
    }

    restartGame() {
        sound.playClick();
        this.setState({
            board: new Board(),
            score: 0,
            moves: 0,
            scoreDelta: null,
            history: [],
            wonCelebrated: false,
        });
    }

    handleKeepGoing() {
        sound.playClick();
        const { board } = this.state;
        board.keepPlaying = true;
        this.setState({ board });
    }

    handleUndo() {
        if (this.state.history.length === 0) return;
        sound.playClick();
        const history = [...this.state.history];
        const last = history.pop();
        const restoredBoard = Board.fromGrid(last.grid);
        this.setState({
            board: restoredBoard,
            score: last.score,
            moves: last.moves,
            history,
            scoreDelta: null,
        });
    }

    toggleSound() {
        const isMuted = sound.toggleMute();
        this.setState({ isMuted });
    }

    toggleHelp() {
        sound.playClick();
        this.setState((prev) => ({ showHelp: !prev.showHelp }));
    }

    makeMove(direction) {
        const { board, score, bestScore, moves, history, wonCelebrated } = this.state;
        if (board.hasWon() && !board.keepPlaying) {
            return;
        }
        if (board.hasLost()) {
            return;
        }

        // Snapshot current state for Undo
        const currentGrid = board.cells.map((row) => row.map((t) => t.value));
        const historyEntry = {
            grid: currentGrid,
            score,
            moves,
        };

        const result = board.move(direction);

        if (result.hasChanged) {
            const newScore = score + result.pointsAdded;
            const newBest = Math.max(newScore, bestScore);
            try {
                localStorage.setItem('2048_best_score', newBest.toString());
            } catch (e) {}

            if (result.pointsAdded > 0) {
                sound.playMerge(result.maxMerged);
            } else {
                sound.playMove();
            }

            let celebrated = wonCelebrated;
            if (board.hasWon() && !wonCelebrated) {
                celebrated = true;
                sound.playWin();
                triggerConfetti();
            } else if (board.hasLost()) {
                sound.playGameOver();
            }

            this.setState({
                board,
                score: newScore,
                bestScore: newBest,
                moves: moves + 1,
                scoreDelta: result.pointsAdded > 0 ? { points: result.pointsAdded, id: Date.now() } : null,
                history: [...history.slice(-15), historyEntry],
                wonCelebrated: celebrated,
            });
        }
    }

    handleKeyDown(event) {
        // Arrow keys: 37=Left, 38=Up, 39=Right, 40=Down
        // WASD keys: 65=A, 87=W, 68=D, 83=S
        let direction = -1;
        if (event.keyCode === 37 || event.keyCode === 65) direction = 0; // Left
        else if (event.keyCode === 38 || event.keyCode === 87) direction = 1; // Up
        else if (event.keyCode === 39 || event.keyCode === 68) direction = 2; // Right
        else if (event.keyCode === 40 || event.keyCode === 83) direction = 3; // Down

        if (direction !== -1) {
            event.preventDefault();
            this.makeMove(direction);
        }
    }

    handleTouchStart(event) {
        if (event.touches.length !== 1) return;
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
    }

    handleTouchMove(event) {
        if (event.touches.length === 1) {
            // Prevent rubber-banding / browser pull-to-refresh
            event.preventDefault();
        }
    }

    handleTouchEnd(event) {
        if (this.startX === undefined || this.startY === undefined || event.changedTouches.length !== 1) return;
        const deltaX = event.changedTouches[0].clientX - this.startX;
        const deltaY = event.changedTouches[0].clientY - this.startY;
        this.startX = undefined;
        this.startY = undefined;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (Math.max(absX, absY) > 25) {
            if (absX > absY) {
                this.makeMove(deltaX > 0 ? 2 : 0);
            } else {
                this.makeMove(deltaY > 0 ? 3 : 1);
            }
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        const { board, score, bestScore, moves, scoreDelta, history, isMuted, scale, showHelp } = this.state;

        const cells = board.cells.map((row, rowIndex) => (
            <div className="grid-row" key={rowIndex}>
                {row.map((_, columnIndex) => (
                    <Cell key={rowIndex * Board.size + columnIndex} />
                ))}
            </div>
        ));

        const tiles = board.tiles
            .filter((tile) => tile.value !== 0)
            .map((tile) => <TileView tile={tile} key={tile.id} />);

        return (
            <div className="game-wrapper">
                {/* Header section with branding & stats */}
                <header className="game-header">
                    <div className="brand-group">
                        <h1 className="game-title">2048</h1>
                        <p className="game-subtitle">
                            Join numbers to reach <strong>2048</strong>!
                        </p>
                    </div>

                    <div className="scores-group">
                        <div className="score-box">
                            <span className="score-label">SCORE</span>
                            <span className="score-value">{score.toLocaleString()}</span>
                            {scoreDelta && (
                                <span key={scoreDelta.id} className="score-delta">
                                    +{scoreDelta.points}
                                </span>
                            )}
                        </div>

                        <div className="score-box best-box">
                            <span className="score-label">BEST</span>
                            <span className="score-value">{bestScore.toLocaleString()}</span>
                        </div>

                        <div className="score-box moves-box">
                            <span className="score-label">MOVES</span>
                            <span className="score-value">{moves}</span>
                        </div>
                    </div>
                </header>

                {/* Control Action Toolbar */}
                <div className="game-toolbar">
                    <button
                        className="toolbar-btn btn-primary"
                        onClick={this.restartGame}
                        title="Start a new game"
                    >
                        <span>🔄 New Game</span>
                    </button>

                    <button
                        className={`toolbar-btn ${history.length === 0 ? 'btn-disabled' : ''}`}
                        onClick={this.handleUndo}
                        disabled={history.length === 0}
                        title="Undo last move"
                    >
                        <span>↩️ Undo</span>
                    </button>

                    <button
                        className={`toolbar-btn sound-toggle ${isMuted ? 'muted' : ''}`}
                        onClick={this.toggleSound}
                        title={isMuted ? 'Unmute audio' : 'Mute audio'}
                    >
                        <span>{isMuted ? '🔇 Muted' : '🔊 Sound'}</span>
                    </button>

                    <button
                        className="toolbar-btn help-btn"
                        onClick={this.toggleHelp}
                        title="How to play"
                    >
                        <span>❓ Rules</span>
                    </button>
                </div>

                {/* Optional Help Drawer */}
                {showHelp && (
                    <div className="help-box">
                        <p>
                            🎯 <strong>Rules:</strong> Use arrow keys or swipe to slide tiles. When two tiles with the same number touch, they merge into one! Reach the <strong>2048</strong> tile to win.
                        </p>
                    </div>
                )}

                {/* Main 4x4 Grid Board with dynamic fluid scaling */}
                <main
                    className="board-container"
                    style={{
                        width: 450 * scale,
                        height: 450 * scale,
                    }}
                    onTouchStart={this.handleTouchStart}
                    onTouchMove={this.handleTouchMove}
                    onTouchEnd={this.handleTouchEnd}
                    tabIndex="0"
                >
                    <div
                        className="board"
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                        }}
                    >
                        <div className="grid-container">{cells}</div>
                        <div className="tile-container">{tiles}</div>
                        <EndGame
                            board={board}
                            score={score}
                            onRestart={this.restartGame}
                            onKeepGoing={this.handleKeepGoing}
                        />
                    </div>
                </main>

                {/* Virtual On-Screen Mobile / Desktop Directional Controls */}
                <div className="virtual-dpad">
                    <div className="dpad-row">
                        <button
                            className="dpad-btn up"
                            onClick={() => this.makeMove(1)}
                            aria-label="Move Up"
                        >
                            ▲
                        </button>
                    </div>
                    <div className="dpad-row">
                        <button
                            className="dpad-btn left"
                            onClick={() => this.makeMove(0)}
                            aria-label="Move Left"
                        >
                            ◀
                        </button>
                        <button
                            className="dpad-btn down"
                            onClick={() => this.makeMove(3)}
                            aria-label="Move Down"
                        >
                            ▼
                        </button>
                        <button
                            className="dpad-btn right"
                            onClick={() => this.makeMove(2)}
                            aria-label="Move Right"
                        >
                            ▶
                        </button>
                    </div>
                </div>

                {/* Footer instructions */}
                <footer className="game-footer">
                    <p>
                        💡 <strong>Keyboard:</strong> Arrow keys or <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd>{' '}
                        <kbd>D</kbd> • <strong>Mobile:</strong> Swipe anywhere on the board
                    </p>
                </footer>
            </div>
        );
    }
}