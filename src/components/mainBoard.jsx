import React, {Component} from 'react'
import '../styles/styles.css';
import TileView from './tileView';
import Cell from './cell';
import {EndGame} from './endGame';

var rotateLeft = function (matrix) {
    var rows = matrix.length;
    var columns = matrix[0].length;
    var res = [];
    for (var row = 0; row < rows; ++row) {
        res.push([]);
        for (var column = 0; column < columns; ++column) {
            res[row][column] = matrix[column][columns - row - 1];
        }
    }
    return res;
};

var Tile = function (value, row, column) {
    this.value = value || 0;
    this.row = row || -1;
    this.column = column || -1;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.markForDeletion = false;
    this.mergedInto = null;
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
    return (this.fromRow() !== -1 && (this.fromRow() !== this.toRow() || this.fromColumn() !== this.toColumn())) ||
        this.mergedInto;
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


var Board = function () {
    this.tiles = [];
    this.cells = [];
    for (var i = 0; i < Board.size; ++i) {
        this.cells[i] = [this.addTile(), this.addTile(), this.addTile(), this.addTile()];
    }
    this.addRandomTile();
    this.setPositions();
    this.won = false;
};

Board.prototype.addTile = function () {
    var res = new Tile();
    Tile.apply(res, arguments);
    this.tiles.push(res);
    return res;
};

Board.size = 4;

Board.prototype.moveLeft = function () {
    var hasChanged = false;
    for (var row = 0; row < Board.size; ++row) {
        var currentRow = this.cells[row].filter(tile => tile.value !== 0);
        var resultRow = [];
        for (var target = 0; target < Board.size; ++target) {
            var targetTile = currentRow.length ? currentRow.shift() : this.addTile();
            if (currentRow.length > 0 && currentRow[0].value === targetTile.value) {
                var tile1 = targetTile;
                targetTile = this.addTile(targetTile.value);
                tile1.mergedInto = targetTile;
                var tile2 = currentRow.shift();
                tile2.mergedInto = targetTile;
                targetTile.value += tile2.value;
            }
            resultRow[target] = targetTile;
            this.won |= (targetTile.value === 2048);
            hasChanged |= (targetTile.value !== this.cells[row][target].value);
        }
        this.cells[row] = resultRow;
    }
    return hasChanged;
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

Board.fourProbability = 0.1;

Board.prototype.addRandomTile = function () {
    var emptyCells = [];
    for (var r = 0; r < Board.size; ++r) {
        for (var c = 0; c < Board.size; ++c) {
            if (this.cells[r][c].value === 0) {
                emptyCells.push({r: r, c: c});
            }
        }
    }
    var index = ~~(Math.random() * emptyCells.length);
    var cell = emptyCells[index];
    var newValue = Math.random() < Board.fourProbability ? 4 : 2;
    this.cells[cell.r][cell.c] = this.addTile(newValue);
};

Board.prototype.move = function (direction) {
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down
    this.clearOldTiles();
    for (var i = 0; i < direction; ++i) {
        this.cells = rotateLeft(this.cells);
    }
    var hasChanged = this.moveLeft();
    for (var j = direction; j < 4; ++j) {
        this.cells = rotateLeft(this.cells);
    }
    if (hasChanged) {
        this.addRandomTile();
    }
    this.setPositions();
    return this;
};

Board.prototype.clearOldTiles = function () {
    this.tiles = this.tiles.filter(tile => tile.markForDeletion === false);
    this.tiles.forEach(tile => {tile.markForDeletion = true;});
};

Board.prototype.hasWon = function () {
    return this.won;
};

Board.deltaX = [-1, 0, 1, 0];
Board.deltaY = [0, -1, 0, 1];

Board.prototype.hasLost = function () {
    var canMove = false;
    for (var row = 0; row < Board.size; ++row) {
        for (var column = 0; column < Board.size; ++column) {
            canMove |= (this.cells[row][column].value === 0);
            for (var dir = 0; dir < 4; ++dir) {
                var newRow = row + Board.deltaX[dir];
                var newColumn = column + Board.deltaY[dir];
                if (newRow < 0 || newRow >= Board.size || newColumn < 0 || newColumn >= Board.size) {
                    continue;
                }
                canMove |= (this.cells[row][column].value === this.cells[newRow][newColumn].value);
            }
        }
    }
    return !canMove;
};

export default class MainBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {board: new Board};
    }
    restartGame() {
        this.setState({board: new Board});
    }
    handleKeyDown(event) {
        if (this.state.board.hasWon()) {
            return;
        }
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            event.preventDefault();
            var direction = event.keyCode - 37;
            this.setState({board: this.state.board.move(direction)});
        }
    }
    handleTouchStart(event) {
        if (this.state.board.hasWon()) {
            return;
        }
        if (event.touches.length !== 1) {
            return;
        }
        this.startX = event.touches[0].screenX;
        this.startY = event.touches[0].screenY;
        event.preventDefault();
    }
    handleTouchEnd(event) {
        if (this.state.board.hasWon()) {
            return;
        }
        if (event.changedTouches.length !== 1) {
            return;
        }
        var deltaX = event.changedTouches[0].screenX - this.startX;
        var deltaY = event.changedTouches[0].screenY - this.startY;
        var direction = -1;
        if (Math.abs(deltaX) > 3 * Math.abs(deltaY) && Math.abs(deltaX) > 30) {
            direction = deltaX > 0 ? 2 : 0;
        } else if (Math.abs(deltaY) > 3 * Math.abs(deltaX) && Math.abs(deltaY) > 30) {
            direction = deltaY > 0 ? 3 : 1;
        }
        if (direction !== -1) {
            this.setState({board: this.state.board.move(direction)});
        }
    }
    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
    render() {
        var cells = this.state.board.cells.map((row, rowIndex) => {
            return (
                <div key={rowIndex}>
                    {row.map((_, columnIndex) => <Cell key={rowIndex * Board.size + columnIndex} />)}
                </div>
            );
        });
        var tiles = this.state.board.tiles
            .filter(tile => tile.value !== 0)
            .map(tile => <TileView tile={tile} key={tile.id} />);
        return (
            <div className='board' onTouchStart={this.handleTouchStart.bind(this)} onTouchEnd={this.handleTouchEnd.bind(this)} tabIndex="1">
                {cells}
                {tiles}
                <EndGame board={this.state.board} onRestart={this.restartGame.bind(this)} />
            </div>
        );
    }
}