import React, { useEffect, useState } from 'react';
import { Mail, Github, Linkedin, Twitter, ArrowUp, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/useLanguage';

const Footer: React.FC = () => {
    const { t } = useLanguage();
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString(t.footer.locale, {
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
    }, [t.footer.locale]);

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
        <footer className="relative mt-24 border-t-2 border-ink bg-paper-sunk/60 py-20 px-6 overflow-hidden">

            <div className="absolute top-[3px] left-0 w-full h-px bg-rule-strong" />

            <div className="container mx-auto max-w-7xl">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start"
                >

                    <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left gap-6">
                        <motion.div variants={itemVariants} className="text-3xl font-display font-extrabold tracking-tight text-ink">
                            EG<span className="text-ink-faint">.</span>
                        </motion.div>
                        <motion.p variants={itemVariants} className="text-sm text-ink-muted leading-relaxed max-w-sm">
                            {t.footer.bio}
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex gap-4">
                            {[
                                { icon: <Mail size={18} />, href: "mailto:contact@eguven.dev", label: t.footer.emailAria, external: false },
                                { icon: <Github size={18} />, href: "https://github.com/azorkai", label: "GitHub", external: true },
                                { icon: <Linkedin size={18} />, href: "https://www.linkedin.com/in/eguvendev/", label: "LinkedIn", external: true },
                                { icon: <Twitter size={18} />, href: "https://x.com/e_guvenn", label: "X", external: true }
                            ].map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    aria-label={social.label}
                                    target={social.external ? "_blank" : undefined}
                                    rel={social.external ? "noopener noreferrer" : undefined}
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex h-11 w-11 items-center justify-center rounded-sm border border-rule text-ink-muted transition-colors hover:bg-ink hover:text-paper-raised"
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </motion.div>
                    </div>


                    <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left gap-4">
                        <motion.h4 variants={itemVariants} className="label border-b border-rule pb-2 w-full">{t.footer.navigation}</motion.h4>
                        <ul className="flex flex-col gap-0.5 lg:gap-3">
                            {[
                                { label: t.footer.linkProjects, href: '/' },
                                { label: t.footer.linkArticles, href: '/articles' },
                                { label: t.footer.linkContact, href: '/contact' },
                                { label: t.footer.linkMachine, href: '/ai' },
                            ].map((item) => (
                                <motion.li key={item.label} variants={itemVariants}>
                                    <a href={item.href} className="inline-flex min-h-11 items-center text-[15px] text-ink-muted transition-colors hover:text-ink lg:min-h-0 lg:text-sm">
                                        {item.label}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </div>


                    <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left gap-4">
                        <motion.h4 variants={itemVariants} className="label border-b border-rule pb-2 w-full">{t.footer.localTime}</motion.h4>
                        <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start gap-2">
                            <div className="text-3xl font-semibold tracking-tight tabular-nums text-ink">
                                {currentTime}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-ink-muted">
                                <span className="w-1.5 h-1.5 bg-ink rounded-full" />
                                <span className="marker">{t.footer.available}</span>
                            </div>
                        </motion.div>
                    </div>


                    <div className="md:col-span-2 flex justify-center md:justify-end items-start mt-8 md:mt-0">
                        <motion.button
                            onClick={scrollToTop}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group flex flex-col items-center gap-4 text-ink-muted hover:text-ink transition-colors"
                        >
                            <div className="w-12 h-12 rounded-full border border-ink bg-paper-raised flex items-center justify-center group-hover:bg-ink group-hover:text-paper-raised transition-all">
                                <ArrowUp size={20} />
                            </div>
                            <span className="text-[9px] uppercase tracking-[0.3em] font-bold">{t.footer.top}</span>
                        </motion.button>
                    </div>
                </motion.div>


                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-20 pt-6 border-t border-rule flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <div className="folio text-center md:text-left">
                        {t.footer.rights}
                    </div>
                    <div className="folio flex items-center gap-2 text-center">
                        <Globe size={12} className="shrink-0" />
                        {t.footer.madeIn}
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
