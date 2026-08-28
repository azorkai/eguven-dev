import { motion } from 'framer-motion';

const TransitionEffect = () => {
    const nbOfColumns = 5;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] flex">
            {[...Array(nbOfColumns)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ height: "100%" }}
                    animate={{ height: "0%" }}
                    exit={{ height: "100%" }}
                    transition={{
                        duration: 0.8,
                        ease: [0.76, 0, 0.24, 1],
                        delay: 0.05 * i
                    }}
                    className="relative w-full h-full bg-paper-edge"
                />
            ))}
        </div>
    );
};

export default TransitionEffect;
