import React from 'react';
import { motion } from 'framer-motion';

const HudPanel = ({ children, className, ...props }) => {
  return (
    <motion.div
      className={`relative bg-cyber-surface/80 backdrop-blur-md border-2 border-cyber-primary/50 p-6 shadow-neon-primary/30 corner-brackets ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        boxShadow: '0 0 20px rgba(0, 246, 255, 0.3), inset 0 0 20px rgba(0, 246, 255, 0.05)'
      }}
      {...props}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-primary to-transparent" />
      {children}
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-primary to-transparent" />
    </motion.div>
  );
};

export default HudPanel;
