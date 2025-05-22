import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, memo, useMemo } from 'react';
import { formatNumber } from '../utils/formatters';

const CounterCard = memo(({ 
  label, 
  handle,
  value, 
  rank,
  loading, 
  color = 'bg-blue-50', 
  textColor = 'text-blue-600',
  borderColor = 'border-blue-100',
  glowColor = 'rgba(59, 130, 246, 0.5)',
  increased = false
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const blueskyUrl = useMemo(() => `https://bsky.app/profile/${handle}`, [handle])

  useEffect(() => {
    if (value === null || displayValue === value) return
    
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setDisplayValue(value)
      setIsAnimating(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [value, displayValue]);

  const hoverAnimation = useMemo(() => ({
    y: -5,
    boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 15px ${glowColor}`
  }), [glowColor])

  return (
    <motion.div
      className={`counter-card border ${borderColor} ${color} overflow-hidden relative backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hoverAnimation}
    >
      <div className="counter-label flex gap-2 items-center">
        <a 
          href={blueskyUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`${textColor} hover:underline transition-all duration-300 group flex items-center`}
        >
          {label}
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1 inline opacity-60 group-hover:opacity-100" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 45, scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </motion.svg>
        </a>
        
        {rank && (
          <motion.div 
            className="px-2 py-0.5 bg-gray-800/70 rounded-full text-xs font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            Rank #{rank}
          </motion.div>
        )}
      </div>
      
      {loading && displayValue === null ? (
        <div className="counter-value flex gap-2 items-center">
          <motion.div 
            className="h-6 w-6 rounded-full bg-gray-700"
            animate={{ scale: [1, 0.8, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div 
            className="h-4 w-20 rounded bg-gray-700"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      ) : (
        <div className="counter-value relative">
          <motion.div
            key={`count-${displayValue}`}
            className={textColor}
            initial={{ y: isAnimating ? 20 : 0, opacity: isAnimating ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {formatNumber(displayValue)}
            
            <AnimatePresence>
              {increased && (
                <motion.span 
                  className="ml-2 text-green-400 text-sm"
                  initial={{ opacity: 0, scale: 0.5, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ 
                      duration: 0.5, 
                      repeat: 3, 
                      repeatType: 'reverse' 
                    }}
                  >
                    ▲
                  </motion.span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
      
      {/* Floating bubbles background effect */}
      <motion.div 
        className={`absolute bottom-0 right-0 w-16 h-16 rounded-full ${color} opacity-80 blur-sm -z-10`}
        animate={{ 
          y: [0, -10, 0],
          x: [0, 5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          repeatType: 'reverse',
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className={`absolute top-5 right-5 w-6 h-6 rounded-full ${color} opacity-50 blur-sm -z-10`}
        animate={{ 
          y: [0, 8, 0],
          x: [0, -3, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          repeatType: 'reverse',
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </motion.div>
  );
})

CounterCard.displayName = 'CounterCard'

export default CounterCard; 