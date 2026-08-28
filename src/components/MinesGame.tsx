import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Flag } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';

interface MinesGameProps {
    onExit: () => void;
    isVertical?: boolean;
}

interface Cell {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborMines: number;
}

const GRID_SIZE = 10;
const MINE_COUNT = 10;

const MinesGame: React.FC<MinesGameProps> = ({ onExit, isVertical = false }) => {
    const { t } = useLanguage();
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [minesRemaining, setMinesRemaining] = useState(MINE_COUNT);
    const [isFlagMode, setIsFlagMode] = useState(false);

    const initGame = useCallback(() => {
        const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
            Array(GRID_SIZE).fill(null).map(() => ({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0,
            }))
        );


        let placedMines = 0;
        while (placedMines < MINE_COUNT) {
            const r = Math.floor(Math.random() * GRID_SIZE);
            const c = Math.floor(Math.random() * GRID_SIZE);
            if (!newGrid[r][c].isMine) {
                newGrid[r][c].isMine = true;
                placedMines++;
            }
        }


        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (!newGrid[r][c].isMine) {
                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            const nr = r + dr;
                            const nc = c + dc;
                            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && newGrid[nr][nc].isMine) {
                                count++;
                            }
                        }
                    }
                    newGrid[r][c].neighborMines = count;
                }
            }
        }

        setGrid(newGrid);
        setGameOver(false);
        setGameWon(false);
        setMinesRemaining(MINE_COUNT);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const revealCell = (r: number, c: number) => {
        if (gameOver || gameWon || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

        const newGrid = [...grid.map(row => [...row])];

        if (newGrid[r][c].isMine) {
            setGameOver(true);

            newGrid.forEach(row => row.forEach(cell => {
                if (cell.isMine) cell.isRevealed = true;
            }));
            setGrid(newGrid);
            return;
        }

        const revealRecursive = (row: number, col: number) => {
            if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;

            newGrid[row][col].isRevealed = true;

            if (newGrid[row][col].neighborMines === 0) {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        revealRecursive(row + dr, col + dc);
                    }
                }
            }
        };

        revealRecursive(r, c);
        setGrid(newGrid);


        const unrevealedNonMines = newGrid.flat().filter(cell => !cell.isMine && !cell.isRevealed);
        if (unrevealedNonMines.length === 0) {
            setGameWon(true);
        }
    };

    const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        if (gameOver || gameWon || grid[r][c].isRevealed) return;

        const newGrid = [...grid.map(row => [...row])];
        const currentFlagged = newGrid[r][c].isFlagged;
        newGrid[r][c].isFlagged = !currentFlagged;
        setGrid(newGrid);
        setMinesRemaining(prev => currentFlagged ? prev + 1 : prev - 1);
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onExit();
        }
    }, [onExit]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className={`relative w-full flex items-center justify-center bg-paper-sunk border border-rule-strong overflow-hidden font-mono ${isVertical ? 'h-[400px]' : 'h-[220px]'
            }`}>
            <div className="absolute top-2 left-6 right-6 flex justify-between items-center z-10">
                <div className="text-[10px] uppercase tracking-widest text-ink-muted">MINES_SCAN_PROTOCOL v2.1</div>
                <div className="text-sm font-bold text-accent flex items-center gap-2">
                    <span className="text-[10px] text-ink-muted uppercase">{t.games.minesLabel}</span>
                    {minesRemaining.toString().padStart(2, '0')}
                </div>
            </div>

            <div className={`grid grid-cols-10 gap-1 bg-paper-raised p-2 rounded-sm border border-rule-strong ${isVertical ? 'scale-150' : ''
                }`}>
                {grid.map((row, r) => (
                    row.map((cell, c) => (
                        <div
                            key={`${r}-${c}`}
                            onClick={(e) => {
                                // Mobile flag mode check
                                if (isFlagMode) {
                                    toggleFlag(e, r, c);
                                } else {
                                    revealCell(r, c);
                                }
                            }}
                            onContextMenu={(e) => toggleFlag(e, r, c)}
                            className={`w-4 h-4 flex items-center justify-center text-[8px] font-bold cursor-pointer transition-all duration-100 border ${cell.isRevealed
                                ? 'bg-paper-sunk border-rule text-ink-body'
                                : 'bg-paper-edge border-rule-strong hover:bg-paper-sunk'
                                }`}
                        >
                            {cell.isRevealed ? (
                                cell.isMine ? <Bomb size={8} className="text-accent" /> : (cell.neighborMines > 0 ? cell.neighborMines : '')
                            ) : (
                                cell.isFlagged ? <Flag size={8} className="text-accent" /> : ''
                            )}
                        </div>
                    ))
                ))}
            </div>

            <AnimatePresence>
                {(gameOver || gameWon) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-paper/95 flex flex-col items-center justify-center z-20"
                    >
                        <div className={`px-4 text-center font-headline text-xl font-bold mb-2 tracking-tight uppercase ${gameOver ? 'text-accent' : 'text-ink'}`}>
                            {gameOver ? t.games.minesLost : t.games.minesWon}
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={initGame}
                                className={`px-4 py-1.5 border text-xs transition-colors uppercase ${gameOver ? 'border-accent text-accent hover:bg-accent hover:text-paper-raised' : 'border-ink text-ink hover:bg-ink hover:text-paper-raised'
                                    }`}
                            >
                                {t.games.minesRestart}
                            </button>
                            <button
                                onClick={onExit}
                                className="px-4 py-1.5 border border-rule-strong text-ink-muted text-xs hover:bg-paper-edge transition-colors uppercase"
                            >
                                {t.games.minesAbort}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-2 left-6 right-6 text-[8px] text-ink-muted uppercase flex justify-between md:hidden">
                <button
                    onClick={() => setIsFlagMode(!isFlagMode)}
                    className={`px-2 py-1 border ${isFlagMode ? 'bg-accent border-accent text-paper-raised' : 'bg-paper-raised border-rule-strong text-ink-muted'}`}
                >
                    {isFlagMode ? `🚩 ${t.games.minesFlagMode}` : `⛏️ ${t.games.minesDigMode}`}
                </button>
            </div>
            <div className="absolute bottom-2 left-6 right-6 text-[8px] text-ink-muted uppercase justify-between hidden md:flex">
                <span>{t.games.minesReveal}</span>
                <span>{t.games.minesFlag}</span>
                <span>{t.games.minesExit}</span>
            </div>
        </div>
    );
};

export default MinesGame;
