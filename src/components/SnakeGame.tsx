import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface Point {
    x: number;
    y: number;
}

interface SnakeGameProps {
    onExit: () => void;
    isVertical?: boolean;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

const SnakeGame: React.FC<SnakeGameProps> = ({ onExit, isVertical = false }) => {
    const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
    const [food, setFood] = useState<Point>({ x: 5, y: 5 });
    const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const gameLoopRef = useRef<any>(null);

    const generateFood = useCallback((currentSnake: Point[]) => {
        let newFood: Point;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
        } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }, []);

    const resetGame = () => {
        setSnake(INITIAL_SNAKE);
        setFood({ x: 5, y: 5 });
        setDirection(INITIAL_DIRECTION);
        setGameOver(false);
        setScore(0);
        setIsPaused(false);
    };

    const moveSnake = useCallback(() => {
        if (gameOver || isPaused) return;

        setSnake(prevSnake => {
            const head = prevSnake[0];
            const newHead = {
                x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
                y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
            };

            if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                setGameOver(true);
                return prevSnake;
            }

            const newSnake = [newHead, ...prevSnake];

            if (newHead.x === food.x && newHead.y === food.y) {
                setScore(s => s + 10);
                setFood(generateFood(newSnake));
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [direction, food, gameOver, isPaused, generateFood]);

    useEffect(() => {
        gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED - Math.min(score / 2, 100));
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [moveSnake, score]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'p', 'P', 'Escape'].includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key) {
                case 'ArrowUp':
                    if (direction.y === 0) setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    if (direction.y === 0) setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    if (direction.x === 0) setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    if (direction.x === 0) setDirection({ x: 1, y: 0 });
                    break;
                case 'Escape':
                    onExit();
                    break;
                case 'p':
                case 'P':
                    setIsPaused(prev => !prev);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction, onExit]);

    return (
        <div className={`relative w-full flex items-center justify-center bg-black/40 rounded-lg border border-gray-800 overflow-hidden font-mono ${isVertical ? 'h-[400px]' : 'h-[220px]'
            }`}>
            <div className="absolute top-2 left-6 right-6 flex justify-between items-center z-10">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">SNAKE_PROTOCOL v1.0</div>
                <div className="text-sm font-bold text-green-500">SCORE: {score.toString().padStart(4, '0')}</div>
            </div>

            <div
                className="relative bg-[#050505] border border-gray-900 shadow-2xl"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    width: isVertical ? '280px' : '180px',
                    height: isVertical ? '280px' : '180px'
                }}
            >
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute bg-red-500 rounded-full"
                    style={{
                        width: isVertical ? '14px' : '9px',
                        height: isVertical ? '14px' : '9px',
                        left: `${(food.x / GRID_SIZE) * 100}%`,
                        top: `${(food.y / GRID_SIZE) * 100}%`,
                        transform: 'translate(0, 0)'
                    }}
                />

                {snake.map((segment, i) => (
                    <div
                        key={i}
                        className={`absolute ${i === 0 ? 'bg-green-400' : 'bg-green-600/60'} rounded-sm border border-black/20`}
                        style={{
                            width: isVertical ? '14px' : '9px',
                            height: isVertical ? '14px' : '9px',
                            left: `${(segment.x / GRID_SIZE) * 100}%`,
                            top: `${(segment.y / GRID_SIZE) * 100}%`
                        }}
                    />
                ))}
            </div>

            {gameOver && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                    <div className="text-red-500 text-xl font-bold mb-2 tracking-tighter">CONNECTION LOST: GAME OVER</div>
                    <div className="text-gray-400 text-xs mb-4 uppercase">Final Score: {score}</div>
                    <div className="flex gap-4">
                        <button
                            onClick={resetGame}
                            className="px-4 py-1.5 bg-green-500/10 border border-green-500/50 text-green-500 text-xs hover:bg-green-500/20 transition-colors uppercase"
                        >
                            Restart
                        </button>
                        <button
                            onClick={onExit}
                            className="px-4 py-1.5 bg-red-500/10 border border-red-500/50 text-red-500 text-xs hover:bg-red-500/20 transition-colors uppercase"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            )}

            {isPaused && !gameOver && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                    <div className="text-white text-xs font-bold tracking-widest animate-pulse uppercase">Protocol Paused - Press 'P' to Resume</div>
                </div>
            )}

            <div className="absolute bottom-2 left-6 right-6 text-[8px] text-gray-600 uppercase flex justify-between md:flex">
                <span>Arrows to Move</span>
                <span>'P' to Pause</span>
                <span>'Esc' to Exit</span>
            </div>

            {/* Mobile Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1 md:hidden opacity-50 hover:opacity-100 transition-opacity z-30">
                <button
                    className="w-8 h-8 bg-gray-800/80 rounded flex items-center justify-center text-white active:bg-green-500/50"
                    onClick={() => direction.y === 0 && setDirection({ x: 0, y: -1 })}
                >
                    ↑
                </button>
                <div className="flex gap-1">
                    <button
                        className="w-8 h-8 bg-gray-800/80 rounded flex items-center justify-center text-white active:bg-green-500/50"
                        onClick={() => direction.x === 0 && setDirection({ x: -1, y: 0 })}
                    >
                        ←
                    </button>
                    <button
                        className="w-8 h-8 bg-gray-800/80 rounded flex items-center justify-center text-white active:bg-green-500/50"
                        onClick={() => direction.x === 0 && setDirection({ x: 1, y: 0 })}
                    >
                        →
                    </button>
                </div>
                <button
                    className="w-8 h-8 bg-gray-800/80 rounded flex items-center justify-center text-white active:bg-green-500/50"
                    onClick={() => direction.y === 0 && setDirection({ x: 0, y: 1 })}
                >
                    ↓
                </button>
            </div>
        </div>
    );
};

export default SnakeGame;
