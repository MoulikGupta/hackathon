import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const RevealText = ({ text, className, delay = 0, lineHeight = "1.05" }) => {
    // Split text into words, then characters to handle spacing correctly
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: delay }
        })
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.h1
            style={{ lineHeight }}
            className={cn("flex flex-wrap overflow-hidden", className)}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, index) => (
                <span key={index} className="flex select-none mr-[0.25em]">
                    {Array.from(word).map((char, charIndex) => (
                        <motion.span variants={child} key={charIndex}>
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </motion.h1>
    );
};

export default RevealText;
