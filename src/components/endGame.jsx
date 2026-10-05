import React from 'react';

export const EndGame = ({ board, onRestart, onKeepGoing, score }) => {
    const won = board.hasWon() && !board.keepPlaying;
    const lost = board.hasLost();

    if (!won && !lost) {
        return null;
    }

    return (
        <div className={`overlay ${won ? 'overlay-won' : 'overlay-lost'}`}>
            <div className="overlay-content">
                <span className="overlay-badge">{won ? '🏆 VICTORY!' : '💀 GAME OVER'}</span>
                <h2 className="overlay-title">{won ? 'You Reached 2048!' : 'No More Moves!'}</h2>
                <p className="overlay-score">
                    Final Score: <strong>{score.toLocaleString()}</strong>
                </p>
                <div className="overlay-actions">
                    {won && (
                        <button className="game-btn btn-keep-going" onClick={onKeepGoing} onTouchEnd={onKeepGoing}>
                            Keep Going 🚀
                        </button>
                    )}
                    <button className="game-btn btn-restart" onClick={onRestart} onTouchEnd={onRestart}>
                        Play Again 🔄
                    </button>
                </div>
            </div>
        </div>
    );
};