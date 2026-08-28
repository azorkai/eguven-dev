import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/useLanguage';
import LanguageToggle from './LanguageToggle';

/* Below this many pixels the bar stays transparent and lets the masthead
   breathe. Past it, it becomes a printed strip: opaque stock, a rule under it,
   tighter leading. */
const SOLID_AFTER = 32;

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isSolid, setIsSolid] = React.useState(false);
    const { t } = useLanguage();

    /* One passive listener, throttled to a frame, and it only sets state when
       the boolean actually flips. Scrolling the page does not re-render the
       navbar on every event. */
    React.useEffect(() => {
        let frame = 0;
        let last = window.scrollY > SOLID_AFTER;
        setIsSolid(last);
        const read = () => {
            frame = 0;
            const next = window.scrollY > SOLID_AFTER;
            if (next !== last) {
                last = next;
                setIsSolid(next);
            }
        };
        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(read);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, []);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (!isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = 'auto';
    };

    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        `hover:text-ink transition-colors hover-underline-animation flex min-h-11 items-center ${isActive ? 'text-ink border-b-2 border-ink' : 'text-ink-muted'
        }`;

    return (
        <>
            <nav
                className={`fixed left-0 z-50 flex w-full items-center justify-between px-6 transition-[background-color,border-color,padding,box-shadow] duration-200 md:px-12 ${isSolid
                    ? 'pointer-events-auto border-b border-rule-strong bg-paper-raised py-4 shadow-sm'
                    : 'pointer-events-none border-b border-transparent py-8'
                    }`}
                style={{ top: 'var(--machine-bar-h, 0px)' }}
            >
                <NavLink to="/" className="pointer-events-auto z-50 flex h-11 items-center text-2xl font-display tracking-tight text-ink" aria-label={t.nav.home}>
                    <motion.span whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} className="inline-block border border-ink rounded-sm px-2 pt-1 pb-0.5 leading-none bg-paper-raised">EG</motion.span>
                </NavLink>

                <div className="flex items-center gap-3 md:gap-8">
                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-12 text-[11px] tracking-[0.28em] font-semibold uppercase pointer-events-auto">
                        <NavLink to="/" className={linkClasses}>
                            <motion.span whileHover={{ y: -2 }} whileTap={{ y: 2 }}>{t.nav.projects}</motion.span>
                        </NavLink>
                        <NavLink to="/articles" className={linkClasses}>
                            <motion.span whileHover={{ y: -2 }} whileTap={{ y: 2 }}>{t.nav.articles}</motion.span>
                        </NavLink>
                        <NavLink to="/contact" className={linkClasses}>
                            <motion.span whileHover={{ y: -2 }} whileTap={{ y: 2 }}>{t.nav.contact}</motion.span>
                        </NavLink>
                    </div>

                    {/* Edition switch. Sits with the other controls, never inside
                        the link list: it changes the page, it does not go to one. */}
                    <LanguageToggle className="pointer-events-auto border border-rule bg-paper-raised md:border-transparent md:bg-transparent" />

                    {/* Mobile Hamburger Button Container (Hidden on Desktop) */}
                    <div className="md:hidden pointer-events-auto">
                        <button
                            onClick={toggleMenu}
                            aria-label={isMobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
                            aria-expanded={isMobileMenuOpen}
                            className="flex h-11 w-11 items-center justify-center rounded-sm border border-rule bg-paper-raised text-ink focus:outline-none"
                        >
                            <div className="w-5 flex flex-col items-end gap-1">
                                <motion.span
                                    animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                    className="h-0.5 w-full bg-ink block"
                                />
                                <motion.span
                                    animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                    className="h-0.5 w-2/3 bg-ink block"
                                />
                                <motion.span
                                    animate={isMobileMenuOpen ? { rotate: -45, y: -6, width: '100%' } : { rotate: 0, y: 0, width: '100%' }}
                                    className="h-0.5 w-full bg-ink block"
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-paper z-[45] flex flex-col items-center justify-center space-y-10 md:hidden px-8"
                    >
                        <span className="label absolute top-10 left-8">{t.nav.sectionIndex}</span>
                        <div className="rule-hair absolute top-16 left-8 right-8" />

                        <NavLink
                            to="/"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `text-4xl font-display font-extrabold uppercase tracking-tight transition-all ${isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'}`
                            }
                        >
                            <motion.span initial={{ y: 20 }} animate={{ y: 0 }}>{t.nav.projects}</motion.span>
                        </NavLink>
                        <div className="rule-hair w-24" />
                        <NavLink
                            to="/articles"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `text-4xl font-display font-extrabold uppercase tracking-tight transition-all ${isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'}`
                            }
                        >
                            <motion.span initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.1 }}>{t.nav.articles}</motion.span>
                        </NavLink>
                        <div className="rule-hair w-24" />
                        <NavLink
                            to="/contact"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `text-4xl font-display font-extrabold uppercase tracking-tight transition-all ${isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'}`
                            }
                        >
                            <motion.span initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>{t.nav.contact}</motion.span>
                        </NavLink>

                        <div className="absolute bottom-8 left-8 right-8 flex justify-between border-t border-rule pt-2">
                            <a href="https://github.com/azorkai" className="folio flex min-h-11 items-center pr-4 transition-colors hover:text-ink">{t.nav.github}</a>
                            <a href="https://linkedin.com/in/eguvendev" className="folio flex min-h-11 items-center pl-4 transition-colors hover:text-ink">{t.nav.linkedin}</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
