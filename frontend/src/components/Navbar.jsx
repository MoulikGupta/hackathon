import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'SOLUTIONS', path: '/browse' },
        { name: 'RESOURCES', path: '/upload' },
        { name: 'PARTNERS', path: '/leaderboard' },
        { name: 'COMPANY', path: '/profile' },
    ];

    return (
        <>
            {/* Floating Pill Navbar — inspired by KZero */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
            >
                <div
                    className={cn(
                        "flex items-center justify-between w-full max-w-6xl px-6 py-3 transition-all duration-500 ease-out",
                        isScrolled
                            ? "bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_0_60px_rgba(0,0,0,0.5)]"
                            : "bg-transparent border border-transparent"
                    )}
                >
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2.5 group">
                        <div className="flex items-center gap-1">
                            <div className="w-7 h-7 bg-primary flex items-center justify-center">
                                <span className="text-black font-bold text-sm font-mono">K</span>
                            </div>
                            <div className="w-7 h-7 border border-white/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                <span className="text-white font-bold text-sm font-mono">Z</span>
                            </div>
                        </div>
                        <span className="font-mono text-sm tracking-wider text-white/80 hidden sm:inline">
                            INSPIRE
                        </span>
                    </NavLink>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => cn(
                                    "relative px-4 py-2 text-[11px] font-mono uppercase tracking-wider transition-colors duration-200",
                                    isActive
                                        ? "text-white"
                                        : "text-white/50 hover:text-white/80"
                                )}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute bottom-0 left-2 right-2 h-[1px] bg-primary"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <NavLink
                            to="/browse"
                            className="px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-white/70 border border-white/20 hover:border-white/40 transition-colors"
                        >
                            LOGIN
                        </NavLink>
                        <NavLink
                            to="/upload"
                            className="px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-black bg-primary hover:bg-[#ff7a5c] transition-colors"
                        >
                            GET STARTED FREE
                        </NavLink>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden text-white/70 hover:text-white transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[60] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center"
                    >
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center gap-8">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.path}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <NavLink
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-2xl font-display font-medium text-white/80 hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </NavLink>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
