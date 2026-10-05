import React, { Component } from 'react';

export default class TileView extends Component {
    shouldComponentUpdate(nextProps) {
        if (this.props.tile !== nextProps.tile) {
            return true;
        }
        if (!nextProps.tile.hasMoved() && !nextProps.tile.isNew() && !nextProps.tile.isMerged) {
            return false;
        }
        return true;
    }

    render() {
        const tile = this.props.tile;
        const classArray = ['tile'];
        const val = tile.value;

        classArray.push('tile' + (val <= 2048 ? val : 'super'));
        if (val >= 100 && val < 1000) {
            classArray.push('tile-font-3');
        } else if (val >= 1000 && val < 10000) {
            classArray.push('tile-font-4');
        } else if (val >= 10000) {
            classArray.push('tile-font-5');
        }

        if (!tile.mergedInto) {
            classArray.push('position_' + tile.row + '_' + tile.column);
        }
        if (tile.mergedInto) {
            classArray.push('merged');
        }
        if (tile.isNew()) {
            classArray.push('new');
        }
        if (tile.isMerged) {
            classArray.push('tile-merged-pop');
        }
        if (tile.hasMoved()) {
            classArray.push('row_from_' + tile.fromRow() + '_to_' + tile.toRow());
            classArray.push('column_from_' + tile.fromColumn() + '_to_' + tile.toColumn());
            classArray.push('isMoving');
        }

        return (
            <span className={classArray.join(' ')}>
                <span className="tile-inner">{val}</span>
            </span>
        );
    }
}