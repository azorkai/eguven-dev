import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/useLanguage';

interface Game2048Props {
    onExit: () => void;
    isVertical?: boolean;
}

type Grid = number[][];

const GRID_SIZE = 4;

const Game2048: React.FC<Game2048Props> = ({ onExit, isVertical = false }) => {
    const { t } = useLanguage();
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
            2: 'bg-paper-sunk text-ink border-rule',
            4: 'bg-paper-edge text-ink border-rule',
            8: 'bg-paper-edge text-ink border-rule-strong',
            16: 'bg-accent/20 text-ink border-accent/40',
            32: 'bg-accent/35 text-ink border-accent/50',
            64: 'bg-accent/55 text-ink border-accent/70',
            128: 'bg-accent/75 text-paper-raised border-accent',
            256: 'bg-accent text-paper-raised border-accent',
            512: 'bg-ink/70 text-paper-raised border-ink',
            1024: 'bg-ink/85 text-paper-raised border-ink',
            2048: 'bg-ink text-paper-raised border-ink',
        };
        return colors[val] || 'bg-ink text-paper-raised border-ink';
    };

    return (
        <div className={`relative w-full flex items-center justify-center bg-paper-sunk border border-rule-strong overflow-hidden font-mono text-ink-body ${isVertical ? 'h-[400px]' : 'h-[220px]'
            }`}>
            <div className="absolute top-2 left-6 right-6 flex justify-between items-center z-10">
                <div className="text-[10px] text-ink-muted uppercase tracking-widest">PROTOCOL_2048 v1.0</div>
                <div className="text-sm font-bold text-accent flex items-center gap-2">
                    <span className="text-[10px] text-ink-muted">{t.games.score}</span>
                    {score.toString().padStart(5, '0')}
                </div>
            </div>

            <div className={`grid grid-cols-4 gap-2 bg-paper-raised p-2 rounded-sm border border-rule-strong ${isVertical ? 'p-4 gap-3' : 'p-2 gap-2'
                }`}>
                {grid.map((row, r) => (
                    row.map((cell, c) => (
                        <div
                            key={`${r}-${c}`}
                            className={`${isVertical ? 'w-16 h-16 text-lg' : 'w-10 h-10 text-xs'
                                } flex items-center justify-center font-bold transition-all duration-200 border ${cell === 0 ? 'bg-paper-sunk border-rule/60' : getTileColor(cell)}`}
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
                        className="absolute inset-0 bg-paper/95 flex flex-col items-center justify-center z-20"
                    >
                        <div className="px-4 text-center font-headline text-accent text-xl font-bold mb-2 tracking-tight uppercase">{t.games.g2048Over}</div>
                        <div className="text-ink-muted text-xs mb-4 uppercase">{t.games.g2048Harvested} {score}</div>
                        <div className="flex gap-4">
                            <button
                                onClick={initGame}
                                className="px-4 py-1.5 border border-ink text-ink text-xs hover:bg-ink hover:text-paper-raised transition-colors uppercase"
                            >
                                {t.games.g2048Restart}
                            </button>
                            <button
                                onClick={onExit}
                                className="px-4 py-1.5 border border-accent text-accent text-xs hover:bg-accent hover:text-paper-raised transition-colors uppercase"
                            >
                                {t.games.exit}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-2 left-6 right-6 text-[8px] text-ink-muted uppercase flex justify-between">
                <span>{t.games.g2048Move}</span>
                <span>{t.games.g2048Exit}</span>
                <span>{t.games.g2048Goal}</span>
            </div>
        </div>
    );
};

export default Game2048;
