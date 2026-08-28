import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/useLanguage';

const NothingHere: React.FC = () => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const scrollAttempts = React.useRef(0);
    const threshold = 5;

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                scrollAttempts.current = 0;
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    useEffect(() => {
        const handleScroll = (e: WheelEvent) => {
            if (isVisible) return;
            const isAtBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 5;

            if (isAtBottom && e.deltaY > 0) {
                scrollAttempts.current += 1;
                if (scrollAttempts.current >= threshold) {
                    setIsVisible(true);
                }
            }
        };


        let touchStart = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStart = e.touches[0].pageY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isVisible) return;
            const isAtBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 5;
            const touchCurrent = e.touches[0].pageY;

            if (isAtBottom && touchStart > touchCurrent) {
                scrollAttempts.current += 1;
                if (scrollAttempts.current >= threshold * 5) {
                    setIsVisible(true);
                }
            }
        };

        window.addEventListener('wheel', handleScroll);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);

        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: '20vh', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                    className="flex items-center justify-center overflow-hidden bg-paper-sunk/60 border-t border-rule"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            opacity: { duration: 0.5 },
                            y: { duration: 0.8, ease: "easeIn" }
                        }}
                        className="text-center"
                    >
                        <h3 className="text-base md:text-lg font-headline italic tracking-[0.18em] text-ink-muted uppercase">
                            {t.nothingHere}
                        </h3>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "40px" }}
                            exit={{ width: 0 }}
                            transition={{ delay: 0, duration: 0.5 }}
                            className="h-[1px] bg-rule-strong mx-auto mt-4"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NothingHere;
