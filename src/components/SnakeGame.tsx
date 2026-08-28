import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/useLanguage';

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
    const { t } = useLanguage();
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
        <div className={`relative w-full flex items-center justify-center bg-paper-sunk border border-rule-strong overflow-hidden font-mono ${isVertical ? 'h-[400px]' : 'h-[220px]'
            }`}>
            <div className="absolute top-2 left-6 right-6 flex justify-between items-center z-10">
                <div className="text-[10px] text-ink-muted uppercase tracking-widest">SNAKE_PROTOCOL v1.0</div>
                <div className="text-sm font-bold text-accent">{t.games.score}: {score.toString().padStart(4, '0')}</div>
            </div>

            <div
                className="relative bg-paper-raised rounded-sm border border-rule-strong"
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
                    className="absolute bg-accent rounded-full"
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
                        className={`absolute ${i === 0 ? 'bg-ink' : 'bg-ink/55'} border border-paper-raised/40`}
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
                <div className="absolute inset-0 bg-paper/95 flex flex-col items-center justify-center z-20">
                    <div className="px-4 text-center font-headline text-accent text-xl font-bold mb-2 tracking-tight">{t.games.snakeOver}</div>
                    <div className="text-ink-muted text-xs mb-4 uppercase">{t.games.snakeFinal} {score}</div>
                    <div className="flex gap-4">
                        <button
                            onClick={resetGame}
                            className="px-4 py-1.5 border border-ink text-ink text-xs hover:bg-ink hover:text-paper-raised transition-colors uppercase"
                        >
                            {t.games.snakeRestart}
                        </button>
                        <button
                            onClick={onExit}
                            className="px-4 py-1.5 border border-accent text-accent text-xs hover:bg-accent hover:text-paper-raised transition-colors uppercase"
                        >
                            {t.games.exit}
                        </button>
                    </div>
                </div>
            )}

            {isPaused && !gameOver && (
                <div className="absolute inset-0 bg-paper/85 flex items-center justify-center z-20">
                    <div className="px-6 text-center text-ink text-xs font-bold tracking-widest animate-pulse uppercase">{t.games.snakePaused}</div>
                </div>
            )}

            <div className="absolute bottom-2 left-6 right-6 text-[8px] text-ink-muted uppercase flex justify-between md:flex">
                <span>{t.games.snakeMove}</span>
                <span>{t.games.snakePause}</span>
                <span>{t.games.snakeExit}</span>
            </div>

            {/* Mobile Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1 md:hidden opacity-50 hover:opacity-100 transition-opacity z-30">
                <button
                    className="w-8 h-8 bg-paper-raised border border-ink flex items-center justify-center text-ink active:bg-ink active:text-paper-raised"
                    onClick={() => direction.y === 0 && setDirection({ x: 0, y: -1 })}
                >
                    ↑
                </button>
                <div className="flex gap-1">
                    <button
                        className="w-8 h-8 bg-paper-raised border border-ink flex items-center justify-center text-ink active:bg-ink active:text-paper-raised"
                        onClick={() => direction.x === 0 && setDirection({ x: -1, y: 0 })}
                    >
                        ←
                    </button>
                    <button
                        className="w-8 h-8 bg-paper-raised border border-ink flex items-center justify-center text-ink active:bg-ink active:text-paper-raised"
                        onClick={() => direction.x === 0 && setDirection({ x: 1, y: 0 })}
                    >
                        →
                    </button>
                </div>
                <button
                    className="w-8 h-8 bg-paper-raised border border-ink flex items-center justify-center text-ink active:bg-ink active:text-paper-raised"
                    onClick={() => direction.y === 0 && setDirection({ x: 0, y: 1 })}
                >
                    ↓
                </button>
            </div>
        </div>
    );
};

export default SnakeGame;
