import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedTitle = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
        // Keep cursor blinking after typing is done
      }
    }, 100); // Adjust typing speed here

    return () => clearInterval(typingInterval);
  }, [text]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500); // Cursor blink speed
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <motion.h1
      className="text-5xl md:text-6xl font-mono text-center mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-relaxed pb-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayedText}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="inline-block"
      >
        _
      </motion.span>
    </motion.h1>
  );
};

export default AnimatedTitle; 