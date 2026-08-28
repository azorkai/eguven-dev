import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Anchor } from 'lucide-react';
import SnakeGame from './SnakeGame';
import Game2048 from './Game2048';


import MinesGame from './MinesGame';
import { useLanguage } from '../i18n/useLanguage';
import { sound, toggleSound, useSoundPref } from '../sound';


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
    const { t } = useLanguage();
    const [soundOn] = useSoundPref();
    const [inputValue, setInputValue] = useState('');
    const [showSnake, setShowSnake] = useState(false);
    const [show2048, setShow2048] = useState(false);
    const [showMines, setShowMines] = useState(false);
    const [snapPreview, setSnapPreview] = useState<'floating' | 'top' | 'bottom' | 'left' | 'right' | null>(null);

    /* The banner is rendered from the dictionary rather than pushed into the
       transcript, so it is in the right language even if the reader switches
       editions before typing anything. Printed lines are history and stay as
       they were typed. */
    const [showWelcome, setShowWelcome] = useState(true);
    const [outputs, setOutputs] = useState<CommandOutput[]>([]);
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
        help: t.terminal.help,
        whoami: t.terminal.whoami,
        skills: t.terminal.skills,
        projects: t.terminal.projects,
        ai: t.terminal.ai,
        snake: t.terminal.snake,
        2048: t.terminal.g2048,
        mines: t.terminal.mines,
    };


    const handleCommand = (e: React.KeyboardEvent) => {
        if (e.key === 'Esc' || e.key === 'Escape') {
            onClose();
            return;
        }

        /* One typebar per key that actually changes the line. Held arrows and
           modifiers do not print anything, so they do not sound like it. */
        if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
            sound.key();
        }

        if (e.key === 'Enter') {
            const cmd = inputValue.trim().toLowerCase();
            setInputValue('');

            if (!cmd) return;

            setOutputs(prev => [...prev, { type: 'input', text: cmd }]);

            if (cmd === 'clear') {
                setOutputs([]);
                setShowWelcome(false);
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


            if (cmd === 'sound') {
                const on = toggleSound();
                setOutputs(prev => [...prev, { type: 'response', text: on ? t.terminal.soundOn : t.terminal.soundOff }]);
                return;
            }

            if (cmd === 'exit') {
                onClose();
                return;
            }

            const response =
                commands[cmd] || `${t.terminal.notFoundPrefix} ${cmd}. ${t.terminal.notFoundSuffix}`;

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
                    return "top-[5%] left-[5%] right-[5%] w-[90%] h-[80vh] rounded-md shadow-xl border border-rule-ink";
                }
                return "top-1/2 left-1/2 rounded-md shadow-xl w-[600px] h-[600px]";
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
                        <div className={`fixed z-[90] bg-paper-edge/70 border border-dashed border-rule-strong pointer-events-none transition-all duration-300 ${snapPreview === 'top' ? 'top-0 left-0 h-[300px] w-full' :
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
                        data-print="hide"
                        data-copy-credit="off"
                        className={`fixed z-[100] bg-paper-raised border border-rule-ink shadow-xl overflow-hidden ${getDockStyles()}`}
                        style={{
                            transform: dockPosition === 'floating' ? undefined : 'none'
                        }}
                    >
                        <div className="flex items-center justify-between px-6 py-2 border-b border-rule-ink bg-ink text-paper-raised cursor-grab active:cursor-grabbing">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-paper-raised/45"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-paper-raised/25"></span>
                                <span className="ml-4 text-[9px] tracking-[0.25em] uppercase font-mono text-paper-raised font-bold">{t.terminal.console} {dockPosition.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setDockPosition(dockPosition === 'floating' ? 'bottom' : 'floating')}
                                    className="text-paper-raised/70 hover:text-paper-raised transition-colors flex items-center gap-2 text-[10px] uppercase tracking-wider"
                                    aria-label={dockPosition === 'floating' ? t.terminal.dockBottom : t.terminal.makeFloating}
                                    title={dockPosition === 'floating' ? t.terminal.dockBottom : t.terminal.makeFloating}
                                >
                                    {dockPosition === 'floating' ? <Anchor size={14} /> : <Maximize2 size={14} />}
                                </button>
                                <button onClick={onClose} aria-label={t.terminal.close} title={t.terminal.close} className="text-paper-raised/70 hover:text-paper-raised transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={scrollRef}
                            className={`p-6 overflow-y-auto font-mono leading-relaxed text-ink-body bg-paper-raised ${getContentHeight()} ${isVertical ? 'text-[11px]' : 'text-sm'
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
                                        {showWelcome && (
                                            <div className="mb-4 text-ink-muted font-light break-words">
                                                <span className="block">{t.terminal.welcome}</span>
                                                {/* One line, so the switch is discoverable without a
                                                    speaker icon sitting in the chrome all day. */}
                                                <span className="block">
                                                    {soundOn ? t.terminal.soundHintOn : t.terminal.soundHintOff}
                                                </span>
                                            </div>
                                        )}
                                        {outputs.map((out, i) => (
                                            <div key={i} className={out.type === 'input' ? (isVertical ? 'flex flex-col gap-1' : 'flex gap-2') : 'mb-4 text-ink-muted font-light break-words'}>
                                                {out.type === 'input' && (
                                                    <div className="flex gap-2 flex-wrap">
                                                        <span className="text-accent whitespace-nowrap">guest@eg-portfolio</span>
                                                        <span className="text-ink-faint">$</span>
                                                        <span className="text-ink font-semibold break-all">{out.text}</span>
                                                    </div>
                                                )}
                                                {out.type === 'response' && <span className="block">{out.text}</span>}
                                            </div>
                                        ))}
                                    </div>

                                    <div className={`flex items-start gap-2 mt-2 ${isVertical ? 'flex-col' : ''}`}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-accent whitespace-nowrap">guest@eg-portfolio</span>
                                            <span className="text-ink-faint">:</span>
                                            <span className="text-ink-muted">~</span>
                                            <span className="text-ink-faint">$</span>
                                        </div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleCommand}
                                            className={`bg-transparent border-none p-0 flex-1 text-ink font-mono focus:ring-0 outline-none w-full ${isVertical ? 'pt-1' : ''
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
