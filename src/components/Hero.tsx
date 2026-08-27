import { useState } from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
    const [logClickCount, setLogClickCount] = useState(0);

    const glitchVariants = {
        glitch: {
            x: [0, 5, -5, 2, -2, 0],
            y: [0, -2, 2, -1, 1, 0],
            color: ["#fff", "#0ff", "#f0f", "#fff"],
            transition: {
                duration: 0.2,
                repeat: 3,
                ease: "linear" as const
            }
        }
    };

    return (
        <header className="container mx-auto px-6 md:px-24 pt-32 md:pt-12 pb-20">
            <div className="relative">
                <span className="block text-[10px] tracking-[0.4em] mb-4 text-text-muted dark:text-gray-500 uppercase">Insights & Thoughts</span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase leading-none tracking-tighter mb-8 select-none">
                    The <motion.span
                        animate={logClickCount >= 5 ? "glitch" : ""}
                        variants={glitchVariants}
                        onAnimationComplete={() => logClickCount >= 5 && setLogClickCount(0)}
                        onClick={() => setLogClickCount(prev => prev + 1)}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white inline-block cursor-pointer"
                    >
                        Log
                    </motion.span>
                </h1>
                <p className="max-w-xl text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                    Exploring the intersection of complex systems, scalable architecture, and user-centric engineering. A collection of technical deep dives and architectural patterns.
                </p>
            </div>
        </header>
    );
};

export default Hero;
