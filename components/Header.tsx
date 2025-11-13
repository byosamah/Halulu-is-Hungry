import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
             <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                Halulu is Hungry <span className="text-rose-500">AI</span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;