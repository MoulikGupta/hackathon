import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, X, FileText, CheckCircle, AlertCircle, Lock, Globe, Tag } from 'lucide-react';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';
import { uploadResource } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Upload = () => {
    const { user } = useAuth();
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        department: 'CSE',
        semester: '1st Sem',
        type: 'Notes',
        description: '',
        tags: '',
        year_batch: '2024-25',
        privacy: 'public',
    });

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !formData.title || !formData.subject) return;

        setUploading(true);
        setError('');

        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('title', formData.title);
            fd.append('subject', formData.subject);
            fd.append('department', formData.department);
            fd.append('semester', formData.semester);
            fd.append('type', formData.type);
            fd.append('description', formData.description);
            fd.append('year_batch', formData.year_batch);
            fd.append('privacy', formData.privacy);
            // Send tags as JSON array
            const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
            fd.append('tags', JSON.stringify(tagsArray));
            // College from user metadata
            fd.append('college', user?.user_metadata?.college || '');

            await uploadResource(fd);
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
                setFile(null);
                setFormData({
                    title: '', subject: '', department: 'CSE', semester: '1st Sem',
                    type: 'Notes', description: '', tags: '', year_batch: '2024-25', privacy: 'public',
                });
            }, 3000);
        } catch (err) {
            setError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const inputClass = "w-full bg-[#121217] border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none transition-colors placeholder:text-zinc-700";
    const labelClass = "text-xs font-mono text-secondary uppercase tracking-wider";

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl md:text-4xl font-display font-medium text-white mb-2">Upload Resource</h1>
                <p className="text-secondary text-sm">Contribute to the community and earn Karma points.</p>
            </motion.div>

            {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Col: Upload Zone + Guidelines */}
                <div className="lg:col-span-2 space-y-6">
                    <div
                        className={`relative h-56 border-2 border-dashed rounded-lg transition-all duration-300 flex flex-col items-center justify-center p-6 text-center ${dragActive ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    >
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                        <AnimatePresence mode="wait">
                            {file ? (
                                <motion.div key="file-preview" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center text-primary"><FileText className="w-7 h-7" /></div>
                                    <div className="text-center">
                                        <p className="text-white font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-xs text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button onClick={(e) => { e.preventDefault(); setFile(null); }} className="mt-1 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 z-10 relative"><X className="w-3 h-3" /> Remove</button>
                                </motion.div>
                            ) : (
                                <motion.div key="upload-prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 pointer-events-none">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center"><UploadIcon className="w-6 h-6 text-secondary" /></div>
                                    <div><p className="text-white font-medium text-sm">Drag & drop your file</p><p className="text-xs text-secondary mt-1">PDF, DOCX, PPT, Images (Max 50MB)</p></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Privacy Toggle */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, privacy: 'public' }))}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-mono transition-all cursor-pointer ${formData.privacy === 'public' ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'}`}
                        >
                            <Globe className="w-4 h-4" /> Public
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, privacy: 'private' }))}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-mono transition-all cursor-pointer ${formData.privacy === 'private' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'}`}
                        >
                            <Lock className="w-4 h-4" /> Private
                        </button>
                    </div>

                    <GlassCard className="space-y-3">
                        <h3 className="text-xs font-mono text-secondary uppercase tracking-widest flex items-center gap-2"><AlertCircle className="w-3 h-3 text-primary" /> Guidelines</h3>
                        <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4">
                            <li>Ensure content is clearly visible and readable.</li>
                            <li>Do not upload copyrighted material without permission.</li>
                            <li><strong>Public</strong> resources are visible to all users.</li>
                            <li><strong>Private</strong> resources are only visible to your college.</li>
                        </ul>
                    </GlassCard>
                </div>

                {/* Right Col: Metadata Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
                    <div className="space-y-1">
                        <label className={labelClass}>Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Data Structures Unit 1 Notes" className={inputClass} />
                    </div>

                    <div className="space-y-1">
                        <label className={labelClass}>Subject / Course Name *</label>
                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="e.g. Operating Systems" className={inputClass} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className={labelClass}>Department</label>
                            <select name="department" value={formData.department} onChange={handleChange} className={inputClass + ' appearance-none'}>
                                {['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'Common'].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className={labelClass}>Semester</label>
                            <select name="semester" value={formData.semester} onChange={handleChange} className={inputClass + ' appearance-none'}>
                                {['1st Sem', '2nd Sem', '3rd Sem', '4th Sem', '5th Sem', '6th Sem', '7th Sem', '8th Sem'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className={labelClass}>Resource Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} className={inputClass + ' appearance-none'}>
                                {['Notes', 'Question Paper', 'Solutions', 'Project Report', 'Study Material', 'Assignment', 'Lab Manual', 'Presentation'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className={labelClass}>Year / Batch</label>
                            <select name="year_batch" value={formData.year_batch} onChange={handleChange} className={inputClass + ' appearance-none'}>
                                {['2024-25', '2023-24', '2022-23', '2021-22', '2020-21'].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className={labelClass}>Description (optional)</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Brief description of the resource..." rows={3} className={inputClass + ' resize-none'} />
                    </div>

                    <div className="space-y-1">
                        <label className={labelClass}><Tag className="w-3 h-3 inline mr-1" />Tags / Keywords</label>
                        <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. data-structures, algorithms, mid-term (comma separated)" className={inputClass} />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full" disabled={uploading || !file || !formData.title || !formData.subject}>
                            {uploading ? (
                                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Uploading...</span>
                            ) : success ? (
                                <span className="flex items-center gap-2 text-green-400"><CheckCircle className="w-4 h-4" /> Uploaded Successfully!</span>
                            ) : (
                                "Publish Resource"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Upload;
