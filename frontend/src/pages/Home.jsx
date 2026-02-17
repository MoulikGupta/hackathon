import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Key, Fingerprint, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import HeroScroll from '../components/scrollytelling/HeroScroll';
import FeatureScroll from '../components/scrollytelling/FeatureScroll'; // This was previously HeroScroll, but checking the file it seems I am using ScrollSequence inside HeroScroll? 
// Wait, the previous replacement in step 638 replaced Hero with `HeroScroll`.
// Let's check `HeroScroll.jsx` content first. I might have confused myself. 
// If `HeroScroll` uses `ScrollSequence`, I should wrap it there. 
// Step 638 Diff shows: `import HeroScroll from '../components/scrollytelling/HeroScroll';` and usage `<HeroScroll />`.
// So I should check `HeroScroll.jsx` to see if it instantiates `ScrollSequence`.


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
                <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-primary mb-4">
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
                        className="group relative p-10 rounded-none border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-brand-primary/50 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
                    >
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-none bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-6 group-hover:bg-brand-primary/20 transition-colors duration-300">
                            <feat.icon className="w-6 h-6 text-brand-primary" />
                        </div>
                        <h3 className="font-display text-2xl font-medium text-white mb-3">
                            {feat.title}
                        </h3>
                        <p className="text-sm text-white/50 leading-relaxed font-mono">
                            {feat.desc}
                        </p>
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
                        <div className="font-display text-5xl md:text-6xl font-medium text-white group-hover:text-brand-primary transition-colors duration-300 tracking-tight">
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
                        <span className="text-brand-primary">Campus Learning.</span>
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

import ErrorBoundary from '../components/ErrorBoundary';

/* ───────────── HOME PAGE ───────────── */
const Home = () => (
    <div className="w-full bg-black min-h-screen">
        <ErrorBoundary>
            <HeroScroll />
        </ErrorBoundary>
        <FeatureScroll />
        <Statistics />
        <CTASection />
    </div>
);

export default Home;
