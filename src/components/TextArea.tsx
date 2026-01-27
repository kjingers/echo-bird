import { forwardRef } from 'react';
import { cn } from '@/utils';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  charCount?: number;
  maxChars?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, charCount, maxChars, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/80 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'bg-white/5 backdrop-blur-sm border border-white/10',
              'text-white placeholder-white/40',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50',
              'transition-all duration-200',
              'resize-none',
              error && 'border-red-500/50 focus:ring-red-500/50',
              className
            )}
            {...props}
          />
          {maxChars && (
            <div className="absolute bottom-3 right-3 text-xs text-white/40">
              {charCount || 0} / {maxChars}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
