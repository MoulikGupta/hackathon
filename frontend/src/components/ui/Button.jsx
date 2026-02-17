import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'default',
    className = '',
    ...props
}, ref) => {
    const base = [
        "relative inline-flex items-center justify-center",
        "font-mono font-medium uppercase tracking-wider",
        "transition-all duration-300 ease-out",
        "disabled:opacity-40 disabled:pointer-events-none",
        "active:scale-[0.97]",
    ].join(' ');

    const variantStyles = {
        primary: "bg-primary text-black hover:bg-[#ff7a5c] border border-primary",
        outline: "bg-transparent text-white border border-white/30 hover:border-white hover:bg-white/5",
        ghost: "bg-transparent text-secondary hover:text-white hover:bg-white/5 border border-transparent",
        glow: "bg-transparent text-white border border-primary/50 shadow-[0_0_20px_rgba(248,92,58,0.2)] hover:shadow-[0_0_30px_rgba(248,92,58,0.4)] hover:border-primary",
    };

    const sizeStyles = {
        sm: "h-9 px-4 text-[11px]",
        default: "h-11 px-6 text-xs",
        lg: "h-13 px-8 text-sm",
        icon: "h-10 w-10 p-0",
    };

    return (
        <button
            ref={ref}
            className={cn(base, variantStyles[variant] || variantStyles.primary, sizeStyles[size] || sizeStyles.default, className)}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
