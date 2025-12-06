import React from 'react';
import { motion as Motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';

const RightPanel = ({ selectedFeature, onClose }) => {
  if (!selectedFeature) return null;

  const variants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
  };

  return (
    <Motion.div
      className="absolute top-0 right-0 h-full w-96 bg-cyber-surface/90 backdrop-blur-md border-l-2 border-cyber-primary shadow-neon-primary z-20 p-6"
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ type: 'tween', duration: 0.4 }}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-cyber-primary hover:text-cyber-accent">
        <XMarkIcon className="w-8 h-8" />
      </button>
      <h2 className="text-2xl font-bold text-cyber-primary mb-4 animate-flicker">
        {selectedFeature.properties.type || 'Detail'}
      </h2>
      <div className="text-cyber-text-primary space-y-2">
        {Object.entries(selectedFeature.properties).map(([key, value]) => (
          <p key={key}>
            <span className="font-bold text-cyber-secondary">{key}: </span>
            {JSON.stringify(value)}
          </p>
        ))}
      </div>
    </Motion.div>
  );
};

export default RightPanel;
