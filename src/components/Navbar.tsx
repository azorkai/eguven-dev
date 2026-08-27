import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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

    return (
        <>
            <nav className="fixed top-0 left-0 w-full py-8 px-6 md:px-12 flex justify-between items-center z-50 mix-blend-difference pointer-events-none">
                <NavLink to="/" className="text-2xl font-display font-bold tracking-tighter text-white z-50 pointer-events-auto">
                    <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>EG</motion.span>
                </NavLink>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-12 text-xs tracking-widest font-semibold text-gray-400 pointer-events-auto">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `hover:text-white transition-colors hover-underline-animation flex items-center ${isActive ? 'text-white border-b border-white pb-1' : ''}`
                        }
                    >
                        <motion.span whileHover={{ y: -2 }} whileTap={{ y: 2 }}>PROJECTS</motion.span>
                    </NavLink>
                    <NavLink
                        to="/articles"
                        className={({ isActive }) =>
                            `hover:text-white transition-colors hover-underline-animation flex items-center ${isActive ? 'text-white border-b border-white pb-1' : ''}`
                        }
                    >
                        <motion.span whileHover={{ y: -2 }} whileTap={{ y: 2 }}>ARTICLES</motion.span>
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            `hover:text-white transition-colors hover-underline-animation flex items-center ${isActive ? 'text-white border-b border-white pb-1' : ''}`
                        }
                    >
                        <motion.span whileHover={{ y: -2 }} whileTap={{ y: 2 }}>CONTACT</motion.span>
                    </NavLink>
                </div>

                {/* Mobile Hamburger Button Container (Hidden on Desktop) */}
                <div className="md:hidden pointer-events-auto">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        <div className="w-6 flex flex-col items-end gap-1.5">
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                className="h-0.5 w-full bg-white block"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="h-0.5 w-2/3 bg-white block"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: -45, y: -8, width: '100%' } : { rotate: 0, y: 0, width: '100%' }}
                                className="h-0.5 w-full bg-white block"
                            />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay - OUTSIDE mix-blend-difference */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-[#0a0a0a] z-[45] flex flex-col items-center justify-center space-y-12 md:hidden"
                    >
                        <NavLink
                            to="/"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `text-4xl font-display font-black tracking-widest transition-all ${isActive ? 'text-white' : 'text-gray-700 hover:text-white'}`
                            }
                        >
                            <motion.span initial={{ y: 20 }} animate={{ y: 0 }}>PROJECTS</motion.span>
                        </NavLink>
                        <NavLink
                            to="/articles"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `text-4xl font-display font-black tracking-widest transition-all ${isActive ? 'text-white' : 'text-gray-700 hover:text-white'}`
                            }
                        >
                            <motion.span initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.1 }}>ARTICLES</motion.span>
                        </NavLink>
                        <NavLink
                            to="/contact"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `text-4xl font-display font-black tracking-widest transition-all ${isActive ? 'text-white' : 'text-gray-700 hover:text-white'}`
                            }
                        >
                            <motion.span initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>CONTACT</motion.span>
                        </NavLink>

                        <div className="absolute bottom-12 flex gap-8">
                            <a href="https://github.com/azorkai" className="text-gray-500 text-xs tracking-widest">GITHUB</a>
                            <a href="https://linkedin.com/in/eguvendev" className="text-gray-500 text-xs tracking-widest">LINKEDIN</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
