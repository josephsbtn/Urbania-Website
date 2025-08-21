import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        {/* TechnoArt 2025 Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img 
              src="/Logo-Techno-Art-2025.png" 
              alt="TechnoArt 2025" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                console.log('Image failed to load:', e.target.src);
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            {/* Fallback CSS Logo */}
            <div className="hidden items-center gap-1">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-orange-400 text-white px-2 py-1 rounded font-bold text-sm tracking-wide">
                  <span className="text-orange-200">TECHNO</span><span className="text-blue-100">ART</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 bg-orange-400 text-white text-xs px-1 py-0 rounded-full font-bold">
                  2025
                </div>
              </div>
            </div>
          </div>
          <div className="border-l border-gray-300 h-8"></div>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile nav panel */}
      {open && (
        <div className="bg-white border-b md:hidden p-4">
          <nav className="flex flex-col gap-2">
            <button className="text-left">Future Mobility</button>
            <button className="text-left">Smart Governance</button>
            <button className="text-left">Green Cities</button>
          </nav>
        </div>
      )}

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
