import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Globe, Lock, Calendar, BookOpen } from 'lucide-react';

const ResourceCard = ({ resource, index }) => {
    const navigate = useNavigate();

    const createdDate = resource.created_at
        ? new Date(resource.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            onClick={() => navigate(`/resource/${resource.id}`)}
            className="group relative h-full cursor-pointer"
        >
            {/* Glass Container */}
            <div className="relative h-full bg-[#0A0A0F]/60 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(248,92,58,0.1)] hover:-translate-y-1">

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="p-5 flex flex-col h-full relative z-10">
                    {/* Top Row: Tags */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-wrap gap-2">
                            {resource.resource_type && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/5 text-white/70 border border-white/10 group-hover:border-primary/20 group-hover:text-primary transition-colors">
                                    <BookOpen className="w-3 h-3" />
                                    {resource.resource_type}
                                </span>
                            )}
                            {resource.is_public === false ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                    <Lock className="w-3 h-3" /> Private
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    <Globe className="w-3 h-3" /> Public
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h3 className="font-display text-lg font-medium text-white mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {resource.title}
                        </h3>

                        <div className="flex items-center gap-2 mb-3 text-xs text-secondary font-mono">
                            <span className="text-white/40">{resource.subject}</span>
                            {resource.semester && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                    <span className="text-white/40">Sem {resource.semester}</span>
                                </>
                            )}
                        </div>

                        {resource.description && (
                            <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed mb-4">
                                {resource.description}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-600">
                        <div className="flex items-center gap-2">
                            {resource.college && (
                                <span className="truncate max-w-[120px]">{resource.college}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {createdDate}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ResourceCard;
