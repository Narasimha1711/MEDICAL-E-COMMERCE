import React from 'react';
import { Home, Users, Store, Package, Menu, X } from 'lucide-react';

const Sidebar = ({ activePage, onPageChange, isSidebarOpen, toggleSidebar }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'sellers', label: 'Sellers', icon: Store },
    { id: 'products', label: 'Products', icon: Package },
  ];

  return (
    <div className={`fixed left-0 top-0 z-30 h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} bg-violet-800 text-white shadow-xl`}>
      <div className="flex h-16 items-center justify-between px-4">
        {isSidebarOpen && (
          <h1 className="text-xl font-bold">Med Admin</h1>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-violet-700 transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`flex w-full items-center rounded-lg px-4 py-3 transition-colors
                    ${activePage === item.id 
                      ? 'bg-white text-violet-800 font-medium shadow-md' 
                      : 'text-white hover:bg-violet-700'
                    }`}
                >
                  <Icon size={20} />
                  {isSidebarOpen && <span className="ml-4">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;