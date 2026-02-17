import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const Login = () => {
    const { user, loading, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate('/profile', { replace: true });
        }
    }, [user, loading, navigate]);

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black">

            {/* ── Background Effects ── */}
            <div className="absolute inset-0 z-0">
                {/* Animated gradient blobs */}
                <div className="absolute inset-0 opacity-60">
                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            scale: [1, 1.15, 1],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-15%] left-[-10%] w-[45vw] h-[45vw] bg-blue-900/25 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            y: [0, 20, 0],
                            x: [0, 30, 0],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] bg-purple-900/20 rounded-full blur-[120px]"
                    />
                </div>

                {/* Central glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vh] bg-primary/5 blur-[100px] rounded-full" />

                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_100%)]" />

                {/* Noise texture */}
                <div
                    className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* ── Login Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-10">

                    {/* Subtle top border glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="flex items-center gap-1">
                            <div className="w-8 h-8 bg-primary flex items-center justify-center">
                                <span className="text-black font-bold text-sm font-mono">S</span>
                            </div>
                            <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
                                <span className="text-white font-bold text-sm font-mono">S</span>
                            </div>
                        </div>
                        <span className="font-mono text-sm tracking-wider text-white/80">
                            INSPIRE
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h1 className="font-display text-2xl font-medium text-white mb-2">
                            Welcome back
                        </h1>
                        <p className="text-xs font-mono uppercase tracking-wider text-white/40">
                            Sign in to access your account
                        </p>
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        onClick={signInWithGoogle}
                        className="w-full group relative flex items-center justify-center gap-3 h-12 px-6 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-pointer"
                    >
                        <GoogleIcon />
                        <span className="text-sm font-mono uppercase tracking-wider text-white/80 group-hover:text-white transition-colors">
                            Continue with Google
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-white/20">
                            Secured by Supabase
                        </span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Info text */}
                    <p className="text-center text-[11px] text-white/30 leading-relaxed">
                        By continuing, you agree to StudySync Inspire's Terms of Service and Privacy Policy.
                    </p>

                    {/* Bottom corner glow */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
