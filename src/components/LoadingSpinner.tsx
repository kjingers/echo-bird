import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <motion.span
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-purple-400"
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-2 rounded-full border-4 border-transparent border-b-pink-400 border-l-cyan-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );
}

export function VoiceSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-white/10 rounded-xl" />
      <div className="h-12 bg-white/10 rounded-xl" />
    </div>
  );
}
