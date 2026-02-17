import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="min-h-screen w-full flex items-center justify-center bg-background text-primary px-6">
            <div className="max-w-4xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-zinc-800/50 border border-zinc-700 text-xs tracking-wider text-zinc-400 mb-6 backdrop-blur-sm">
                        WELCOME TO INSPIRE
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                    className="text-5xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500"
                >
                    Discover New <br />
                    Perspectives.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
                    className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                >
                    Dive into a curated world of knowledge. Explore the depths of imagination through our digital library.
                </motion.p>
            </div>
        </section>
    );
};

export default Hero;
