import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setComplete(true);
            setTimeout(onComplete, 800);
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!complete && (
                <motion.div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
                    exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
                >
                    {/* Logo animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-2 mb-12"
                    >
                        <div className="w-10 h-10 bg-primary flex items-center justify-center">
                            <span className="text-black font-bold text-lg font-mono">K</span>
                        </div>
                        <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                            <span className="text-white font-bold text-lg font-mono">Z</span>
                        </div>
                    </motion.div>

                    {/* Loading bar */}
                    <div className="w-48 h-[2px] bg-white/5 overflow-hidden">
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-full bg-primary"
                        />
                    </div>

                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 text-[10px] font-mono uppercase tracking-[0.3em] text-white/30"
                    >
                        Loading Resources
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
