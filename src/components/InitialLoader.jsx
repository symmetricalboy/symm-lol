import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CircularProgress = ({ progress }) => {
  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      className="transform -rotate-90"
    >
      <circle
        stroke="#374151" // theme-appropriate gray
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <motion.circle
        stroke="#8b5cf6" // theme-appropriate purple
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 0.7, ease: "easeInOut" }} // Smooth transition for the bar itself
      />
    </svg>
  );
};

const InitialLoader = ({ onLoaded }) => {
  const [percentage, setPercentage] = useState(0);
  const minDuration = 10000; // 10 seconds
  const maxDuration = 15000; // 15 seconds
  const targetDuration = useRef(Math.random() * (maxDuration - minDuration) + minDuration);
  const startTime = useRef(Date.now());

  useEffect(() => {
    let animationFrameId;

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime.current;
      let currentProgress = Math.min(100, (elapsedTime / targetDuration.current) * 100);

      // Make jumps more noticeable by adding a bit of controlled randomness to the displayed percentage
      // This ensures it generally trends upwards but can have small bursts.
      if (currentProgress > percentage) {
        if (currentProgress < 98 && Math.random() < 0.15) { // 15% chance to jump a bit more
          setPercentage(Math.min(100, Math.floor(currentProgress) + Math.floor(Math.random() * 5) + 2));
        } else {
          setPercentage(Math.min(100, Math.floor(currentProgress)));
        }
      }
      
      if (elapsedTime < targetDuration.current) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setPercentage(100);
        // Ensure 100% stays for a brief moment before calling onLoaded
        setTimeout(() => {
          if (onLoaded) {
            onLoaded();
          }
        }, 800); 
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onLoaded, percentage]); // Include percentage to allow re-triggering if needed for complex scenarios, though mainly for onLoaded.

  const loaderVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gray-900/95 backdrop-blur-sm"
      variants={loaderVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <CircularProgress progress={percentage} />
      <motion.div 
        key={percentage} // Force re-animation of text if desired, or remove for simpler text update
        className="mt-6 text-3xl font-mono text-purple-300"
        initial={{ opacity: 0.5, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {percentage}%
      </motion.div>
      <p className="mt-3 text-lg text-gray-400 animate-pulse">Initializing Interface...</p>
    </motion.div>
  );
};

export default InitialLoader; 