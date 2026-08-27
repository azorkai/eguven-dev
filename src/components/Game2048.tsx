import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Game2048Props {
    onExit: () => void;
    isVertical?: boolean;
}

type Grid = number[][];

const GRID_SIZE = 4;

const Game2048: React.FC<Game2048Props> = ({ onExit, isVertical = false }) => {
    const [grid, setGrid] = useState<Grid>(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const initGame = useCallback(() => {
        let newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
        newGrid = addRandomTile(newGrid);
        newGrid = addRandomTile(newGrid);
        setGrid(newGrid);
        setScore(0);
        setGameOver(false);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const addRandomTile = (currentGrid: Grid): Grid => {
        const emptyCells = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
            }
        }
        if (emptyCells.length === 0) return currentGrid;
        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const newGrid = currentGrid.map(row => [...row]);
        newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
        return newGrid;
    };

    const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameOver) return;

        let newGrid = grid.map(row => [...row]);
        let moved = false;
        let newScore = score;

        const rotateGrid = (g: Grid) => {
            const rotated = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    rotated[c][GRID_SIZE - 1 - r] = g[r][c];
                }
            }
            return rotated;
        };

        const slide = (row: number[]) => {
            let arr = row.filter(val => val !== 0);
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] === arr[i + 1]) {
                    arr[i] *= 2;
                    newScore += arr[i];
                    arr.splice(i + 1, 1);
                    moved = true;
                }
            }
            while (arr.length < GRID_SIZE) arr.push(0);
            return arr;
        };


        let rotations = 0;
        if (direction === 'up') rotations = 3;
        else if (direction === 'right') rotations = 2;
        else if (direction === 'down') rotations = 1;

        for (let i = 0; i < rotations; i++) newGrid = rotateGrid(newGrid);

        for (let r = 0; r < GRID_SIZE; r++) {
            const oldRow = [...newGrid[r]];
            newGrid[r] = slide(newGrid[r]);
            if (JSON.stringify(oldRow) !== JSON.stringify(newGrid[r])) moved = true;
        }

        for (let i = 0; i < (4 - rotations) % 4; i++) newGrid = rotateGrid(newGrid);

        if (moved) {
            const gridWithNewTile = addRandomTile(newGrid);
            setGrid(gridWithNewTile);
            setScore(newScore);


            if (isGameOver(gridWithNewTile)) {
                setGameOver(true);
            }
        }
    }, [grid, score, gameOver]);

    const isGameOver = (currentGrid: Grid): boolean => {
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (currentGrid[r][c] === 0) return false;
                if (r < GRID_SIZE - 1 && currentGrid[r][c] === currentGrid[r + 1][c]) return false;
                if (c < GRID_SIZE - 1 && currentGrid[r][c] === currentGrid[r][c + 1]) return false;
            }
        }
        return true;
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(e.key)) {
                e.preventDefault();
            }
            switch (e.key) {
                case 'ArrowUp': move('up'); break;
                case 'ArrowDown': move('down'); break;
                case 'ArrowLeft': move('left'); break;
                case 'ArrowRight': move('right'); break;
                case 'Escape': onExit(); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move, onExit]);

    const getTileColor = (val: number) => {
        const colors: Record<number, string> = {
            2: 'bg-gray-800 text-gray-200',
            4: 'bg-gray-700 text-gray-100',
            8: 'bg-orange-900/40 text-orange-200 border-orange-500/30',
            16: 'bg-orange-800/50 text-orange-100 border-orange-500/40',
            32: 'bg-red-900/40 text-red-200 border-red-500/30',
            64: 'bg-red-800/50 text-red-100 border-red-500/40',
            128: 'bg-yellow-900/40 text-yellow-200 border-yellow-500/30',
            256: 'bg-yellow-800/50 text-yellow-100 border-yellow-500/40',
            512: 'bg-green-900/40 text-green-200 border-green-500/30',
            1024: 'bg-green-800/50 text-green-100 border-green-500/40',
            2048: 'bg-blue-900/40 text-blue-200 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        };
        return colors[val] || 'bg-blue-800 text-white';
    };

    return (
        <div className={`relative w-full flex items-center justify-center bg-black/40 rounded-lg border border-gray-800 overflow-hidden font-mono text-gray-400 ${isVertical ? 'h-[400px]' : 'h-[220px]'
            }`}>
            <div className="absolute top-2 left-6 right-6 flex justify-between items-center z-10">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">PROTOCOL_2048 v1.0</div>
                <div className="text-sm font-bold text-blue-400 flex items-center gap-2">
                    <span className="text-[10px] text-gray-600">SCORE</span>
                    {score.toString().padStart(5, '0')}
                </div>
            </div>

            <div className={`grid grid-cols-4 gap-2 bg-[#050505] p-2 rounded-md border border-gray-900 shadow-2xl ${isVertical ? 'p-4 gap-3' : 'p-2 gap-2'
                }`}>
                {grid.map((row, r) => (
                    row.map((cell, c) => (
                        <div
                            key={`${r}-${c}`}
                            className={`${isVertical ? 'w-16 h-16 text-lg' : 'w-10 h-10 text-xs'
                                } rounded-sm flex items-center justify-center font-bold transition-all duration-200 border border-transparent ${cell === 0 ? 'bg-black/20' : getTileColor(cell)}`}
                        >
                            {cell !== 0 ? cell : ''}
                        </div>
                    ))
                ))}
            </div>

            <AnimatePresence>
                {gameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                    >
                        <div className="text-red-500 text-xl font-bold mb-2 tracking-tighter uppercase">Memory Overflow: Game Over</div>
                        <div className="text-gray-400 text-xs mb-4 uppercase">Data Harvested: {score}</div>
                        <div className="flex gap-4">
                            <button
                                onClick={initGame}
                                className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/50 text-blue-500 text-xs hover:bg-blue-500/20 transition-colors uppercase"
                            >
                                Re-init
                            </button>
                            <button
                                onClick={onExit}
                                className="px-4 py-1.5 bg-red-500/10 border border-red-500/50 text-red-500 text-xs hover:bg-red-500/20 transition-colors uppercase"
                            >
                                Exit
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-2 left-6 right-6 text-[8px] text-gray-600 uppercase flex justify-between">
                <span>Navigate with Arrows</span>
                <span>'Esc' to Break</span>
                <span>Reach 2048</span>
            </div>
        </div>
    );
};

export default Game2048;
