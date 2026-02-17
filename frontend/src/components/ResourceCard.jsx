import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Globe, Lock } from 'lucide-react';

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
            whileHover={{ y: -5 }}
            onClick={() => navigate(`/resource/${resource.id}`)}
            className="group relative bg-[#121217] border border-white/5 rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-300 flex flex-col h-full cursor-pointer"
        >
            {/* Top Banner */}
            <div className="h-2 w-full bg-gradient-to-r from-primary/80 to-purple-600/80"></div>

            <div className="p-5 flex-1 flex flex-col">
                {/* Header: Type & Visibility */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        {resource.resource_type && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-sm border border-primary/20">
                                {resource.resource_type}
                            </span>
                        )}
                        {resource.is_public === false ? (
                            <span className="text-[10px] font-mono text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded-sm border border-yellow-500/20 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" /> Private
                            </span>
                        ) : (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm border border-emerald-500/20 flex items-center gap-1">
                                <Globe className="w-2.5 h-2.5" /> Public
                            </span>
                        )}
                    </div>
                    {resource.year && (
                        <span className="text-[10px] font-mono text-zinc-500">{resource.year}</span>
                    )}
                </div>

                {/* Title & Subject */}
                <h3 className="font-display font-semibold text-lg text-white mb-1 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {resource.title}
                </h3>
                <p className="text-sm text-secondary mb-1 font-mono">{resource.subject}</p>
                {resource.semester && (
                    <p className="text-[10px] text-zinc-500 font-mono mb-3">Semester {resource.semester}</p>
                )}

                {/* Description */}
                {resource.description && (
                    <p className="text-xs text-secondary/80 line-clamp-2 mb-4 flex-1 leading-relaxed">
                        {resource.description}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                            <FileText className="w-3 h-3 text-zinc-400" />
                        </div>
                        {resource.college && (
                            <span className="text-[10px] text-zinc-500 font-mono">{resource.college}</span>
                        )}
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">{createdDate}</span>
                </div>
            </div>

            {/* Hover visual effect */}
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/10 rounded-lg pointer-events-none transition-all duration-300"></div>
        </motion.div>
    );
};

export default ResourceCard;
