import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Flag } from 'lucide-react';

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
        <div className={`relative w-full flex items-center justify-center bg-black/40 rounded-lg border border-gray-800 overflow-hidden font-mono ${isVertical ? 'h-[400px]' : 'h-[220px]'
            }`}>
            <div className="absolute top-2 left-6 right-6 flex justify-between items-center z-10">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest text-[#00ff41]">MINES_SCAN_PROTOCOL v2.1</div>
                <div className="text-sm font-bold text-red-500 flex items-center gap-2">
                    <span className="text-[10px] text-gray-600 uppercase">Mines</span>
                    {minesRemaining.toString().padStart(2, '0')}
                </div>
            </div>

            <div className={`grid grid-cols-10 gap-1 bg-[#050505] p-2 rounded-md border border-gray-900 shadow-2xl ${isVertical ? 'scale-150' : ''
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
                            className={`w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-bold cursor-pointer transition-all duration-100 border ${cell.isRevealed
                                ? 'bg-black/40 border-gray-800 text-gray-400'
                                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                                }`}
                        >
                            {cell.isRevealed ? (
                                cell.isMine ? <Bomb size={8} className="text-red-500" /> : (cell.neighborMines > 0 ? cell.neighborMines : '')
                            ) : (
                                cell.isFlagged ? <Flag size={8} className="text-yellow-500" /> : ''
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
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                    >
                        <div className={`text-xl font-bold mb-2 tracking-tighter uppercase ${gameOver ? 'text-red-500' : 'text-[#00ff41]'}`}>
                            {gameOver ? 'Scan Failed: Mine Detonated' : 'Sector Secured: Scan Complete'}
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={initGame}
                                className={`px-4 py-1.5 bg-black/40 border text-xs transition-colors uppercase ${gameOver ? 'border-red-500/50 text-red-500 hover:bg-red-500/10' : 'border-[#00ff41]/50 text-[#00ff41] hover:bg-[#00ff41]/10'
                                    }`}
                            >
                                Restart Scan
                            </button>
                            <button
                                onClick={onExit}
                                className="px-4 py-1.5 bg-black/40 border border-gray-500/50 text-gray-400 text-xs hover:bg-gray-500/10 transition-colors uppercase"
                            >
                                Abort
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-2 left-6 right-6 text-[8px] text-gray-600 uppercase flex justify-between md:hidden">
                <button
                    onClick={() => setIsFlagMode(!isFlagMode)}
                    className={`px-2 py-1 rounded border ${isFlagMode ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-gray-800 border-gray-600 text-gray-400'}`}
                >
                    {isFlagMode ? '🚩 FLAG MODE' : '⛏️ DIG MODE'}
                </button>
            </div>
            <div className="absolute bottom-2 left-6 right-6 text-[8px] text-gray-600 uppercase justify-between hidden md:flex">
                <span>L-Click: Reveal</span>
                <span>R-Click: Flag</span>
                <span>'Esc' to Abort</span>
            </div>
        </div>
    );
};

export default MinesGame;
