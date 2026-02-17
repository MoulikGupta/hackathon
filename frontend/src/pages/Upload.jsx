import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';

const Upload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        department: 'CSE',
        semester: '1st Sem',
        type: 'Notes',
        tags: ''
    });

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file || !formData.title) return;

        setUploading(true);
        // Simulate upload
        setTimeout(() => {
            setUploading(false);
            setSuccess(true);
            // Reset after success
            setTimeout(() => {
                setSuccess(false);
                setFile(null);
                setFormData({
                    title: '',
                    subject: '',
                    department: 'CSE',
                    semester: '1st Sem',
                    type: 'Notes',
                    tags: ''
                });
            }, 3000);
        }, 2000);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-display font-medium text-white mb-2">Upload Resource</h1>
                <p className="text-secondary text-sm">Contribute to the community and earn Karma points.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col: Upload Zone */}
                <div className="space-y-6">
                    <div
                        className={`relative h-64 border-2 border-dashed rounded-lg transition-all duration-300 flex flex-col items-center justify-center p-6 text-center ${dragActive
                                ? 'border-primary bg-primary/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => setFile(e.target.files[0])}
                        />

                        <AnimatePresence mode="wait">
                            {file ? (
                                <motion.div
                                    key="file-preview"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="flex flex-col items-center gap-3"
                                >
                                    <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-xs text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.preventDefault(); setFile(null); }}
                                        className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 z-10 relative"
                                    >
                                        <X className="w-3 h-3" /> Remove
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="upload-prompt"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-3 pointer-events-none"
                                >
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                                        <UploadIcon className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">Drag & drop your file</p>
                                        <p className="text-xs text-secondary mt-1">PDF, DOCX, PPT (Max 50MB)</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <GlassCard className="space-y-3">
                        <h3 className="text-xs font-mono text-secondary uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="w-3 h-3 text-primary" /> Guidelines
                        </h3>
                        <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4">
                            <li>Ensure content is clearly visible and readable.</li>
                            <li>Do not upload copyrighted material without permission.</li>
                            <li>Appropriate tags help others find your resource.</li>
                        </ul>
                    </GlassCard>
                </div>

                {/* Right Col: Metadata Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-mono text-secondary uppercase">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Data Structures Unit 1 Notes"
                            className="w-full bg-[#121217] border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none transition-colors placeholder:text-zinc-700"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-mono text-secondary uppercase">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full bg-[#121217] border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none transition-colors appearance-none"
                            >
                                {['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT'].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-mono text-secondary uppercase">Semester</label>
                            <select
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                className="w-full bg-[#121217] border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none transition-colors appearance-none"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={`${s}st Sem`}>{s}th Sem</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-mono text-secondary uppercase">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Operating Systems"
                            className="w-full bg-[#121217] border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none transition-colors placeholder:text-zinc-700"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-mono text-secondary uppercase">Resource Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full bg-[#121217] border border-white/10 rounded-sm px-4 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none transition-colors appearance-none"
                        >
                            {['Notes', 'Question Paper', 'Assignment', 'Project Report', 'Reference Book'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={uploading || !file || !formData.title}
                        >
                            {uploading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Uploading...
                                </span>
                            ) : success ? (
                                <span className="flex items-center gap-2 text-green-400">
                                    <CheckCircle className="w-4 h-4" /> Uploaded Successfully!
                                </span>
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
