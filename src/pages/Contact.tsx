import React, { useState, useEffect, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Linkedin, Calendar, ArrowDown, Github, Twitter } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import { useEdition } from '../theme/edition';

const Contact: React.FC = () => {
    const { t } = useLanguage();
    /* The widget is an iframe served by Cloudflare, so it is the one panel on
       the page the stylesheet cannot re-ink. It is told the edition instead,
       or it sits on night stock as a white card with a hole punched round it. */
    const edition = useEdition();
    const [activeSection, setActiveSection] = useState<'hero' | 'form'>('hero');
    const isScrolling = useRef(false);
    const touchStartY = useRef<number | null>(null);
    const [token, setToken] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    /* The site key comes from the server rather than the bundle. It is public
       either way, but fetching it means rotating the Turnstile pair is an env
       change and a restart instead of a rebuild and a redeploy. Until it
       arrives the widget is not mounted, so nobody is shown a captcha that
       cannot be solved. */
    const [siteKey, setSiteKey] = useState<string>('');

    useEffect(() => {
        let cancelled = false;
        fetch('/api/config')
            .then((r) => (r.ok ? r.json() : null))
            .then((cfg) => {
                if (!cancelled && cfg?.turnstileSiteKey) setSiteKey(cfg.turnstileSiteKey);
            })
            .catch(() => {
                /* No key, no widget: the address beside the form still works. */
            });
        return () => {
            cancelled = true;
        };
    }, []);

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
        <div className="w-full h-screen overflow-hidden bg-paper relative">
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
                                initial={{ letterSpacing: "0.24em", opacity: 0 }}
                                animate={{ letterSpacing: "0.06em", opacity: 1 }}
                                className="kicker mb-12"
                            >
                                {t.contact.kicker}
                            </motion.span>
                            <h1 className="flex flex-col items-center masthead uppercase mb-12 select-none text-center">
                                <motion.span
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="block"
                                >
                                    {t.contact.titleLead}
                                </motion.span>
                                <motion.span
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="headline-accent block"
                                >
                                    {t.contact.titleAccent}
                                </motion.span>
                            </h1>
                            <div className="flex flex-col items-center gap-12 pointer-events-auto">
                                <a className="inline-flex min-h-11 items-center text-xl lowercase text-ink transition-opacity hover:opacity-70 md:text-2xl" href="mailto:contact@eguven.dev">
                                    <span className="marker">contact@eguven.dev</span>
                                </a>
                                <button
                                    onClick={() => setActiveSection('form')}
                                    className="group flex flex-col items-center gap-4 text-[10px] tracking-[0.3em] uppercase text-ink-muted hover:text-ink transition-all"
                                >
                                    <span>{t.contact.sendDirect}</span>
                                    <ArrowDown className="animate-bounce mt-4 opacity-50 group-hover:opacity-100" size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                            <div className="absolute top-24 left-6 right-6 h-px bg-rule"></div>
                            <div className="absolute bottom-24 left-6 right-6 h-px bg-rule"></div>
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
                        className="absolute inset-0 flex items-center justify-center p-6 bg-paper overflow-y-auto"
                    >
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="container mx-auto px-6 md:px-24 pt-48 md:pt-12 pb-12"
                        >
                            <motion.div variants={itemVariants} className="mb-8 md:mb-16">
                                <span className="kicker hidden md:inline-block mb-4">{t.contact.formKicker}</span>
                                <h2 className="masthead uppercase leading-none">
                                    <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--color-rule-strong)' }}>{t.contact.formTitleOutline}</span>
                                    <span className="text-ink block md:inline md:ml-6">{t.contact.formTitleSolid}</span>
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
                                                <label className="block text-[9px] font-bold tracking-[0.3em] text-ink-muted uppercase mb-2 md:mb-4 group-focus-within:text-ink transition-colors">{t.contact.nameLabel}</label>
                                                <input name="name" required className="w-full bg-transparent border-b border-rule-strong py-2 md:py-2 text-base md:text-sm focus:outline-none focus:border-ink transition-all text-ink font-light" placeholder={t.contact.namePlaceholder} type="text" />
                                            </div>
                                            <div className="relative group">
                                                <label className="block text-[9px] font-bold tracking-[0.3em] text-ink-muted uppercase mb-2 md:mb-4 group-focus-within:text-ink transition-colors">{t.contact.emailLabel}</label>
                                                <input name="email" required className="w-full bg-transparent border-b border-rule-strong py-2 md:py-2 text-base md:text-sm focus:outline-none focus:border-ink transition-all text-ink font-light" placeholder={t.contact.emailPlaceholder} type="email" />
                                            </div>
                                        </div>
                                        <div className="relative group text-left">
                                            <label className="block text-[9px] font-bold tracking-[0.3em] text-ink-muted uppercase mb-2 md:mb-4 group-focus-within:text-ink transition-colors">{t.contact.messageLabel}</label>
                                            <textarea name="message" required className="w-full bg-transparent border-b border-rule-strong py-2 md:py-2 text-base md:text-sm focus:outline-none focus:border-ink transition-all text-ink font-light min-h-[80px] md:min-h-[120px] resize-none" placeholder={t.contact.messagePlaceholder}></textarea>
                                        </div>
                                        <div className="flex justify-start">
                                            {siteKey && (
                                                <Turnstile
                                                    siteKey={siteKey}
                                                    onSuccess={setToken}
                                                    onExpire={() => setToken('')}
                                                    onError={() => setToken('')}
                                                    options={{ theme: edition === 'late' ? 'dark' : 'light', size: 'flexible' }}
                                                    className="w-full"
                                                />
                                            )}
                                        </div>
                                        <div className="pt-2 flex justify-start items-center">
                                            <button disabled={!token || status === 'sending'} className="group relative overflow-hidden bg-ink text-paper-raised border border-ink px-10 py-4 text-[11px] tracking-[0.2em] uppercase font-bold transition-colors hover:bg-accent hover:border-accent disabled:opacity-60 disabled:cursor-not-allowed">
                                                <span className="relative z-10 flex items-center gap-4">
                                                    {status === 'sending' ? t.contact.sending : status === 'success' ? t.contact.sent : t.contact.send} <ArrowRight size={14} />
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => setActiveSection('hero')}
                                                className="ml-8 text-[10px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink transition-all"
                                            >
                                                {t.contact.back}
                                            </button>
                                        </div>
                                    </form>
                                </motion.section>

                                <motion.aside variants={itemVariants} className="lg:w-2/5 flex flex-col gap-12">
                                    <div className="border-t-2 border-ink pt-6">
                                        <h3 className="label border-b border-rule pb-2 mb-8">{t.contact.channels}</h3>
                                        <div className="space-y-6">
                                            <div className="group cursor-pointer">
                                                <a className="text-lg font-light text-ink-body group-hover:text-ink transition-colors flex items-center gap-3" href="mailto:contact@eguven.dev">
                                                    <Mail size={16} /> contact@eguven.dev
                                                </a>
                                            </div>
                                            <div className="group cursor-pointer">
                                                <a
                                                    className="text-lg font-light text-ink-body group-hover:text-ink transition-colors flex items-center gap-3"
                                                    href="https://github.com/azorkai"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Github size={16} /> azorkai
                                                </a>
                                            </div>
                                            <div className="group cursor-pointer">
                                                <a
                                                    className="text-lg font-light text-ink-body group-hover:text-ink transition-colors flex items-center gap-3"
                                                    href="https://www.linkedin.com/in/eguvendev/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Linkedin size={16} /> emirhan-guven
                                                </a>
                                            </div>
                                            <div className="group cursor-pointer">
                                                <a
                                                    className="text-lg font-light text-ink-body group-hover:text-ink transition-colors flex items-center gap-3"
                                                    href="https://x.com/e_guvenn"
                                                    aria-label="X"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Twitter size={16} /> e_guvenn
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t-2 border-ink pt-6 mt-2 text-left">
                                        <p className="text-xs text-ink-muted mb-6 font-light">{t.contact.availability}</p>
                                        <a className="inline-flex items-center gap-3 border border-ink px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-ink hover:bg-ink hover:text-paper-raised transition-all" href="#">
                                            <Calendar size={14} /> {t.contact.bookCall}
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
