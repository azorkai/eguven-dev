import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/useLanguage';
import { rich } from '../i18n/rich';

const Hero: React.FC = () => {
    const [logClickCount, setLogClickCount] = useState(0);
    const { t } = useLanguage();

    const glitchVariants = {
        glitch: {
            x: [0, 4, -4, 2, -2, 0],
            y: [0, -2, 2, -1, 1, 0],
            color: ["#9c3b28", "#3d6a82", "#b98a26", "#9c3b28"],
            transition: {
                duration: 0.2,
                repeat: 3,
                ease: "linear" as const
            }
        }
    };

    return (
        <header className="container mx-auto px-6 md:px-24 pt-32 md:pt-28 pb-24 md:pb-28">
            <div className="relative">
                <div className="mb-6"><span className="kicker">{t.hero.kicker}</span></div>
                <h1 className="masthead uppercase mb-8 select-none">
                    {t.hero.titleLead}{' '}
                    <motion.span
                        animate={logClickCount >= 5 ? "glitch" : ""}
                        variants={glitchVariants}
                        onAnimationComplete={() => logClickCount >= 5 && setLogClickCount(0)}
                        onClick={() => setLogClickCount(prev => prev + 1)}
                        className="headline-accent inline-block cursor-pointer"
                    >
                        {t.hero.titleAccent}
                    </motion.span>
                </h1>
                <div className="rule-double mb-8 max-w-3xl" />
                <p className="standfirst measure">
                    {rich(t.hero.standfirst)}
                </p>
            </div>
        </header>
    );
};

export default Hero;
