import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

const Leaderboard = () => {
    const topContributors = [
        { id: 1, name: "Sarah Chen", karma: 2450, uploads: 42, role: "CSE • 3rd Sem", badge: "Top Contributor" },
        { id: 2, name: "Rahul Verma", karma: 1890, uploads: 35, role: "CSE • 4th Sem", badge: "Rising Star" },
        { id: 3, name: "Mike Ross", karma: 1650, uploads: 28, role: "ECE • 3rd Sem", badge: "Helpful Hand" },
        { id: 4, name: "Priya Singh", karma: 1420, uploads: 25, role: "CSE • 5th Sem", badge: "Expert" },
        { id: 5, name: "Alex Doe", karma: 1200, uploads: 20, role: "MECH • 4th Sem", badge: "Contributor" },
    ];

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

            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                {/* 2nd Place */}
                <GlassCard className="order-2 md:order-1 flex flex-col items-center border-t-4 border-t-zinc-400">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold mb-4 -mt-10 border-4 border-[#0A0A0F]">2</div>
                    <div className="w-16 h-16 rounded-full bg-zinc-700 mb-3 flex items-center justify-center text-xl font-bold">RV</div>
                    <h3 className="font-display text-lg text-white">{topContributors[1].name}</h3>
                    <p className="text-xs text-secondary font-mono mb-2">{topContributors[1].role}</p>
                    <div className="text-primary font-bold">{topContributors[1].karma} KP</div>
                </GlassCard>

                {/* 1st Place */}
                <GlassCard className="order-1 md:order-2 flex flex-col items-center border-t-4 border-t-yellow-500 scale-110 shadow-[0_0_30px_rgba(234,179,8,0.2)] z-10">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500">
                        <Trophy className="w-10 h-10 fill-current" />
                    </div>
                    <div className="w-20 h-20 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 mb-3 flex items-center justify-center text-2xl font-bold mt-6">SC</div>
                    <h3 className="font-display text-xl text-white">{topContributors[0].name}</h3>
                    <p className="text-xs text-secondary font-mono mb-2">{topContributors[0].role}</p>
                    <div className="text-yellow-500 font-bold text-xl">{topContributors[0].karma} KP</div>
                    <div className="mt-2 px-2 py-0.5 rounded bg-yellow-500/20 text-[10px] text-yellow-500 border border-yellow-500/20">
                        Top Contributor
                    </div>
                </GlassCard>

                {/* 3rd Place */}
                <GlassCard className="order-3 md:order-3 flex flex-col items-center border-t-4 border-t-orange-700">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold mb-4 -mt-10 border-4 border-[#0A0A0F]">3</div>
                    <div className="w-16 h-16 rounded-full bg-zinc-700 mb-3 flex items-center justify-center text-xl font-bold">MR</div>
                    <h3 className="font-display text-lg text-white">{topContributors[2].name}</h3>
                    <p className="text-xs text-secondary font-mono mb-2">{topContributors[2].role}</p>
                    <div className="text-primary font-bold">{topContributors[2].karma} KP</div>
                </GlassCard>
            </div>

            {/* List View */}
            <div className="space-y-3">
                {topContributors.slice(3).map((user, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-[#121217] border border-white/5 rounded-lg hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-zinc-500 text-sm w-4">0{index + 4}</span>
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-white">{user.name}</h4>
                                <p className="text-[10px] text-zinc-500">{user.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <span className="block text-xs text-white font-medium">{user.uploads}</span>
                                <span className="block text-[10px] text-zinc-600">Uploads</span>
                            </div>
                            <div className="font-mono font-bold text-primary">{user.karma} KP</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
