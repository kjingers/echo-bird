import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <div className="inline-flex items-center gap-3 mb-4">
        {/* Animated bird logo */}
        <motion.div
          className="relative"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg
            viewBox="0 0 64 64"
            className="w-16 h-16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="birdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            {/* Bird body */}
            <motion.path
              d="M32 48C42 48 52 40 52 28C52 16 42 8 32 8C22 8 12 18 12 28C12 32 14 36 18 40L12 52L24 46C26.5 47.3 29.2 48 32 48Z"
              fill="url(#birdGradient)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            {/* Eye */}
            <circle cx="38" cy="24" r="3" fill="white" />
            {/* Beak */}
            <path d="M48 22L56 20L48 26Z" fill="#fbbf24" />
            {/* Wing */}
            <motion.path
              d="M20 28C20 28 24 32 32 32C32 32 26 36 20 36C20 36 18 32 20 28Z"
              fill="rgba(255,255,255,0.3)"
              animate={{ d: [
                "M20 28C20 28 24 32 32 32C32 32 26 36 20 36C20 36 18 32 20 28Z",
                "M20 28C20 28 26 28 34 28C34 28 28 36 20 36C20 36 18 32 20 28Z",
                "M20 28C20 28 24 32 32 32C32 32 26 36 20 36C20 36 18 32 20 28Z",
              ]}}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Sound waves */}
            <motion.circle
              cx="54"
              cy="24"
              r="4"
              stroke="url(#birdGradient)"
              strokeWidth="1.5"
              fill="none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx="54"
              cy="24"
              r="4"
              stroke="url(#birdGradient)"
              strokeWidth="1.5"
              fill="none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </svg>
        </motion.div>
        
        <div className="text-left">
          <motion.h1
            className="text-4xl md:text-5xl font-bold gradient-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Echo Bird
          </motion.h1>
          <motion.p
            className="text-white/60 text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Transform your words into speech
          </motion.p>
        </div>
      </div>
      
      <motion.p
        className="text-white/40 text-sm max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Powered by Azure Cognitive Services Neural Text-to-Speech
      </motion.p>
    </motion.header>
  );
}
