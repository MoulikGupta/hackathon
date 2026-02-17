import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Medal, Upload, Star, Plus, Save, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import ResourceCard from '../components/ResourceCard';
import { useAuth } from '../context/AuthContext';
import { fetchUserResources, deleteResource } from '../lib/api';

const Profile = () => {
    const { user, profile, profileLoading, isProfileComplete, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [myResources, setMyResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [profileForm, setProfileForm] = useState({
        full_name: '',
        college: '',
        branch: '',
        semester: '',
        bio: '',
    });

    useEffect(() => {
        if (profile) {
            setProfileForm({
                full_name: profile.full_name || '',
                college: profile.college || '',
                branch: profile.branch || '',
                semester: profile.semester || '',
                bio: profile.bio || '',
            });
            // Show form if profile is incomplete
            if (!isProfileComplete) {
                setShowProfileForm(true);
            }
        }
    }, [profile, isProfileComplete]);

    useEffect(() => {
        if (user) loadMyResources();
    }, [user]);

    const loadMyResources = async () => {
        setLoading(true);
        try {
            const resources = await fetchUserResources(user.id);
            setMyResources(resources);
        } catch (err) {
            console.error('Failed to load resources:', err);
            setMyResources([]);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile(profileForm);
            setSaved(true);
            setShowProfileForm(false);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Failed to save profile:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resource?')) return;
        try {
            const resource = myResources.find(r => r.id === id);
            await deleteResource(id, resource?.file_path);
            setMyResources(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const totalUploads = myResources.length;
    const karma = totalUploads * 50;

    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
    const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || null;

    const getInitials = () => {
        const parts = displayName.split(' ');
        return parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : displayName.substring(0, 2).toUpperCase();
    };

    const inputClass = "w-full bg-[#121217] border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none transition-colors placeholder:text-zinc-700";
    const labelClass = "text-xs font-mono text-secondary uppercase tracking-wider";

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
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
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
                                    {displayName}
                                    <Medal className="w-5 h-5 text-yellow-500" />
                                </h1>
                                <p className="text-secondary font-mono text-sm">
                                    {profile?.branch || ''}{profile?.branch && profile?.semester ? ' • ' : ''}{profile?.semester ? `Semester ${profile.semester}` : ''}
                                </p>
                                <p className="text-zinc-500 text-sm mt-1">{profile?.college || user?.email}</p>
                                {profile?.bio && <p className="text-zinc-400 text-xs mt-2 max-w-md">{profile.bio}</p>}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="primary" className="h-10 px-4 text-xs" onClick={() => setShowProfileForm(!showProfileForm)}>
                                    <Settings className="w-3.5 h-3.5 mr-1" /> Edit Profile
                                </Button>
                                <Button variant="primary" className="h-10 px-4 text-xs" onClick={() => navigate('/upload')}>
                                    <Plus className="w-3.5 h-3.5 mr-1" /> Upload
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Profile Completion Form */}
            {showProfileForm && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 p-6 bg-[#121217] border border-white/10 rounded-lg"
                >
                    <h2 className="text-lg font-display text-white mb-1 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        {isProfileComplete ? 'Edit Profile' : 'Complete Your Profile'}
                    </h2>
                    {!isProfileComplete && (
                        <p className="text-xs text-zinc-400 mb-6">Please fill in your details to get started.</p>
                    )}
                    <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className={labelClass}>Full Name</label>
                            <input type="text" value={profileForm.full_name} onChange={(e) => setProfileForm(p => ({ ...p, full_name: e.target.value }))} placeholder="Your full name" className={inputClass} />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClass}>College *</label>
                            <input type="text" value={profileForm.college} onChange={(e) => setProfileForm(p => ({ ...p, college: e.target.value }))} placeholder="e.g. MIT Manipal" className={inputClass} required />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClass}>Branch *</label>
                            <input type="text" value={profileForm.branch} onChange={(e) => setProfileForm(p => ({ ...p, branch: e.target.value }))} placeholder="e.g. Computer Science" className={inputClass} required />
                        </div>
                        <div className="space-y-1">
                            <label className={labelClass}>Semester *</label>
                            <select value={profileForm.semester} onChange={(e) => setProfileForm(p => ({ ...p, semester: e.target.value }))} className={inputClass + ' appearance-none'} required>
                                <option value="">Select semester</option>
                                {['1', '2', '3', '4', '5', '6', '7', '8'].map(s => <option key={s} value={s}>Semester {s}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className={labelClass}>Bio (optional)</label>
                            <textarea value={profileForm.bio} onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))} placeholder="Tell us about yourself..." rows={2} className={inputClass + ' resize-none'} />
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" disabled={saving}>
                                {saving ? (
                                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Saving...</span>
                                ) : saved ? (
                                    <span className="flex items-center gap-2 text-green-400"><CheckCircle className="w-4 h-4" /> Saved!</span>
                                ) : (
                                    <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Profile</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                {[
                    { label: 'Karma Points', value: karma, icon: Star, color: 'text-yellow-500' },
                    { label: 'Total Uploads', value: totalUploads, icon: Upload, color: 'text-blue-400' },
                    { label: 'Semester', value: profile?.semester || '-', icon: Medal, color: 'text-purple-400' },
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
