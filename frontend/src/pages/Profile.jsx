import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Medal, Download, Upload, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import ResourceCard from '../components/ResourceCard';
import { MOCK_RESOURCES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    // Build profile from real auth data
    const profile = {
        name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
        email: user?.email || '',
        avatar_url: user?.user_metadata?.avatar_url || null,
        role: "CSE • Student",
        bio: "Exploring the depths of Computer Science. Always learning.",
        stats: {
            karma: 1250,
            uploads: 15,
            downloads: 450,
            avgRating: 4.8
        }
    };

    // Get initials for fallback avatar
    const getInitials = () => {
        const name = profile.name;
        const parts = name.split(' ');
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };

    const userUploads = MOCK_RESOURCES.slice(0, 3);

    return (
        <div className="min-h-screen pt-24 px-6 max-w-6xl mx-auto pb-12">

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-12"
            >
                {/* Banner */}
                <div className="h-48 w-full bg-gradient-to-r from-zinc-900 to-[#121217] rounded-xl border border-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Profile Info */}
                <div className="px-6 relative flex flex-col md:flex-row items-start md:items-end -mt-16 gap-6">
                    <div className="w-32 h-32 rounded-xl border-4 border-[#0A0A0F] shadow-xl flex items-center justify-center text-4xl font-bold text-white relative z-10 overflow-hidden">
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black"></div>
                                <span className="relative z-10">{getInitials()}</span>
                            </>
                        )}
                    </div>

                    <div className="flex-1 pb-2">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
                                    {profile.name}
                                    <Medal className="w-5 h-5 text-yellow-500" />
                                </h1>
                                <p className="text-secondary font-mono text-sm">{profile.role}</p>
                                <p className="text-zinc-500 text-sm mt-1 max-w-md">{profile.email}</p>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="ghost" className="h-10 px-4 text-xs">Edit Profile</Button>
                                <Button variant="primary" className="h-10 px-4 text-xs">Share Profile</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                    { label: 'Karma Points', value: profile.stats.karma, icon: Star, color: 'text-yellow-500' },
                    { label: 'Total Uploads', value: profile.stats.uploads, icon: Upload, color: 'text-blue-400' },
                    { label: 'Downloads Received', value: profile.stats.downloads, icon: Download, color: 'text-green-400' },
                    { label: 'Avg Rating', value: profile.stats.avgRating, icon: Medal, color: 'text-purple-400' }
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        key={i}
                        className="bg-[#121217] border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-[10px] uppercase tracking-wider text-secondary font-mono">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-display font-medium text-white">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Content Tabs */}
            <div className="mb-8 border-b border-white/5">
                <div className="flex gap-8">
                    <button className="pb-4 text-sm font-medium text-white border-b-2 border-primary">My Uploads</button>
                    <button className="pb-4 text-sm font-medium text-secondary hover:text-white transition-colors">Bookmarks</button>
                    <button className="pb-4 text-sm font-medium text-secondary hover:text-white transition-colors">History</button>
                </div>
            </div>

            {/* User Uploads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userUploads.map((resource, i) => (
                    <ResourceCard key={i} resource={resource} index={i} />
                ))}
            </div>

        </div>
    );
};

export default Profile;
