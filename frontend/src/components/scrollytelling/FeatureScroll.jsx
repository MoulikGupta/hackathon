import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Key, Fingerprint, Lock } from 'lucide-react';

const features = [
    {
        num: '01',
        icon: Shield,
        title: "Curated Resources",
        desc: "Every upload is verified by top contributors. Access only the highest quality notes and papers.",
    },
    {
        num: '02',
        icon: Key,
        title: "One-Click Access",
        desc: "No sign-up friction. Browse, download, and contribute to the community instantly.",
    },
    {
        num: '03',
        icon: Fingerprint,
        title: "Smart Discovery",
        desc: "AI-powered search finds exactly what you need — filter by subject, semester, or professor.",
    },
    {
        num: '04',
        icon: Lock,
        title: "Campus Verified",
        desc: "Only authenticated students can upload. Built-in plagiarism checks ensure originality.",
    },
];

/* ─── Single Feature Card ─── */
const FeatureCard = ({ feature, index, scrollYProgress }) => {
    const total = features.length;
    const cardWidth = 240;
    const gap = 16;

    // Staggered entrance delay per card
    const staggerDelay = index * 0.04;

    // --- Y position: start off-screen below, rise up ---
    const y = useTransform(
        scrollYProgress,
        [0, 0.15 + staggerDelay, 0.4, 0.7],
        [600, 200, 0, 0]
    );

    // --- X position: start stacked center, fan out ---
    const centerOffset = (index - (total - 1) / 2) * (cardWidth + gap);
    const x = useTransform(
        scrollYProgress,
        [0, 0.3, 0.55, 0.7],
        [0, 0, centerOffset, centerOffset]
    );

    // --- Rotation while fanning ---
    const rotateZ = useTransform(
        scrollYProgress,
        [0, 0.2, 0.4, 0.65],
        [0, (index - 1.5) * 4, (index - 1.5) * 2, 0]
    );

    // --- Scale ---
    const scale = useTransform(
        scrollYProgress,
        [0, 0.2, 0.5, 0.7],
        [0.7, 0.85, 1, 1]
    );

    // --- Opacity removed: cards are always fully visible once in viewport ---

    // --- 3D perspective tilt ---
    const rotateY = useTransform(
        scrollYProgress,
        [0.3, 0.5, 0.7],
        [(index - 1.5) * 8, (index - 1.5) * 3, 0]
    );

    // --- Glow intensity ---
    const glowOpacity = useTransform(
        scrollYProgress,
        [0.6, 0.85],
        [0, 1]
    );

    const Icon = feature.icon;

    return (
        <motion.div
            style={{
                x,
                y,
                rotateZ,
                rotateY,
                scale,
                transformPerspective: 1200,
                transformOrigin: 'center bottom',
                zIndex: total - index,
            }}
            className="absolute w-[260px] h-[360px] opacity-100"
        >
            {/* Card — high-visibility dark card */}
            <div className="relative w-full h-full rounded-none border border-white/20 backdrop-blur-md overflow-hidden flex flex-col p-6 transition-all duration-500 hover:border-primary/60 hover:bg-zinc-800/60"
                style={{ background: 'linear-gradient(145deg, rgba(30, 30, 35, 0.95) 0%, rgba(20, 20, 24, 0.95) 100%)' }}
            >

                {/* Glow overlay on scroll completion */}
                <motion.div
                    style={{ opacity: glowOpacity }}
                    className="absolute inset-0 pointer-events-none bg-gradient-to-t from-primary/5 to-transparent"
                />

                {/* Number badge */}
                <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase mb-6">
                    {feature.num}
                </span>

                {/* Icon — high contrast container */}
                <div className="w-14 h-14 rounded-none border border-primary/40 bg-primary/15 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-primary drop-shadow-[0_0_10px_rgba(248,92,58,0.6)]" />
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-semibold text-white mb-3 tracking-tight">
                    {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-zinc-300 leading-relaxed font-mono flex-1">
                    {feature.desc}
                </p>

                {/* Bottom accent line — brand primary */}
                <motion.div
                    style={{ opacity: glowOpacity }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_15px_rgba(248,92,58,0.8)]"
                />
            </div>
        </motion.div>
    );
};

/* ─── Main FeatureScroll Section ─── */
const FeatureScroll = () => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Section header animations
    const headerOpacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [0, 0, 1]);
    const headerY = useTransform(scrollYProgress, [0, 0.15, 0.25], [40, 40, 0]);

    // Bottom description
    const descOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);
    const descY = useTransform(scrollYProgress, [0.7, 0.85], [30, 0]);

    return (
        <div ref={containerRef} className="relative bg-black h-[300vh]">
            {/* Sticky viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

                {/* Section header */}
                <motion.div
                    style={{ opacity: headerOpacity, y: headerY }}
                    className="absolute top-[8vh] text-center z-20 pointer-events-none"
                >
                    <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-primary mb-3">
                        <span className="text-white/40">/</span> PLATFORM FEATURES
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl font-medium text-white mt-2">
                        Fortified. Fast. Frictionless.
                    </h2>
                </motion.div>

                {/* Cards Container */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={feature.title}
                            feature={feature}
                            index={index}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>

                {/* Bottom description */}
                <motion.div
                    style={{ opacity: descOpacity, y: descY }}
                    className="absolute bottom-[8vh] max-w-2xl text-center z-20 px-6 pointer-events-none"
                >
                    <p className="text-sm font-mono text-white/50 leading-relaxed tracking-wide uppercase">
                        <span className="inline-block w-2 h-2 bg-primary rounded-none mr-2 align-middle" />
                        Notes Sphere unifies essential academic tools into a single platform.
                        Reduce complexity, find resources fast, and collaborate with
                        your campus community.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default FeatureScroll;
