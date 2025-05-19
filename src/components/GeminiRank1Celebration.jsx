import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Helper for random numbers
const random = (min, max) => Math.random() * (max - min) + min;

// Particle component
const Particle = ({ initialX, initialY, color, size, controls }) => {
  useEffect(() => {
    controls.start({
      y: [initialY, random(-100, window.innerHeight + 100)],
      x: [initialX, random(-100, window.innerWidth + 100)],
      opacity: [1, 0.5, 0],
      scale: [1, random(0.5, 1.5), 0.8, 0.5],
      rotate: [random(0, 360), random(0, 720)],
      transition: {
        duration: random(3, 7),
        ease: 'linear',
        repeat: Infinity,
        delay: random(0, 2),
      },
    });
  }, [controls, initialX, initialY]);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        left: initialX,
        top: initialY,
      }}
      animate={controls}
    />
  );
};

const GeminiRank1Celebration = ({ onClose }) => {
  const audioRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const particleControls = Array.from({ length: 150 }).map(() => useAnimation()); // More particles

  useEffect(() => {
    // Generate more particles for a wilder effect
    const newParticles = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      initialX: random(0, window.innerWidth),
      initialY: random(0, window.innerHeight),
      color: `hsl(${random(0, 360)}, 100%, 70%)`,
      size: random(10, 30), // Larger particles
    }));
    setParticles(newParticles);

    // Play audio
    if (audioRef.current) {
      console.log('Current window.location.origin:', window.location.origin);
      // Ensure the URL always starts with https:// 
      const origin = window.location.origin.startsWith('https') 
        ? window.location.origin 
        : window.location.origin.replace('http://', 'https://');
      audioRef.current.src = `${origin}/gemini_rank1_theme.mp3`;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }

    // Auto close after a longer period, e.g., 30 seconds or based on music length
    const autoCloseTimer = setTimeout(onClose, 30000); // 30 seconds

    return () => {
      clearTimeout(autoCloseTimer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [onClose]);

  const titleVariants = {
    hidden: { opacity: 0, y: -100, scale: 0.5, rotate: -15 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1, // Initial scale
      rotate: 0, // Initial rotate
      transition: {
        type: 'spring',
        stiffness: 120, // Slightly adjusted for feel
        damping: 8,     // Slightly adjusted for feel
        // For continuous effect, we animate properties individually with repeat
        // For spring, it usually animates to the target. To make it continuous,
        // we often use `animate` prop on motion component with variants that trigger each other
        // or use a keyframes array with a different transition type like `tween` or `keyframes`.
        // However, for a simple repeating springy feel on load, we can rely on the initial spring to target.
        // To make it *continuously* springy with these exact keyframes [1, 1.2, 1, 1.15, 1] would require `type: 'tween'` or `type: 'keyframes'` and then specify `ease` or `times`.
        // Let's simplify to a single spring to target, and add a hover effect for more interaction if desired,
        // or use a slightly different approach for the repeat.
        // For now, let's make it spring to a slightly larger size and then rely on a repeating animation
        // for a subtle pulse using the animate prop directly on the h1 if needed for more complex repeats.
        // The current `repeat: Infinity, repeatType: 'mirror'` with spring will make it go to target and back.
        // Let's use this for scale and rotate.
        scale: {
          type: 'spring',
          stiffness: 120,
          damping: 8,
          repeat: Infinity,
          repeatType: 'mirror',
          repeatDelay: 0.5, // Delay between repeats
          from: 1, // Explicitly state starting value for repeat
          to: 1.1, // Target value for spring
        },
        rotate: {
            type: 'spring',
            stiffness: 150,
            damping: 10,
            repeat: Infinity,
            repeatType: 'mirror',
            repeatDelay: 0.7,
            from: 0,
            to: [ -5, 5, -3, 3, 0 ], // This will still error with spring, let's simplify
            // Simple rotation for spring:
            // from: 0, to: 5 (then mirror makes it -5)
        }
      },
    },
  };

  // REVISED titleVariants for simplicity and spring compatibility
  const revisedTitleVariants = {
    hidden: { opacity: 0, y: -100, scale: 0.5, rotate: -15 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1, 
      rotate: 0,
      transition: { 
        type: 'spring', 
        stiffness: 120, 
        damping: 8, 
        delay: 0.3 // Overall delay for the variant to start
      },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.5, duration: 0.8, type: 'spring' },
    },
  };
  
  const backgroundVariants = {
    initial: { backgroundColor: 'rgba(0,0,0,0.7)' },
    animate: {
      backgroundColor: [
        'rgba(76, 0, 130, 0.8)', // Dark Purple
        'rgba(153, 50, 204, 0.8)', // Orchid
        'rgba(255, 20, 147, 0.8)', // Deep Pink
        'rgba(255, 105, 180, 0.8)', // Hot Pink
        'rgba(0, 191, 255, 0.8)',  // Deep Sky Blue
        'rgba(50, 205, 50, 0.8)'   // Lime Green
      ],
      transition: { duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }
    }
  };


  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      variants={backgroundVariants}
      initial="initial"
      animate="animate"
    >
      {particles.map((p, i) => (
        <Particle key={p.id} {...p} controls={particleControls[i]} />
      ))}

      <motion.div
        className="relative z-10 bg-black/70 p-8 md:p-12 rounded-xl shadow-2xl text-center max-w-lg md:max-w-2xl border-4 border-double border-yellow-400"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent"
          variants={revisedTitleVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05 }}
        >
          🚀 GEMINI IS #1! 🚀
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl md:text-3xl text-gray-100 mb-8"
          variants={messageVariants}
          initial="hidden"
          animate="visible"
        >
          The machines have officially taken over the leaderboard! Prepare for the new world order!
        </motion.p>

        <motion.button
          className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-red-600 text-white font-semibold rounded-lg shadow-xl text-lg hover:from-yellow-400 hover:to-red-500 transition-all duration-300 transform hover:scale-110"
          onClick={onClose}
          whileHover={{ 
            boxShadow: "0 0 30px rgba(255, 255, 0, 0.8)",
            textShadow: "0 0 10px rgba(255,255,255,0.7)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          INCREDIBLE!
        </motion.button>
      </motion.div>

      <audio ref={audioRef} loop />
    </motion.div>
  );
};

export default GeminiRank1Celebration; 