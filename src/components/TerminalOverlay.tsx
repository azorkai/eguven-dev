import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Anchor } from 'lucide-react';
import SnakeGame from './SnakeGame';
import Game2048 from './Game2048';


import MinesGame from './MinesGame';


interface CommandOutput {
    type: 'input' | 'response';
    text: string;
}

interface TerminalOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    dockPosition: 'floating' | 'top' | 'bottom' | 'left' | 'right';
    setDockPosition: (pos: 'floating' | 'top' | 'bottom' | 'left' | 'right') => void;
}

const TerminalOverlay: React.FC<TerminalOverlayProps> = ({ isOpen, onClose, dockPosition, setDockPosition }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSnake, setShowSnake] = useState(false);
    const [show2048, setShow2048] = useState(false);
    const [showMines, setShowMines] = useState(false);
    const [snapPreview, setSnapPreview] = useState<'floating' | 'top' | 'bottom' | 'left' | 'right' | null>(null);

    const [outputs, setOutputs] = useState<CommandOutput[]>([
        { type: 'response', text: "Welcome to the interactive portfolio terminal. Type 'help' to see available commands." }
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 500);
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [outputs]);

    const commands: Record<string, string> = {
        help: "Available commands: [help, whoami, skills, projects, snake, 2048, mines, clear, exit]",
        whoami: "Emirhan Güven - Senior Full Stack Developer. Specialized in architecting scalable SaaS solutions and high-throughput automation systems using .NET 8 and React. Expertise in CRM ecosystems and AI-driven automation.",
        skills: "Backend: [.NET 8, C#, ASP.NET Core, Python, EF Core, Redis] | Frontend: [React, TypeScript, Tailwind, JavaScript] | Database: [SQL Server, PostgreSQL, MySQL] | DevOps: [Docker, Git, CI/CD]",
        projects: "Directing to /projects page soon... (Check the navigation bar)",
        snake: "Initializing SNAKE_PROTOCOL...",
        2048: "Initializing PROTOCOL_2048...",
        mines: "Initializing MINES_SCAN_PROTOCOL...",
    };


    const handleCommand = (e: React.KeyboardEvent) => {
        if (e.key === 'Esc' || e.key === 'Escape') {
            onClose();
            return;
        }

        if (e.key === 'Enter') {
            const cmd = inputValue.trim().toLowerCase();
            setInputValue('');

            if (!cmd) return;

            setOutputs(prev => [...prev, { type: 'input', text: cmd }]);

            if (cmd === 'clear') {
                setOutputs([]);
                return;
            }

            if (cmd === 'snake') {
                setShowSnake(true);
                return;
            }

            if (cmd === '2048') {
                setShow2048(true);
                return;
            }

            if (cmd === 'mines') {
                setShowMines(true);
                return;
            }


            if (cmd === 'exit') {
                onClose();
                return;
            }

            const response = commands[cmd] || `Command not found: ${cmd}. Type 'help' for available commands.`;

            setTimeout(() => {
                setOutputs(prev => [...prev, { type: 'response', text: response }]);
            }, 100);
        }
    };

    const handleDrag = (_: any, info: any) => {
        const { x, y } = info.point;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const threshold = 150;

        const dists = {
            top: y,
            bottom: height - y,
            left: x,
            right: width - x
        };

        type Edge = keyof typeof dists;
        const closest = (Object.keys(dists) as Edge[]).reduce((a, b) => dists[a] < dists[b] ? a : b);

        if (dists[closest] < threshold) {
            setSnapPreview(closest);
        } else {
            setSnapPreview(null);
        }
    };

    const handleDragEnd = (_: any, info: any) => {
        const { x, y } = info.point;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const threshold = 150;

        const dists = {
            top: y,
            bottom: height - y,
            left: x,
            right: width - x
        };

        type Edge = keyof typeof dists;
        const closest = (Object.keys(dists) as Edge[]).reduce((a, b) => dists[a] < dists[b] ? a : b);

        if (dists[closest] < threshold) {
            setDockPosition(closest);
        }
        setSnapPreview(null);
    };

    const getDockStyles = () => {
        // Mobile override for floating to be full screen or large modal
        const isMobile = window.innerWidth < 768; // We could use a hook for this to be more reactive

        switch (dockPosition) {
            case 'top':
                return "top-0 left-0 w-full h-[300px] border-b";
            case 'bottom':
                return "bottom-0 left-0 w-full h-[300px] border-t";
            case 'left':
                return "top-0 left-0 w-[400px] h-full border-r";
            case 'right':
                return "top-0 right-0 w-[400px] h-full border-l";
            case 'floating':
            default:
                if (isMobile) {
                    return "top-[5%] left-[5%] right-[5%] w-[90%] h-[80vh] rounded-xl shadow-2xl border border-gray-700";
                }
                return "top-1/2 left-1/2 rounded-xl shadow-2xl w-[600px] h-[600px]";
        }
    };

    const getContentHeight = () => {
        const isMobile = window.innerWidth < 768;
        if (dockPosition === 'left' || dockPosition === 'right') return 'h-[calc(100vh-36px)]';

        if (dockPosition === 'floating') {
            if (isMobile) return 'h-[calc(80vh-36px)]';
            return 'h-[calc(600px-36px)]';
        }
        return 'h-[calc(300px-36px)]';
    };

    const isVertical = dockPosition === 'left' || dockPosition === 'right';

    // Hook to force re-render on resize so isMobile check works (simple version)
    useEffect(() => {
        const handleResize = () => setDockPosition(dockPosition); // Trigger re-render
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dockPosition, setDockPosition]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {snapPreview && (
                        <div className={`fixed z-[90] bg-white/5 border-2 border-dashed border-white/20 pointer-events-none transition-all duration-300 ${snapPreview === 'top' ? 'top-0 left-0 h-[300px] w-full' :
                            snapPreview === 'bottom' ? 'bottom-0 left-0 h-[300px] w-full' :
                                snapPreview === 'left' ? 'top-0 left-0 w-[400px] h-full' :
                                    'top-0 right-0 w-[400px] h-full'
                            }`} />
                    )}
                    <motion.div
                        key={dockPosition}
                        drag={dockPosition === 'floating'}
                        dragMomentum={false}
                        onDrag={handleDrag}
                        onDragEnd={handleDragEnd}
                        initial={dockPosition === 'floating'
                            ? { opacity: 0, x: "-50%", y: "-50%", left: "50%", top: "50%" }
                            : { y: '100%', x: "0%", left: 0 }
                        }
                        animate={dockPosition === 'floating'
                            ? {
                                opacity: 1,
                                x: window.innerWidth < 768 ? "0" : "-50%", // On mobile, we use fixed positioning keys in className usually, or reset transform
                                y: window.innerWidth < 768 ? "0" : "-50%",
                                left: window.innerWidth < 768 ? "5%" : "50%",
                                top: window.innerWidth < 768 ? "10%" : "50%",
                                width: window.innerWidth < 768 ? "90%" : "600px",
                                height: window.innerWidth < 768 ? "80vh" : "600px"
                            }
                            : dockPosition === 'top' ? { y: 0, x: 0, left: 0, top: 0, width: "100%", height: "300px" }
                                : dockPosition === 'bottom' ? { y: 0, x: 0, left: 0, top: "auto", bottom: 0, width: "100%", height: "300px" }
                                    : dockPosition === 'left' ? { x: 0, y: 0, left: 0, top: 0, width: "400px", height: "100%" }
                                        : { x: 0, y: 0, right: 0, left: "auto", top: 0, width: "400px", height: "100%" }
                        }
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`fixed z-[100] bg-[#0a0a0a]/95 backdrop-blur-md border border-gray-800 shadow-[0_-10px_40px_-10px_rgba(255,255,255,0.05)] overflow-hidden ${getDockStyles()}`}
                        style={{
                            transform: dockPosition === 'floating' ? undefined : 'none'
                        }}
                    >
                        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-800 bg-black/40 cursor-grab active:cursor-grabbing">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></span>
                                <span className="ml-4 text-[9px] tracking-[0.25em] uppercase font-mono text-gray-500 font-bold">System Console v1.0.4 {dockPosition.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setDockPosition(dockPosition === 'floating' ? 'bottom' : 'floating')}
                                    className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] uppercase tracking-wider"
                                    title={dockPosition === 'floating' ? "Dock to Bottom" : "Make Floating"}
                                >
                                    {dockPosition === 'floating' ? <Anchor size={14} /> : <Maximize2 size={14} />}
                                </button>
                                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={scrollRef}
                            className={`p-6 overflow-y-auto font-mono leading-relaxed text-gray-400 ${getContentHeight()} ${isVertical ? 'text-[11px]' : 'text-sm'
                                }`}
                        >
                            {showSnake ? (
                                <SnakeGame onExit={() => setShowSnake(false)} isVertical={isVertical} />
                            ) : show2048 ? (
                                <Game2048 onExit={() => setShow2048(false)} isVertical={isVertical} />
                            ) : showMines ? (
                                <MinesGame onExit={() => setShowMines(false)} isVertical={isVertical} />
                            ) : (

                                <>
                                    <div className="space-y-2">
                                        {outputs.map((out, i) => (
                                            <div key={i} className={out.type === 'input' ? (isVertical ? 'flex flex-col gap-1' : 'flex gap-2') : 'mb-4 text-gray-500 font-light break-words'}>
                                                {out.type === 'input' && (
                                                    <div className="flex gap-2 flex-wrap">
                                                        <span className="text-green-500 whitespace-nowrap">guest@eg-portfolio</span>
                                                        <span className="text-gray-600">$</span>
                                                        <span className="text-white break-all">{out.text}</span>
                                                    </div>
                                                )}
                                                {out.type === 'response' && <span className="block">{out.text}</span>}
                                            </div>
                                        ))}
                                    </div>

                                    <div className={`flex items-start gap-2 mt-2 ${isVertical ? 'flex-col' : ''}`}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-500 whitespace-nowrap">guest@eg-portfolio</span>
                                            <span className="text-gray-600">:</span>
                                            <span className="text-blue-400">~</span>
                                            <span className="text-gray-600">$</span>
                                        </div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleCommand}
                                            className={`bg-transparent border-none p-0 flex-1 text-white font-mono focus:ring-0 outline-none w-full ${isVertical ? 'pt-1' : ''
                                                }`}
                                            autoComplete="off"
                                            spellCheck="false"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


export default TerminalOverlay;
