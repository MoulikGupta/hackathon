import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
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
        <div className="min-h-screen pt-24 px-6 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-mono mb-4">
                    <Trophy className="w-3 h-3" /> Campus Legends
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-medium text-white mb-4">Leaderboard</h1>
                <p className="text-secondary">Earn Karma by uploading quality resources and helping others.</p>
            </motion.div>

            {contributors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Trophy className="w-6 h-6 text-zinc-600" />
                    </div>
                    <h3 className="text-white font-medium mb-1">No contributors yet</h3>
                    <p className="text-zinc-500 text-sm">Be the first to upload a resource!</p>
                </div>
            ) : (
                <>
                    {/* Top 3 Podium */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                        {/* 2nd Place */}
                        {topContributors[1] && (
                            <GlassCard className="order-2 md:order-1 flex flex-col items-center border-t-4 border-t-zinc-400">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold mb-4 -mt-10 border-4 border-[#0A0A0F]">2</div>
                                {topContributors[1].avatar_url ? (
                                    <img src={topContributors[1].avatar_url} alt="" className="w-16 h-16 rounded-full mb-3 object-cover border border-white/10" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-zinc-700 mb-3 flex items-center justify-center text-xl font-bold">{getInitials(topContributors[1].name)}</div>
                                )}
                                <h3 className="font-display text-lg text-white">{topContributors[1].name}</h3>
                                <p className="text-xs text-secondary font-mono mb-2">{topContributors[1].branch}{topContributors[1].semester ? ` • Sem ${topContributors[1].semester}` : ''}</p>
                                <div className="text-primary font-bold">{topContributors[1].karma} KP</div>
                            </GlassCard>
                        )}

                        {/* 1st Place */}
                        {topContributors[0] && (
                            <GlassCard className="order-1 md:order-2 flex flex-col items-center border-t-4 border-t-yellow-500 scale-110 shadow-[0_0_30px_rgba(234,179,8,0.2)] z-10">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500">
                                    <Trophy className="w-10 h-10 fill-current" />
                                </div>
                                {topContributors[0].avatar_url ? (
                                    <img src={topContributors[0].avatar_url} alt="" className="w-20 h-20 rounded-full mt-6 mb-3 object-cover border-2 border-yellow-500/50" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 mb-3 flex items-center justify-center text-2xl font-bold mt-6">{getInitials(topContributors[0].name)}</div>
                                )}
                                <h3 className="font-display text-xl text-white">{topContributors[0].name}</h3>
                                <p className="text-xs text-secondary font-mono mb-2">{topContributors[0].branch}{topContributors[0].semester ? ` • Sem ${topContributors[0].semester}` : ''}</p>
                                <div className="text-yellow-500 font-bold text-xl">{topContributors[0].karma} KP</div>
                                <div className="mt-2 px-2 py-0.5 rounded bg-yellow-500/20 text-[10px] text-yellow-500 border border-yellow-500/20">
                                    Top Contributor
                                </div>
                            </GlassCard>
                        )}

                        {/* 3rd Place */}
                        {topContributors[2] && (
                            <GlassCard className="order-3 md:order-3 flex flex-col items-center border-t-4 border-t-orange-700">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold mb-4 -mt-10 border-4 border-[#0A0A0F]">3</div>
                                {topContributors[2].avatar_url ? (
                                    <img src={topContributors[2].avatar_url} alt="" className="w-16 h-16 rounded-full mb-3 object-cover border border-white/10" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-zinc-700 mb-3 flex items-center justify-center text-xl font-bold">{getInitials(topContributors[2].name)}</div>
                                )}
                                <h3 className="font-display text-lg text-white">{topContributors[2].name}</h3>
                                <p className="text-xs text-secondary font-mono mb-2">{topContributors[2].branch}{topContributors[2].semester ? ` • Sem ${topContributors[2].semester}` : ''}</p>
                                <div className="text-primary font-bold">{topContributors[2].karma} KP</div>
                            </GlassCard>
                        )}
                    </div>

                    {/* List View */}
                    {restContributors.length > 0 && (
                        <div className="space-y-3">
                            {restContributors.map((contributor, index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={contributor.id}
                                    className="flex items-center justify-between p-4 bg-[#121217] border border-white/5 rounded-lg hover:border-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-zinc-500 text-sm w-6">{String(index + 4).padStart(2, '0')}</span>
                                        {contributor.avatar_url ? (
                                            <img src={contributor.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white">
                                                {contributor.name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-sm font-medium text-white">{contributor.name}</h4>
                                            <p className="text-[10px] text-zinc-500">{contributor.branch}{contributor.semester ? ` • Sem ${contributor.semester}` : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <span className="block text-xs text-white font-medium">{contributor.uploads}</span>
                                            <span className="block text-[10px] text-zinc-600">Uploads</span>
                                        </div>
                                        <div className="font-mono font-bold text-primary">{contributor.karma} KP</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Leaderboard;
