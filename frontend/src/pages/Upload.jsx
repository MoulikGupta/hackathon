import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, FileText, CheckCircle, X, AlertCircle, BookOpen, Layers, Type, Calendar, Globe, Lock, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import PageLayout from '../components/PageLayout';
import { uploadResource } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        semester: '',
        resource_type: '',
        year: new Date().getFullYear(),
        description: '',
        is_public: true,
        college: '',
        tags: []
    });

    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
        setError(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg']
        },
        maxSize: 10485760,
        multiple: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!file) {
            setError("Please select a file to upload.");
            return;
        }
        if (!formData.title || !formData.subject || !formData.semester || !formData.resource_type) {
            setError("Please fill in all required fields.");
            return;
        }

        setUploading(true);
        try {
            await uploadResource(file, { ...formData, user_id: user.id });
            setSuccess(true);
            setTimeout(() => navigate('/profile'), 2000);
        } catch (err) {
            console.error('Upload failed:', err);
            setError(err.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const inputBase = "w-full bg-zinc-900/80 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200";
    const labelBase = "text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5";

    /* ── Success State ── */
    if (success) {
        return (
            <PageLayout title="Upload Resource" subtitle="Contribute">
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20"
                    >
                        <CheckCircle className="w-12 h-12 text-green-400" />
                    </motion.div>
                    <h2 className="text-3xl font-display font-medium text-white mb-3">Upload Successful!</h2>
                    <p className="text-zinc-500 text-sm">Redirecting to your profile…</p>
                </div>
            </PageLayout>
        );
    }

    /* ── Main Upload Page ── */
    return (
        <PageLayout title="Upload Resource" subtitle="Contribute to Library">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">

                {/* ─── Upload Zone ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <div
                        {...getRootProps()}
                        className={`
                            relative rounded-2xl border-2 border-dashed p-10 md:p-14
                            flex flex-col items-center justify-center text-center
                            cursor-pointer transition-all duration-300
                            ${isDragActive
                                ? 'border-primary bg-primary/[0.06] shadow-[0_0_40px_rgba(248,92,58,0.12)]'
                                : file
                                    ? 'border-green-500/40 bg-green-500/[0.04]'
                                    : 'border-white/10 bg-zinc-900/50 hover:border-white/20 hover:bg-zinc-900/70'
                            }
                        `}
                    >
                        <input {...getInputProps()} />

                        <AnimatePresence mode="wait">
                            {file ? (
                                <motion.div
                                    key="file-preview"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                                        <FileText className="w-8 h-8 text-green-400" />
                                    </div>
                                    <p className="text-base font-medium text-white mb-1 break-all max-w-xs">{file.name}</p>
                                    <p className="text-xs text-zinc-500 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                        className="mt-5 text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/40 bg-red-500/5 transition-all"
                                    >
                                        <X className="w-3 h-3" /> Remove file
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="upload-prompt"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${isDragActive ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 border border-white/10'}`}>
                                        <UploadIcon className={`w-7 h-7 transition-colors ${isDragActive ? 'text-primary' : 'text-zinc-500'}`} />
                                    </div>
                                    <p className="text-base text-white font-medium mb-1">
                                        {isDragActive ? 'Drop your file here!' : 'Drag & drop your file here'}
                                    </p>
                                    <p className="text-sm text-zinc-500">
                                        or <span className="text-primary hover:underline">browse</span> to choose
                                    </p>
                                    <p className="text-[11px] text-zinc-600 font-mono mt-4 tracking-wide">
                                        PDF, JPG, PNG — Max 10 MB
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* ─── Error Message ─── */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -8, height: 0 }}
                            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                            <p className="text-sm text-red-300">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── Form Fields ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 md:p-8 space-y-6"
                >
                    <h3 className="text-lg font-display font-medium text-white flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" /> Resource Details
                    </h3>

                    {/* Title */}
                    <div>
                        <label className={labelBase}>Title *</label>
                        <input
                            type="text"
                            placeholder="e.g. Data Structures Notes Unit 1"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className={inputBase}
                        />
                    </div>

                    {/* Subject + Semester */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={labelBase}><BookOpen className="w-3 h-3" /> Subject *</label>
                            <input
                                type="text"
                                placeholder="e.g. Operating Systems"
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                className={inputBase}
                            />
                        </div>
                        <div>
                            <label className={labelBase}><Layers className="w-3 h-3" /> Semester *</label>
                            <select
                                value={formData.semester}
                                onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                className={`${inputBase} appearance-none cursor-pointer`}
                            >
                                <option value="" className="bg-zinc-900">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <option key={s} value={s} className="bg-zinc-900">Semester {s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Type + Year */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={labelBase}><Type className="w-3 h-3" /> Type *</label>
                            <select
                                value={formData.resource_type}
                                onChange={e => setFormData({ ...formData, resource_type: e.target.value })}
                                className={`${inputBase} appearance-none cursor-pointer`}
                            >
                                <option value="" className="bg-zinc-900">Select Type</option>
                                {['Notes', 'Question Paper', 'Solutions', 'Project Report', 'Study Material', 'Assignment', 'Lab Manual', 'Presentation'].map(t => (
                                    <option key={t} value={t} className="bg-zinc-900">{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelBase}><Calendar className="w-3 h-3" /> Year</label>
                            <input
                                type="number"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: e.target.value })}
                                className={inputBase}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelBase}>Description</label>
                        <textarea
                            rows={3}
                            placeholder="Add a brief description about this resource…"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className={`${inputBase} resize-none`}
                        />
                    </div>

                    {/* College */}
                    <div>
                        <label className={labelBase}>College</label>
                        <input
                            type="text"
                            placeholder="Optional — e.g. MIT Manipal"
                            value={formData.college}
                            onChange={e => setFormData({ ...formData, college: e.target.value })}
                            className={inputBase}
                        />
                    </div>

                    {/* Visibility Toggle */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, is_public: true }))}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${formData.is_public
                                ? 'bg-primary/10 border-primary/40 text-primary shadow-[0_0_15px_rgba(248,92,58,0.08)]'
                                : 'bg-zinc-900/50 border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-400'
                                }`}
                        >
                            <Globe className="w-4 h-4" /> Public
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, is_public: false }))}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${!formData.is_public
                                ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.08)]'
                                : 'bg-zinc-900/50 border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-400'
                                }`}
                        >
                            <Lock className="w-4 h-4" /> Private
                        </button>
                    </div>
                </motion.div>

                {/* ─── Submit ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex justify-end"
                >
                    <Button
                        type="submit"
                        disabled={uploading}
                        className="w-full sm:w-auto px-10 py-3.5 text-sm font-medium"
                    >
                        {uploading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Uploading…
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <UploadIcon className="w-4 h-4" /> Upload Resource
                            </span>
                        )}
                    </Button>
                </motion.div>
            </form>
        </PageLayout>
    );
};

export default Upload;
