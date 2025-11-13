import React, { useState, useEffect, useCallback } from 'react';
import type { Restaurant, Coordinates } from './types';
import { findRestaurants } from './services/geminiService';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RestaurantCard from './components/RestaurantCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { LocationIcon } from './components/icons';

const App: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const getLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
        setIsLoading(false);
      },
      (error) => {
        setError(`Error getting location: ${error.message}. Please enable location services and refresh.`);
        setLocation(null); // Clear old location on error
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleSearch = useCallback(async () => {
    if (!location) {
      setError("Cannot search without your location. Please enable location services.");
      return;
    }
    if (!searchQuery.trim()) {
      setError("Please enter a search query, like 'sushi' or 'brunch spots'.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRestaurants([]);

    try {
      const results = await findRestaurants(location, searchQuery, activeFilters);
      setRestaurants(results);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to fetch restaurant data: ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [location, searchQuery, activeFilters]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <div className="mt-8"><ErrorDisplay message={error} /></div>;
    }
    if (restaurants.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard key={`${restaurant.name}-${index}`} restaurant={restaurant} />
          ))}
        </div>
      );
    }
    if(!location && !isLoading){
        return null;
    }
    return (
      <div className="text-center py-16 px-6 bg-gray-50 rounded-lg mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Welcome to Halulu is Hungry AI</h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Tell us what you're craving, add some filters, and let our AI discover the perfect dining spot for you based on real customer reviews.
        </p>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar
          query={searchQuery}
          setQuery={setSearchQuery}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          onSearch={handleSearch}
          onRefreshLocation={getLocation}
          disabled={isLoading}
        />
        { !location && !isLoading && !error && (
            <div className="mt-8 flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
                <LocationIcon className="w-12 h-12 text-rose-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700">Waiting for your location...</h3>
                <p className="text-gray-500 mt-1">Please allow location access to find restaurants near you.</p>
            </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;