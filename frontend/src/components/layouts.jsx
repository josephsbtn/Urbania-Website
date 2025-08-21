import React, { useState } from 'react';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-xl">Smart City Dashboard</h1>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <button className="text-sm">Future Mobility</button>
          <button className="text-sm">Smart Governance</button>
          <button className="text-sm">Green Cities</button>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="p-2 bg-gray-100 rounded">
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
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
