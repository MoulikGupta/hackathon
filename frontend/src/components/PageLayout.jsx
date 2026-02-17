import React from 'react';
import { motion } from 'framer-motion';

const PageLayout = ({ children, title, subtitle, action }) => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 selection:text-white pt-24 pb-12 px-6">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1"
                    >
                        {subtitle && (
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-xs font-mono text-white/50 uppercase tracking-widest">{subtitle}</span>
                            </div>
                        )}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-white tracking-tight">
                            {title}
                        </h1>
                    </motion.div>

                    {action && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {action}
                        </motion.div>
                    )}
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default PageLayout;
