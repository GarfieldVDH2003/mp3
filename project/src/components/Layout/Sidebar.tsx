import React from 'react';
import { Home, Library } from 'lucide-react';

interface SidebarProps {
  onNavigate: (view: 'home' | 'library') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  return (
    <div className="w-64 bg-black h-full p-6">
      <div className="space-y-4">
        <div className="text-white font-bold text-2xl mb-8">MP3 Player</div>
        
        <nav className="space-y-4">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center text-gray-300 hover:text-white w-full"
          >
            <Home className="w-6 h-6 mr-3" />
            Home
          </button>
          <button
            onClick={() => onNavigate('library')}
            className="flex items-center text-gray-300 hover:text-white w-full"
          >
            <Library className="w-6 h-6 mr-3" />
            Your Library
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;