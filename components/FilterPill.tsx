
import React from 'react';

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterPill: React.FC<FilterPillProps> = ({ label, isActive, onClick }) => {
  const baseClasses = "px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400";
  const activeClasses = "bg-rose-500 text-white border-rose-500";
  const inactiveClasses = "bg-white text-gray-700 border-gray-300 hover:bg-rose-50 hover:border-rose-300";

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {label}
    </button>
  );
};

export default FilterPill;
