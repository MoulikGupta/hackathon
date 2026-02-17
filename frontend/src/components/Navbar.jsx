import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, Menu, X, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            if (location.pathname === '/') {
                // Home: Show navbar only after scrolling past heavy hero (approx 2.5 screens)
                setIsVisible(window.scrollY > window.innerHeight * 2.5);
            } else {
                // Other pages: Always visible
                setIsVisible(true);
            }
        };

        handleScroll(); // Check on mount/route change
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const navLinks = [
        { name: 'RESOURCES', path: '/browse' },
        { name: 'STUDY AI', path: '/ai' },
        { name: 'UPLOAD', path: '/upload' },
        { name: 'LEADERBOARD', path: '/leaderboard' },
        { name: 'DASHBOARD', path: '/profile' },
    ];

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user) return '';
        const name = user.user_metadata?.full_name || user.email || '';
        if (user.user_metadata?.full_name) {
            const parts = name.split(' ');
            return parts.length >= 2
                ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                : name.substring(0, 2).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <>
            {/* Floating Pill Navbar — inspired by StudySync */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
            >
                <div
                    className={cn(
                        "flex items-center justify-between w-full max-w-6xl px-6 py-3 transition-all duration-500 ease-out",
                        "bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_0_60px_rgba(0,0,0,0.5)]"
                    )}
                >
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2.5 group">
                        <span className="font-bold text-lg font-mono">
                            <span className="text-primary">Notes</span>
                            <span className="text-white"> Sphere</span>
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
                        {user ? (
                            <>
                                {/* User Avatar */}
                                <NavLink
                                    to="/profile"
                                    className="flex items-center gap-2 group"
                                >
                                    {user.user_metadata?.avatar_url ? (
                                        <img
                                            src={user.user_metadata.avatar_url}
                                            alt="Avatar"
                                            className="w-8 h-8 rounded-full border border-white/20 group-hover:border-primary/50 transition-colors object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                            <span className="text-[10px] font-mono font-bold text-white/70">
                                                {getUserInitials()}
                                            </span>
                                        </div>
                                    )}
                                </NavLink>

                                {/* Sign Out Button */}
                                <button
                                    onClick={handleSignOut}
                                    className="px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-white/70 border border-white/20 hover:border-red-500/50 hover:text-red-400 transition-colors flex items-center gap-2 cursor-pointer"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    SIGN OUT
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className="px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-white/70 border border-white/20 hover:border-white/40 transition-colors"
                                >
                                    LOGIN
                                </NavLink>
                                <NavLink
                                    to="/login"
                                    className="px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-black bg-primary hover:bg-[#ff7a5c] transition-colors"
                                >
                                    GET STARTED FREE
                                </NavLink>
                            </>
                        )}
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

                            {/* Mobile Auth Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: navLinks.length * 0.1 }}
                                className="mt-4 pt-4 border-t border-white/10"
                            >
                                {user ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            {user.user_metadata?.avatar_url ? (
                                                <img
                                                    src={user.user_metadata.avatar_url}
                                                    alt="Avatar"
                                                    className="w-10 h-10 rounded-full border border-white/20 object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
                                                    <span className="text-xs font-mono font-bold text-white/70">
                                                        {getUserInitials()}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="text-sm text-white/70 font-mono">
                                                {user.user_metadata?.full_name || user.email}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="text-red-400 hover:text-red-300 text-sm font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <NavLink
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-xl font-display font-medium text-primary hover:text-[#ff7a5c] transition-colors"
                                    >
                                        LOGIN
                                    </NavLink>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
