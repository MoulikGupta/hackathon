import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollSequence from './ScrollSequence';
import Button from '../ui/Button';

const HeroScroll = () => {
    const { scrollYProgress } = useScroll();

    // Phase 1: 0% - 20% (Stacked) -> "SHARE KNOWLEDGE"
    const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.15, 0.2], [0, 1, 1, 0]);
    const text1Y = useTransform(scrollYProgress, [0, 0.1, 0.2], [50, 0, -50]);

    // Phase 2: 25% - 45% (Lifting) -> "ACE EVERYTHING"
    const text2Opacity = useTransform(scrollYProgress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0]);
    const text2Y = useTransform(scrollYProgress, [0.25, 0.3, 0.45], [50, 0, -50]);

    // Phase 3: 50% - 70% (Scattering) -> "BUILT FOR STUDENTS"
    const text3Opacity = useTransform(scrollYProgress, [0.5, 0.55, 0.65, 0.7], [0, 1, 1, 0]);
    const text3Y = useTransform(scrollYProgress, [0.5, 0.55, 0.7], [50, 0, -50]);

    // Phase 4: 75% - 100% (Exploded Finale) -> "StudySync"
    const text4Opacity = useTransform(scrollYProgress, [0.75, 0.8, 1], [0, 1, 1]);
    const text4Scale = useTransform(scrollYProgress, [0.75, 1], [0.9, 1]);

    return (
        <div className="relative bg-black">
            {/* Scroll Container Height (500vh) */}
            <div className="h-[500vh] relative">

                {/* Sticky Viewport */}
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {/* Canvas Background (z-0) */}
                    <ScrollSequence />

                    {/* Gradient Overlay to Hide Watermark (z-5) */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent z-0 pointer-events-none" />

                    {/* Text Overlays (z-10) */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">

                        {/* Phase 1 Text */}
                        <motion.div
                            style={{ opacity: text1Opacity, y: text1Y }}
                            className="absolute text-center"
                        >
                            <h1 className="font-mono text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter uppercase whitespace-nowrap">
                                SHARE KNOWLEDGE
                            </h1>
                        </motion.div>

                        {/* Phase 2 Text */}
                        <motion.div
                            style={{ opacity: text2Opacity, y: text2Y }}
                            className="absolute text-center"
                        >
                            <h1 className="font-mono text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter uppercase whitespace-nowrap">
                                ACE EVERYTHING
                            </h1>
                        </motion.div>

                        {/* Phase 3 Text */}
                        <motion.div
                            style={{ opacity: text3Opacity, y: text3Y }}
                            className="absolute text-center"
                        >
                            <h1 className="font-mono text-5xl md:text-7xl lg:text-8xl font-bold text-brand-primary tracking-tighter uppercase whitespace-nowrap">
                                BUILT FOR STUDENTS
                            </h1>
                        </motion.div>

                        {/* Phase 4 Text (Finale) */}
                        <motion.div
                            style={{ opacity: text4Opacity, scale: text4Scale }}
                            className="absolute flex flex-col items-center justify-center gap-8 pointer-events-auto"
                        >
                            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-white uppercase tracking-tight">
                                StudySync
                            </h1>

                            <Button
                                variant="primary"
                                className="bg-brand-primary text-white hover:bg-white hover:text-brand-primary transition-colors duration-300 px-12 py-6 text-lg rounded-none font-mono tracking-widest border border-brand-primary font-bold"
                            >
                                ENTER NOW
                            </Button>
                        </motion.div>

                    </div>

                    {/* Scroll Indicator Hint */}
                    <motion.div
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 font-mono text-xs tracking-[0.2em]"
                    >
                        SCROLL TO EXPLORE
                    </motion.div>

                </div>
            </div>

            {/* Spacer to allow scrolling past if needed, 
          though typically scrollytelling ends here or leads to footer. 
          For now, this is the main interaction. */}
        </div>
    );
};

export default HeroScroll;
