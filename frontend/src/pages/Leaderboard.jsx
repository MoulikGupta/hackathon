import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import PageLayout from '../components/PageLayout';
import { fetchLeaderboard } from '../lib/api';

const Leaderboard = () => {
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        setLoading(true);
        try {
            const data = await fetchLeaderboard();
            setContributors(data);
        } catch (err) {
            console.error('Failed to load leaderboard:', err);
            setContributors([]);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        const parts = (name || 'A').split(' ');
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : (name || 'A').substring(0, 2).toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-6 max-w-5xl mx-auto flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    const topContributors = contributors.slice(0, 3);
    const restContributors = contributors.slice(3);

    return (
        <PageLayout title="Leaderboard" subtitle="Top Contributors">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <p className="text-secondary mb-8 max-w-lg mx-auto">
                        Earn Karma Points (KP) by uploading high-quality resources. Verified uploads help the entire community.
                    </p>
                </motion.div>

                {contributors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Trophy className="w-6 h-6 text-zinc-600" />
                        </div>
                        <h3 className="text-white font-medium mb-1">No contributors yet</h3>
                        <p className="text-zinc-500 text-sm">Be the first to upload a resource!</p>
                    </div>
                ) : (
                    <>
                        {/* Top 3 Podium */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-end relative">
                            {/* Background Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

                            {/* 2nd Place */}
                            {topContributors[1] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="order-2 md:order-1 relative"
                                >
                                    <div className="bg-[#121217]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden group hover:border-white/20 transition-all">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-400" />
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center justify-center font-bold text-sm mb-6 shadow-lg">2</div>

                                        <div className="relative mb-4">
                                            {topContributors[1].avatar_url ? (
                                                <img src={topContributors[1].avatar_url} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-zinc-500/30" />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold border-2 border-zinc-500/30 text-zinc-400">{getInitials(topContributors[1].name)}</div>
                                            )}
                                        </div>

                                        <h3 className="font-display text-lg text-white mb-1">{topContributors[1].name}</h3>
                                        <p className="text-xs text-zinc-500 font-mono mb-3">{topContributors[1].branch}</p>
                                        <div className="px-3 py-1 bg-white/5 rounded-full text-zinc-300 font-mono text-sm font-bold border border-white/5">
                                            {topContributors[1].karma} KP
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 1st Place */}
                            {topContributors[0] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="order-1 md:order-2 relative z-10 -mt-12 md:-mt-0"
                                >
                                    <div className="bg-gradient-to-b from-[#1a1a23] to-[#0d0d12] backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-8 flex flex-col items-center relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.15)] transform md:-translate-y-8">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />
                                        <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none" />

                                        <div className="absolute -top-5">
                                            <Crown className="w-10 h-10 text-yellow-500 fill-yellow-500/20 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                        </div>

                                        <div className="relative mb-6 mt-4">
                                            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full" />
                                            {topContributors[0].avatar_url ? (
                                                <img src={topContributors[0].avatar_url} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-yellow-500/50 relative z-10" />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-yellow-900/20 flex items-center justify-center text-3xl font-bold border-4 border-yellow-500/50 text-yellow-500 relative z-10">{getInitials(topContributors[0].name)}</div>
                                            )}
                                        </div>

                                        <h3 className="font-display text-2xl text-white mb-2">{topContributors[0].name}</h3>
                                        <p className="text-xs text-yellow-500/60 font-mono mb-4 uppercase tracking-widest">{topContributors[0].branch} • Sem {topContributors[0].semester}</p>

                                        <div className="px-6 py-2 bg-yellow-500/10 rounded-full text-yellow-400 font-display text-xl font-bold border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                            {topContributors[0].karma} KP
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 3rd Place */}
                            {topContributors[2] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="order-3 md:order-3 relative"
                                >
                                    <div className="bg-[#121217]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden group hover:border-white/20 transition-all">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-orange-700" />
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 text-orange-700 border border-zinc-700 flex items-center justify-center font-bold text-sm mb-6 shadow-lg">3</div>

                                        <div className="relative mb-4">
                                            {topContributors[2].avatar_url ? (
                                                <img src={topContributors[2].avatar_url} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-orange-700/30" />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold border-2 border-orange-700/30 text-orange-700">{getInitials(topContributors[2].name)}</div>
                                            )}
                                        </div>

                                        <h3 className="font-display text-lg text-white mb-1">{topContributors[2].name}</h3>
                                        <p className="text-xs text-zinc-500 font-mono mb-3">{topContributors[2].branch}</p>
                                        <div className="px-3 py-1 bg-white/5 rounded-full text-zinc-300 font-mono text-sm font-bold border border-white/5">
                                            {topContributors[2].karma} KP
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* List View */}
                        {restContributors.length > 0 && (
                            <div className="space-y-3 max-w-4xl mx-auto">
                                <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 pl-2">Runner Ups</h3>
                                {restContributors.map((contributor, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (index * 0.05) }}
                                        key={contributor.id}
                                        className="flex items-center justify-between p-4 bg-[#121217] border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/[0.03] transition-colors group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className="font-mono text-zinc-600 text-sm w-6 group-hover:text-zinc-400 transition-colors">{String(index + 4).padStart(2, '0')}</span>

                                            <div className="flex items-center gap-4">
                                                {contributor.avatar_url ? (
                                                    <img src={contributor.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 font-bold border border-white/5">
                                                        {getInitials(contributor.name)}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="text-base font-medium text-white group-hover:text-primary transition-colors">{contributor.name}</h4>
                                                    <p className="text-[10px] text-zinc-500">{contributor.branch}{contributor.semester ? ` • Sem ${contributor.semester}` : ''}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-right hidden sm:block">
                                                <span className="block text-sm text-zinc-300 font-medium">{contributor.uploads}</span>
                                                <span className="block text-[10px] text-zinc-600 uppercase">Uploads</span>
                                            </div>
                                            <div className="font-mono font-bold text-primary w-16 text-right">{contributor.karma} KP</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default Leaderboard;
