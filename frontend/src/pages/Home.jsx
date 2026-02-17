import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Key, Fingerprint, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import RevealText from '../components/ui/RevealText';

/* ───────────── HERO ───────────── */
const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* ── Background: Liquid Mesh & Aura ── */}
            <div className="absolute inset-0 z-0 bg-black">

                {/* 1. Base Mesh Gradients (Animated) */}
                <div className="absolute inset-0 opacity-60">
                    <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/30 rounded-full blur-[120px] animate-float" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />
                </div>

                {/* 2. Liquid Waves (Bottom) - Simulating the Video */}
                <div className="absolute bottom-0 left-0 right-0 h-[80vh] overflow-hidden">
                    {/* Primary Blue Wave */}
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.1, 1],
                            opacity: [0.4, 0.6, 0.4]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-[20%] left-[10%] w-[80vw] h-[60vh] bg-gradient-to-t from-[#0033ff] to-transparent blur-[100px] rounded-[100%]"
                    />

                    {/* Secondary Cyan/Purple Accents */}
                    <motion.div
                        animate={{
                            x: [0, 50, 0],
                            y: [0, -30, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-[10%] right-[20%] w-[40vw] h-[40vh] bg-gradient-to-t from-[#6600ff] via-[#00ccff] to-transparent blur-[80px] opacity-30 rounded-full"
                    />

                    {/* Central Glow */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-[#0055ff]/20 blur-[90px] rounded-t-full" />
                </div>

                {/* 3. Vignette & Edge Aura (The KZero Look) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_100%)] z-10" />
                <div className="absolute inset-0 kzero-aura z-10 opacity-50 pointer-events-none" />

                {/* 4. Noise Texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.05] z-0 mix-blend-overlay pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* ── Content ── */}
            <div className="relative z-20 text-center max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center">

                {/* Tag */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70">
                        KZero Protocol v1.0
                    </span>
                </motion.div>

                {/* Main Headline - Character Reveal */}
                <div className="flex flex-col items-center justify-center">
                    <RevealText
                        text="Share Knowledge."
                        className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[6rem] font-medium text-white tracking-tight mb-0 md:mb-2 justify-center"
                        delay={0.2}
                    />
                    <RevealText
                        text="Ace Everything."
                        className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[6rem] font-medium text-white tracking-tight mb-0 md:mb-2 justify-center"
                        delay={0.6}
                    />
                    <RevealText
                        text="Built for Students."
                        className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[6rem] font-medium text-primary tracking-tight justify-center"
                        delay={1.0}
                    />
                </div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.6 }}
                    className="mt-8 text-sm sm:text-base font-mono uppercase tracking-[0.1em] text-white/50 max-w-2xl mx-auto leading-relaxed"
                >
                    The centralized open-source hub for campus resources.
                    <br className="hidden md:block" />
                    Notes, papers, and projects — curated by the top 1% of students.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.8 }}
                    className="flex flex-wrap items-center justify-center gap-4 mt-10"
                >
                    <Button
                        size="lg"
                        onClick={() => navigate('/browse')}
                        className="gap-2 shadow-[0_0_30px_rgba(248,92,58,0.3)] hover:shadow-[0_0_50px_rgba(248,92,58,0.5)] transition-shadow duration-500"
                    >
                        START BROWSING <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/upload')}
                        className="group"
                    >
                        <span className="group-hover:text-primary transition-colors">UPLOAD RESOURCE</span>
                    </Button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
            >
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30">Scroll</span>
                <div className="w-px h-12 bg-white/10 overflow-hidden relative">
                    <motion.div
                        animate={{ y: [-48, 48] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-primary to-transparent"
                    />
                </div>
            </motion.div>
        </section>
    );
};

/* ───────────── FEATURES (KZero-style horizontal cards) ───────────── */
const features = [
    {
        icon: Shield,
        title: "Curated Resources",
        desc: "Every upload is verified by top contributors. Access only the highest quality notes and papers.",
    },
    {
        icon: Key,
        title: "One-Click Access",
        desc: "No sign-up friction. Browse, download, and contribute to the community instantly.",
    },
    {
        icon: Fingerprint,
        title: "Smart Discovery",
        desc: "AI-powered search finds exactly what you need — filter by subject, semester, or professor.",
    },
    {
        icon: Lock,
        title: "Campus Verified",
        desc: "Only authenticated students can upload. Built-in plagiarism checks ensure originality.",
    },
];

const Features = () => (
    <section className="relative py-32 overflow-hidden bg-black z-10">
        {/* Subtle divider glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
            >
                <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-primary mb-4">
                    <span className="text-white/40">/</span> PLATFORM FEATURES
                </span>
                <h2 className="font-display text-4xl md:text-6xl font-medium text-white mt-2">
                    Fortified. Fast. Frictionless.
                </h2>
            </motion.div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feat, i) => (
                    <motion.div
                        key={feat.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className="group relative p-10 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
                    >
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                            <feat.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-display text-2xl font-medium text-white mb-3">
                            {feat.title}
                        </h3>
                        <p className="text-sm text-white/50 leading-relaxed font-mono">
                            {feat.desc}
                        </p>

                        {/* Hover glow */}
                        <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.06), transparent 40%)' }} />
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

/* ───────────── STATISTICS ───────────── */
const Statistics = () => (
    <section className="relative py-32 overflow-hidden bg-black z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-12"
            >
                {[
                    { value: '5,000+', label: 'Resources' },
                    { value: '1,200+', label: 'Students' },
                    { value: '45K+', label: 'Downloads' },
                    { value: '12', label: 'Universities' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="text-center group"
                    >
                        <div className="font-display text-5xl md:text-6xl font-medium text-white group-hover:text-primary transition-colors duration-300 tracking-tight">
                            {stat.value}
                        </div>
                        <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

/* ───────────── CTA SECTION ───────────── */
const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative py-40 overflow-hidden bg-black z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="font-display text-5xl md:text-7xl font-medium text-white mb-8 leading-tight">
                        Unlock the Future of
                        <br />
                        <span className="text-primary">Campus Learning.</span>
                    </h2>
                    <p className="text-sm font-mono uppercase tracking-[0.15em] text-white/40 mb-12 max-w-xl mx-auto">
                        Join thousands of students already sharing and discovering the best academic resources.
                    </p>
                    <Button size="lg" onClick={() => navigate('/browse')} className="gap-2 px-10 h-14 text-sm">
                        GET STARTED <ArrowRight className="w-4 h-4" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

/* ───────────── HOME PAGE ───────────── */
const Home = () => (
    <div className="w-full bg-black min-h-screen">
        <Hero />
        <Features />
        <Statistics />
        <CTASection />
    </div>
);

export default Home;
