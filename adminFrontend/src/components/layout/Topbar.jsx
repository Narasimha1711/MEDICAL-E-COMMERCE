import React from 'react';
import { Menu } from 'lucide-react';

const Topbar = ({ toggleSidebar }) => {
  return (
    <header className="fixed top-0 right-0 z-20 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center lg:hidden">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>
      
      <div className="flex-1 flex justify-center lg:justify-start">
      </div>
    </header>
  );
};

export default Topbar;