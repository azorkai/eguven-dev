import React, { useEffect, useState } from 'react';
import { Mail, Github, Linkedin, Twitter, ArrowUp, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            });
            setCurrentTime(timeString);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <footer className="relative mt-20 border-t border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-xl py-16 px-6 overflow-hidden">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-white/20 to-transparent" />

            <div className="container mx-auto max-w-7xl">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start"
                >

                    <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left gap-6">
                        <motion.div variants={itemVariants} className="text-3xl font-display font-bold tracking-tighter">
                            EG<span className="text-gray-400 dark:text-gray-600">.</span>
                        </motion.div>
                        <motion.p variants={itemVariants} className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
                            Building digital experiences with a focus on aesthetics and performance.
                            Based in Turkey, working globally.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex gap-4">
                            {[
                                { icon: <Mail size={18} />, href: "mailto:contact@eguven.dev" },
                                { icon: <Github size={18} />, href: "https://github.com/azorkai" },
                                { icon: <Linkedin size={18} />, href: "https://www.linkedin.com/in/eguvendev/" },
                                { icon: <Twitter size={18} />, href: "https://twitter.com/emirhanguven" }
                            ].map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-full"
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </motion.div>
                    </div>


                    <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left gap-4">
                        <motion.h4 variants={itemVariants} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Navigation</motion.h4>
                        <ul className="flex flex-col gap-3">
                            {['Projects', 'Articles', 'Contact'].map((item) => (
                                <motion.li key={item} variants={itemVariants}>
                                    <a href={`/${item.toLowerCase() === 'projects' ? '' : item.toLowerCase()}`} className="text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </div>


                    <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left gap-4">
                        <motion.h4 variants={itemVariants} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Local Time</motion.h4>
                        <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start gap-2">
                            <div className="text-2xl font-mono tracking-tight tabular-nums">
                                {currentTime}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                Available for new projects
                            </div>
                        </motion.div>
                    </div>


                    <div className="md:col-span-2 flex justify-center md:justify-end items-start mt-8 md:mt-0">
                        <motion.button
                            onClick={scrollToTop}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group flex flex-col items-center gap-4 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all">
                                <ArrowUp size={20} />
                            </div>
                            <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Top</span>
                        </motion.button>
                    </div>
                </motion.div>


                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-20 pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <div className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                        © 2026 Emirhan Güven. All Rights Reserved.
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                        <Globe size={12} />
                        Designed & Built in Istanbul
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
