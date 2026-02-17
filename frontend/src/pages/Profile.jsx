import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Medal, Download, Upload, Star, Plus, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import ResourceCard from '../components/ResourceCard';
import { useAuth } from '../context/AuthContext';
import { fetchResources, deleteResource } from '../lib/api';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myResources, setMyResources] = useState([]);
    const [loading, setLoading] = useState(true);

    // Build profile from real auth data
    const profile = {
        name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
        email: user?.email || '',
        avatar_url: user?.user_metadata?.avatar_url || null,
        role: "CSE • Student",
    };

    useEffect(() => {
        if (user) loadMyResources();
    }, [user]);

    const loadMyResources = async () => {
        setLoading(true);
        try {
            const data = await fetchResources({ user_id: user.id });
            setMyResources(data.resources || []);
        } catch (err) {
            console.error('Failed to load resources:', err);
            setMyResources([]);
        } finally {
            setLoading(false);
        }
    };

    // Compute stats from real data
    const totalUploads = myResources.length;
    const totalDownloads = myResources.reduce((sum, r) => sum + (r.downloads || 0), 0);
    const avgRating = myResources.length > 0
        ? (myResources.reduce((sum, r) => sum + (parseFloat(r.avg_rating) || 0), 0) / myResources.length).toFixed(1)
        : '0.0';
    const karma = totalUploads * 50 + totalDownloads;

    // Get initials for fallback avatar
    const getInitials = () => {
        const name = profile.name;
        const parts = name.split(' ');
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resource?')) return;
        try {
            await deleteResource(id);
            setMyResources(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 max-w-6xl mx-auto pb-12">

            {/* Header Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-12">
                {/* Banner */}
                <div className="h-48 w-full bg-gradient-to-r from-zinc-900 to-[#121217] rounded-xl border border-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                </div>

                {/* Profile Info */}
                <div className="px-6 relative flex flex-col md:flex-row items-start md:items-end -mt-16 gap-6">
                    <div className="w-32 h-32 rounded-xl border-4 border-[#0A0A0F] shadow-xl flex items-center justify-center text-4xl font-bold text-white relative z-10 overflow-hidden">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
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
                            <Button variant="primary" className="h-10 px-4 text-xs" onClick={() => navigate('/upload')}>
                                <Plus className="w-3.5 h-3.5 mr-1" /> Upload Resource
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                    { label: 'Karma Points', value: karma, icon: Star, color: 'text-yellow-500' },
                    { label: 'Total Uploads', value: totalUploads, icon: Upload, color: 'text-blue-400' },
                    { label: 'Downloads Received', value: totalDownloads, icon: Download, color: 'text-green-400' },
                    { label: 'Avg Rating', value: avgRating, icon: Medal, color: 'text-purple-400' }
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

            {/* My Uploads */}
            <div className="mb-8 border-b border-white/5">
                <div className="flex gap-8">
                    <button className="pb-4 text-sm font-medium text-white border-b-2 border-primary">My Uploads</button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
            ) : myResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myResources.map((resource, i) => (
                        <ResourceCard key={resource.id} resource={resource} index={i} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-lg">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-6 h-6 text-zinc-600" />
                    </div>
                    <h3 className="text-white font-medium mb-1">No uploads yet</h3>
                    <p className="text-zinc-500 text-sm mb-4">Start contributing to the community!</p>
                    <Button onClick={() => navigate('/upload')}>Upload Your First Resource</Button>
                </div>
            )}
        </div>
    );
};

export default Profile;
