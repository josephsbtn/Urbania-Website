import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, DocumentTextIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline';

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-4 p-3 w-full text-left transition-all duration-300 ${
      active ? 'bg-cyber-primary/20 text-cyber-primary border-r-4 border-cyber-primary' : 'text-cyber-text-secondary hover:bg-cyber-primary/10 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-bold">{label}</span>
  </button>
);

const Sidebar = ({ activePanel, setActivePanel }) => {
  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: <ChartBarIcon className="w-6 h-6" /> },
    { id: 'reports', label: 'Reports', icon: <DocumentTextIcon className="w-6 h-6" /> },
    { id: 'layers', label: 'Layers', icon: <Square3Stack3DIcon className="w-6 h-6" /> },
  ];

  return (
    <motion.div
      className="absolute top-0 left-0 h-full w-64 bg-cyber-surface/90 backdrop-blur-md border-r-2 border-cyber-primary/50 z-50 flex flex-col"
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        boxShadow: '0 0 30px rgba(0, 246, 255, 0.3)'
      }}
    >
      <div className="relative p-6 border-b-2 border-cyber-primary/50">
        <div className="absolute top-0 right-0 w-20 h-20 bg-cyber-primary/5 blur-xl" />
        <h1 className="relative text-4xl font-bold text-cyber-primary animate-flicker tracking-widest" style={{ textShadow: '0 0 10px rgba(0, 246, 255, 0.8)' }}>URBANIA</h1>
        <p className="relative text-xs text-cyber-accent font-mono mt-1">CYBERPUNK DASHBOARD v2.0</p>
        <div className="relative mt-2 flex items-center space-x-1">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
      <nav className="flex-grow mt-4">
        {navItems.map(item => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activePanel === item.id}
            onClick={() => setActivePanel(item.id)}
          />
        ))}
      </nav>
      <div className="p-4 border-t-2 border-cyber-primary/50 text-xs text-cyber-text-secondary">
        <p>STATUS: <span className="text-green-400">ONLINE</span></p>
        <p className="font-mono">DATE: {new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
      </div>
    </motion.div>
  );
};

export default Sidebar;
