import React, { useState, useEffect, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Linkedin, Calendar, ArrowDown, Github } from 'lucide-react';

const Contact: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'hero' | 'form'>('hero');
    const isScrolling = useRef(false);
    const touchStartY = useRef<number | null>(null);
    const [token, setToken] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    useEffect(() => {
        const footer = document.querySelector('footer');
        if (footer) footer.style.display = 'none';

        const scrollToSection = (section: 'hero' | 'form') => {
            if (isScrolling.current) return;
            isScrolling.current = true;
            setActiveSection(section);

            setTimeout(() => {
                isScrolling.current = false;
            }, 1000);
        };

        const handleWheel = (e: WheelEvent) => {
            if (isScrolling.current) return;

            if (e.deltaY > 50 && activeSection === 'hero') {
                scrollToSection('form');
            } else if (e.deltaY < -50 && activeSection === 'form') {
                const formSection = document.getElementById('form-container');
                if (formSection && formSection.scrollTop <= 0) {
                    scrollToSection('hero');
                }
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (touchStartY.current === null || isScrolling.current) return;

            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchStartY.current - touchEndY;

            if (Math.abs(deltaY) > 50) {
                if (deltaY > 0 && activeSection === 'hero') {
                    scrollToSection('form');
                } else if (deltaY < 0 && activeSection === 'form') {
                    const formSection = document.getElementById('form-container');
                    if (formSection && formSection.scrollTop <= 0) {
                        scrollToSection('hero');
                    }
                }
            }
            touchStartY.current = null;
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            if (footer) footer.style.display = 'block';
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [activeSection]);

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    } as const;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.8
            }
        }
    };

    return (
        <div className="w-full h-screen overflow-hidden bg-background-dark relative">
            <AnimatePresence mode="wait">
                {activeSection === 'hero' ? (
                    <motion.section
                        key="hero"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9, filter: 'blur(10px)' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 flex items-center justify-center px-6"
                    >
                        <div className="w-full flex flex-col items-center justify-center z-10">
                            <motion.span
                                initial={{ letterSpacing: "0.2em", opacity: 0 }}
                                animate={{ letterSpacing: "0.6em", opacity: 0.7 }}
                                className="block text-[10px] mb-12 text-text-muted uppercase text-center"
                            >
                                Availability: Open for inquiry
                            </motion.span>
                            <h1 className="flex flex-col items-center font-display font-bold uppercase leading-[0.9] tracking-tighter mb-12 select-none text-center">
                                <motion.span
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-5xl md:text-7xl lg:text-8xl block"
                                >
                                    Let's
                                </motion.span>
                                <motion.span
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-6xl md:text-8xl lg:text-[10rem] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 block"
                                >
                                    Connect.
                                </motion.span>
                            </h1>
                            <div className="flex flex-col items-center gap-12 pointer-events-auto">
                                <a className="text-xl md:text-2xl font-light tracking-[0.2em] text-gray-400 hover:text-white transition-all lowercase" href="mailto:contact@eguven.dev">
                                    contact@eguven.dev
                                </a>
                                <button
                                    onClick={() => setActiveSection('form')}
                                    className="group flex flex-col items-center gap-4 text-[10px] tracking-[0.4em] uppercase text-gray-600 hover:text-white transition-all"
                                >
                                    <span>Send a direct message</span>
                                    <ArrowDown className="animate-bounce mt-4 opacity-50 group-hover:opacity-100" size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/[0.03] blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/[0.02] blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        </div>
                    </motion.section>
                ) : (
                    <motion.section
                        key="form"
                        id="form-container"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 flex items-center justify-center p-6 bg-background-dark overflow-y-auto"
                    >
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="container mx-auto px-6 md:px-24 pt-48 md:pt-12 pb-12"
                        >
                            <motion.div variants={itemVariants} className="mb-8 md:mb-16">
                                <span className="hidden md:block text-[10px] tracking-[0.6em] mb-4 text-text-muted uppercase">Inquiry</span>
                                <h2 className="text-3xl md:text-7xl lg:text-9xl font-display font-bold uppercase leading-none tracking-tighter">
                                    <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.15)' }}>The</span>
                                    <span className="text-white block md:inline md:ml-6">Contact</span>
                                </h2>
                            </motion.div>

                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-32">
                                <motion.section variants={itemVariants} className="lg:w-3/5">
                                    <form ref={formRef} className="flex flex-col gap-8 md:gap-10" onSubmit={async (e) => {
                                        e.preventDefault();
                                        if (!token) return;
                                        setStatus('sending');

                                        const formData = new FormData(e.currentTarget);
                                        const data = {
                                            name: formData.get('name') as string,
                                            email: formData.get('email') as string,
                                            message: formData.get('message') as string,
                                            token
                                        };

                                        try {
                                            const { api } = await import('../services/api');
                                            await api.contact.send(data);
                                            setStatus('success');
                                            formRef.current?.reset();
                                        } catch (error) {
                                            console.error(error);
                                            setStatus('error');
                                        }
                                    }}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                            <div className="relative group">
                                                <label className="block text-[9px] tracking-[0.3em] text-text-muted uppercase mb-2 md:mb-4 group-focus-within:text-white transition-colors">Your Name</label>
                                                <input name="name" required className="w-full bg-transparent border-b border-white/10 py-1 md:py-2 text-sm focus:outline-none focus:border-white transition-all text-white font-light" placeholder="John Doe" type="text" />
                                            </div>
                                            <div className="relative group">
                                                <label className="block text-[9px] tracking-[0.3em] text-text-muted uppercase mb-2 md:mb-4 group-focus-within:text-white transition-colors">Email Address</label>
                                                <input name="email" required className="w-full bg-transparent border-b border-white/10 py-1 md:py-2 text-sm focus:outline-none focus:border-white transition-all text-white font-light" placeholder="john@company.com" type="email" />
                                            </div>
                                        </div>
                                        <div className="relative group text-left">
                                            <label className="block text-[9px] tracking-[0.3em] text-text-muted uppercase mb-2 md:mb-4 group-focus-within:text-white transition-colors">Message</label>
                                            <textarea name="message" required className="w-full bg-transparent border-b border-white/10 py-1 md:py-2 text-sm focus:outline-none focus:border-white transition-all text-white font-light min-h-[80px] md:min-h-[120px] resize-none" placeholder="Describe your project or vision..."></textarea>
                                        </div>
                                        <div className="flex justify-start">
                                            <Turnstile
                                                siteKey="2x00000000000000000000AB"
                                                onSuccess={setToken}
                                                options={{ theme: 'dark', size: 'flexible' }}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="pt-2 flex justify-start items-center">
                                            <button disabled={!token || status === 'sending'} className="group relative overflow-hidden bg-white text-black px-10 py-4 text-[10px] tracking-[0.4em] uppercase font-bold transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                                                <span className="relative z-10 flex items-center gap-4">
                                                    {status === 'sending' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'} <ArrowRight size={14} />
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setActiveSection('hero')}
                                                className="ml-8 text-[10px] tracking-[0.4em] uppercase text-gray-600 hover:text-white transition-all"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </form>
                                </motion.section>

                                <motion.aside variants={itemVariants} className="lg:w-2/5 flex flex-col gap-12">
                                    <div className="border-t border-white/10 pt-8">
                                        <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-8 text-white">Inquiries</h3>
                                        <div className="space-y-6">
                                            <div className="group cursor-pointer">
                                                <a className="text-lg font-light text-gray-400 group-hover:text-white transition-colors flex items-center gap-3" href="mailto:contact@eguven.dev">
                                                    <Mail size={16} /> contact@eguven.dev
                                                </a>
                                            </div>
                                            <div className="group cursor-pointer">
                                                <a
                                                    className="text-lg font-light text-gray-400 group-hover:text-white transition-colors flex items-center gap-3"
                                                    href="https://github.com/azorkai"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Github size={16} /> azorkai
                                                </a>
                                            </div>
                                            <div className="group cursor-pointer">
                                                <a
                                                    className="text-lg font-light text-gray-400 group-hover:text-white transition-colors flex items-center gap-3"
                                                    href="https://www.linkedin.com/in/eguvendev/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Linkedin size={16} /> emirhan-guven
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-white/10 pt-8 text-left">
                                        <p className="text-xs text-gray-500 mb-6 font-light">Available for high-impact projects and strategic technical roles.</p>
                                        <a className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 text-[9px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all" href="#">
                                            <Calendar size={14} /> Book a call
                                        </a>
                                    </div>
                                </motion.aside>
                            </div>
                        </motion.div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Contact;
