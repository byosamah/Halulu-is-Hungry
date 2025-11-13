
import React from 'react';
import { ATTRIBUTE_FILTERS, INSPIRATIONS } from '../constants';
import FilterPill from './FilterPill';
import { SearchIcon, LocationIcon, SparklesIcon } from './icons';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
  onSearch: () => void;
  onRefreshLocation: () => void;
  disabled: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, activeFilters, setActiveFilters, onSearch, onRefreshLocation, disabled }) => {
  const handleFilterClick = (filter: string) => {
    setActiveFilters(
      activeFilters.includes(filter)
        ? activeFilters.filter((f) => f !== filter)
        : [...activeFilters, filter]
    );
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  const handleInspireMe = () => {
    const randomIndex = Math.floor(Math.random() * INSPIRATIONS.length);
    const inspiration = INSPIRATIONS[randomIndex];
    setQuery(inspiration);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
             <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for 'pizza', 'sushi', 'cozy cafes'..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition duration-150 ease-in-out text-base"
            disabled={disabled}
          />
        </div>
        <button
          onClick={onSearch}
          disabled={disabled}
          className="w-full sm:w-auto flex-shrink-0 px-8 py-3 bg-rose-500 text-white font-semibold rounded-lg shadow-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Search
        </button>
        <button
          onClick={handleInspireMe}
          disabled={disabled}
          className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center px-6 py-3 bg-amber-400 text-amber-900 font-semibold rounded-lg shadow-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <SparklesIcon className="h-5 w-5 mr-2" />
          Inspire Me
        </button>
        <button
          onClick={onRefreshLocation}
          disabled={disabled}
          title="Refresh Location"
          className="w-full sm:w-auto flex-shrink-0 p-3 bg-white text-gray-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <LocationIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-600 mb-2">Vibes & Attributes</p>
        <div className="flex flex-wrap gap-2">
          {ATTRIBUTE_FILTERS.map((filter) => (
            <FilterPill
              key={filter}
              label={filter}
              isActive={activeFilters.includes(filter)}
              onClick={() => handleFilterClick(filter)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
