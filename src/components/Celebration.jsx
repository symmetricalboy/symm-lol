import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Helper function to generate random number within range
const random = (min, max) => Math.random() * (max - min) + min;

// Generate random confetti data
const generateConfetti = (count) => {
  return Array.from({ length: count }).map(() => ({
    id: Math.random().toString(36).substr(2, 9),
    x: random(0, 100), // Initial X position (%)
    y: -5, // Initial Y position (%)
    size: random(5, 15), // Size in pixels
    rotation: random(0, 360), // Initial rotation in degrees
    color: `hsl(${random(0, 360)}, 80%, 60%)`, // Random color
    xVelocity: random(-1, 1), // Horizontal velocity
    yVelocity: random(1, 3), // Vertical velocity
    rotationVelocity: random(-2, 2), // Rotation velocity
  }));
};

const Celebration = ({ 
  onClose, 
  title = "YES!", 
  message = "Celebration time!", 
  confettiCount = 200,
  autoCloseDelay = 12000
}) => {
  const [confetti, setConfetti] = useState(() => generateConfetti(confettiCount));
  const [frame, setFrame] = useState(0);
  
  // Animation loop for confetti
  useEffect(() => {
    const frameRate = 1000 / 60; // 60 fps
    let animationFrame;
    let lastTimestamp = 0;
    
    const animate = (timestamp) => {
      if (timestamp - lastTimestamp > frameRate) {
        setConfetti(prevConfetti => {
          return prevConfetti.map(piece => {
            // Update position and rotation
            const newY = piece.y + piece.yVelocity;
            const newX = piece.x + piece.xVelocity;
            const newRotation = piece.rotation + piece.rotationVelocity;
            
            // Reset if confetti falls out of view
            if (newY > 110) {
              return {
                ...piece,
                y: -5,
                x: random(0, 100),
              };
            }
            
            return {
              ...piece,
              y: newY,
              x: newX,
              rotation: newRotation,
            };
          });
        });
        
        setFrame(prev => prev + 1);
        lastTimestamp = timestamp;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    // Cleanup animation frame on unmount
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  // Auto-close celebration after a delay (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDelay);
    
    return () => clearTimeout(timer);
  }, [onClose, autoCloseDelay]);
  
  return (
    <motion.div 
      className="celebration"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Render confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            zIndex: 50,
          }}
        />
      ))}
      
      {/* Celebration message */}
      <motion.div 
        className="celebration-content max-w-md bg-gray-900/90 text-white border border-purple-500"
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          transition: { 
            type: "spring", 
            stiffness: 200, 
            damping: 10 
          }
        }}
      >
        <motion.h2 
          className="text-4xl md:text-6xl font-dancing text-center mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
          animate={{ 
            scale: [1, 1.1, 1],
            transition: { 
              duration: 2, 
              repeat: Infinity,
              repeatType: 'reverse'
            }
          }}
        >
          🎉 {title} 🎉
        </motion.h2>
        
        <p className="text-xl mb-6">{message}</p>
        
        <motion.button
          className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-colors"
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(139, 92, 246, 0.7)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
        >
          Awesome!
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Celebration; 