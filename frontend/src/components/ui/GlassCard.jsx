import React from 'react';
import { cn } from '../../lib/utils';

const GlassCard = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-lg p-6",
                "backdrop-blur-xl border border-white/5",
                "bg-white/[0.02]",
                "hover:border-white/10 hover:bg-white/[0.04]",
                "transition-all duration-500",
                className
            )}
            {...props}
        >
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default GlassCard;
