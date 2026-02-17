import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Medal, Upload, Star, Plus, Save, CheckCircle, LogOut } from 'lucide-react';
import Button from '../components/ui/Button';
import ResourceCard from '../components/ResourceCard';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/AuthContext';
import { fetchUserResources, deleteResource } from '../lib/api';

const Profile = () => {
    const { user, profile, isProfileComplete, updateProfile, signOut } = useAuth();
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
            if (!isProfileComplete) setShowProfileForm(true);
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

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
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

    const inputClass = "w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-primary/50 focus:outline-none focus:bg-white/5 transition-all placeholder:text-zinc-700";
    const labelClass = "text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 block";

    return (
        <PageLayout
            title="Dashboard"
            subtitle="My Profile"
            action={
                <div className="flex gap-3">
                    <Button variant="outline" className="h-10 px-4 text-xs border-white/10 hover:bg-white/5" onClick={handleSignOut}>
                        <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
                    </Button>
                    <Button variant="primary" className="h-10 px-4 text-xs" onClick={() => navigate('/upload')}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> New Upload
                    </Button>
                </div>
            }
        >
            {/* Profile Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* User Card */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-white/10 bg-[#121217]">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-zinc-900 to-[#1a1a20]" />
                    <div className="absolute top-0 left-0 w-full h-32 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />

                    <div className="relative px-8 pt-16 mt-2 flex flex-col md:flex-row items-start gap-6">
                        <div className="w-24 h-24 rounded-2xl border-4 border-[#121217] shadow-xl overflow-hidden bg-zinc-800 flex items-center justify-center text-3xl font-bold text-white">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                getInitials()
                            )}
                        </div>

                        <div className="flex-1 pb-8">
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-display font-bold text-white">{displayName}</h2>
                                <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-mono border border-yellow-500/20 flex items-center gap-1">
                                    <Medal className="w-3 h-3" /> Level {Math.floor(karma / 500) + 1}
                                </span>
                            </div>
                            <p className="text-zinc-500 text-sm mb-4">
                                {profile?.college || 'No college set'} • {profile?.branch || 'No branch'}
                            </p>
                            <div className="flex gap-3">
                                <Button variant="secondary" className="h-8 text-xs bg-white/5 border border-white/10 hover:bg-white/10" onClick={() => setShowProfileForm(!showProfileForm)}>
                                    <Settings className="w-3 h-3 mr-2" /> Edit Details
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                    <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 border border-yellow-500/20">
                                <Star className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Karma Points</span>
                        </div>
                        <div>
                            <div className="text-3xl font-display font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors">{karma}</div>
                            <p className="text-xs text-zinc-500">Top 5% of contributors</p>
                        </div>
                    </div>
                    <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20">
                                <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Uploads</span>
                        </div>
                        <div>
                            <div className="text-3xl font-display font-bold text-white mb-1 group-hover:text-blue-500 transition-colors">{totalUploads}</div>
                            <p className="text-xs text-zinc-500">Resources shared</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <AnimatePresence>
                {showProfileForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-12"
                    >
                        <div className="p-6 bg-[#121217] border border-white/10 rounded-2xl relative">
                            <h2 className="text-lg font-display text-white mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" /> Edit Profile
                            </h2>
                            <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className={labelClass}>Full Name</label><input type="text" value={profileForm.full_name} onChange={(e) => setProfileForm(p => ({ ...p, full_name: e.target.value }))} className={inputClass} /></div>
                                <div><label className={labelClass}>College</label><input type="text" value={profileForm.college} onChange={(e) => setProfileForm(p => ({ ...p, college: e.target.value }))} className={inputClass} required /></div>
                                <div><label className={labelClass}>Branch</label><input type="text" value={profileForm.branch} onChange={(e) => setProfileForm(p => ({ ...p, branch: e.target.value }))} className={inputClass} required /></div>
                                <div>
                                    <label className={labelClass}>Semester</label>
                                    <select value={profileForm.semester} onChange={(e) => setProfileForm(p => ({ ...p, semester: e.target.value }))} className={inputClass + ' appearance-none'}>
                                        <option value="" className="bg-zinc-900 text-white">Select</option>{['1', '2', '3', '4', '5', '6', '7', '8'].map(s => <option key={s} value={s} className="bg-zinc-900 text-white">Semester {s}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2"><label className={labelClass}>Bio</label><textarea value={profileForm.bio} onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))} rows={2} className={inputClass + ' resize-none'} /></div>
                                <div className="md:col-span-2 flex justify-end gap-3">
                                    <Button type="button" variant="outline" onClick={() => setShowProfileForm(false)} className="border-white/10 hover:bg-white/5">Cancel</Button>
                                    <Button type="submit" disabled={saving}>
                                        {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* My Uploads */}
            <div>
                <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-white/10" /> My Contributions
                </h3>

                {loading ? (
                    <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
                ) : myResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myResources.map((resource, i) => (
                            <ResourceCard key={resource.id} resource={resource} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-6 h-6 text-zinc-600" />
                        </div>
                        <h3 className="text-white font-medium mb-1">No uploads yet</h3>
                        <p className="text-zinc-500 text-sm mb-6">Start contributing to the community!</p>
                        <Button onClick={() => navigate('/upload')}>Upload Resource</Button>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default Profile;
