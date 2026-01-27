import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = cn(
    'relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  );

  const variants = {
    primary: cn(
      'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500',
      'hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400',
      'text-white shadow-lg shadow-purple-500/25',
      'hover:shadow-xl hover:shadow-purple-500/40',
      'focus:ring-purple-500',
      'active:scale-[0.98]',
    ),
    secondary: cn(
      'bg-white/10 backdrop-blur-sm border border-white/20',
      'text-white hover:bg-white/20',
      'focus:ring-white/50',
    ),
    ghost: cn(
      'bg-transparent text-white/70 hover:text-white hover:bg-white/10',
      'focus:ring-white/30',
    ),
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
