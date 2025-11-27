/**
 * AppPage.tsx
 *
 * This is the main app page where users search for restaurants.
 * It contains:
 * - Search functionality
 * - Restaurant results grid
 * - Loading and error states
 *
 * This page is shown when users navigate to /app or when they
 * perform a search from the landing page.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Restaurant, Coordinates } from '../types';
import { QuotaExceededError, APIKeyError, NetworkError, InvalidResponseError } from '../types';
import { findRestaurants, validateAPIKey } from '../services/geminiService';
import { GEOLOCATION_OPTIONS, UI_STRINGS } from '../constants';
import PremiumSearch from '../components/premium-search';
import RestaurantGridCard from '../components/restaurant-grid-card';
import LuxuryLoading from '../components/luxury-loading';
import LuxuryError from '../components/luxury-error';
import { MapPin, ArrowLeft } from 'lucide-react';

const AppPage: React.FC = () => {
  // Get search params from URL (allows linking to search results)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize query from URL params if present
  const initialQuery = searchParams.get('q') || '';

  const [location, setLocation] = useState<Coordinates | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Get user's location on mount
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
        setError(`Location access required: ${error.message}. Please enable location services.`);
        setLocation(null);
        setIsLoading(false);
      },
      GEOLOCATION_OPTIONS
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // Check API key on mount
  useEffect(() => {
    if (!validateAPIKey()) {
      setError('API key not configured. Please add GEMINI_API_KEY to your .env.local file.');
    }
  }, []);

  // Auto-search if query is in URL params
  useEffect(() => {
    if (initialQuery && location && !isLoading) {
      handleSearch();
    }
  }, [location]); // Only run when location is available

  // Handle search
  const handleSearch = useCallback(async () => {
    if (!location) {
      setError("Location required. Please enable location services to discover restaurants.");
      return;
    }
    if (!searchQuery.trim()) {
      setError("Your stomach is waiting. Type something.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRestaurants([]);

    try {
      const results = await findRestaurants(location, searchQuery, activeFilters);

      if (results.length === 0) {
        setError(`No restaurants found for "${searchQuery}". Try refining your search or exploring a different cuisine.`);
        setRestaurants([]);
      } else {
        setRestaurants(results);
      }
    } catch (e) {
      if (e instanceof QuotaExceededError) {
        setError('API rate limit reached. Please wait a few minutes before searching again.');
      } else if (e instanceof APIKeyError) {
        setError('API key error. Please verify your GEMINI_API_KEY configuration.');
      } else if (e instanceof NetworkError) {
        setError('Network connection issue. Please check your internet and try again.');
      } else if (e instanceof InvalidResponseError) {
        setError('Unexpected response from AI. Please try rephrasing your query.');
      } else {
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(`Search failed: ${errorMessage}`);
      }
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  }, [location, searchQuery, activeFilters]);

  // Render the main content area
  const renderContent = () => {
    // Loading state while getting location - matching landing page style
    if (isLoading && !location) {
      return (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 border-4 border-brand-dark shadow-[8px_8px_0px_0px_var(--brand-teal)] text-center">
            <MapPin className="h-12 w-12 text-brand-coral mb-4 mx-auto animate-bounce" />
            <h3 className="font-display text-xl text-brand-dark">Acquiring your location...</h3>
            <p className="text-brand-muted mt-2 font-body">Please allow location access</p>
          </div>
        </div>
      );
    }

    // Error state
    if (error) {
      return <LuxuryError message={error} />;
    }

    // Loading state while searching
    if (isLoading) {
      return <LuxuryLoading />;
    }

    // Results state
    if (restaurants.length > 0) {
      return (
        <div className="space-y-8">
          {/* Results count - neobrutalist style */}
          <div className="text-center animate-fade-in">
            <div className="bg-white rounded-2xl px-6 py-4 inline-block border-4 border-brand-dark shadow-[6px_6px_0px_0px_var(--brand-teal)]">
              <p className="text-lg text-brand-dark font-display font-bold flex items-center gap-2">
                🎉 Found {restaurants.length} amazing {restaurants.length === 1 ? 'spot' : 'spots'} for you!
              </p>
            </div>
          </div>

          {/* Restaurant cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <div
                key={`${restaurant.name}-${index}`}
                className="animate-slide-up"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  animationFillMode: 'forwards'
                }}
              >
                <RestaurantGridCard
                  restaurant={restaurant}
                  isTopPick={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Empty state (no search yet) - matching landing page style
    return (
      <div className="text-center py-8 sm:py-12 md:py-16 animate-fade-in max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[40px] p-6 sm:p-10 md:p-16 border-4 border-brand-dark shadow-[8px_8px_0px_0px_var(--brand-yellow)] sm:shadow-[12px_12px_0px_0px_var(--brand-yellow)]">
          <div className="space-y-6">
            <h2 className="font-display-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-dark leading-tight">
              What are you craving?
            </h2>
            <p className="text-brand-muted text-xl font-body leading-relaxed max-w-2xl mx-auto">
              Tell us what you're hungry for, and we'll read thousands of reviews to find your perfect spot.
            </p>
          </div>

          {/* Food emoji decoration */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 py-6 sm:py-8">
            <span className="text-3xl sm:text-4xl md:text-5xl animate-float">🍕</span>
            <span className="text-3xl sm:text-4xl md:text-5xl animate-float" style={{ animationDelay: '0.5s' }}>🍜</span>
            <span className="text-3xl sm:text-4xl md:text-5xl animate-float" style={{ animationDelay: '1s' }}>🍔</span>
            <span className="text-3xl sm:text-4xl md:text-5xl animate-float" style={{ animationDelay: '1.5s' }}>🌮</span>
            <span className="text-3xl sm:text-4xl md:text-5xl animate-float" style={{ animationDelay: '2s' }}>🍣</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-cream relative overflow-hidden">
      {/* ===== GLOBAL COLORFUL BACKGROUND BLOBS - Very subtle for product ===== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top left - Coral/Red */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-brand-coral rounded-full opacity-[0.06] blur-[150px]" />
        {/* Top right - Teal */}
        <div className="absolute top-20 -right-40 w-[400px] h-[400px] bg-brand-teal rounded-full opacity-[0.05] blur-[150px]" />
        {/* Middle left - Yellow */}
        <div className="absolute top-[40%] -left-20 w-[350px] h-[350px] bg-brand-yellow rounded-full opacity-[0.07] blur-[130px]" />
        {/* Middle right - Pink */}
        <div className="absolute top-[60%] -right-20 w-[400px] h-[400px] bg-brand-pink rounded-full opacity-[0.05] blur-[150px]" />
        {/* Bottom left - Purple */}
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-brand-purple rounded-full opacity-[0.04] blur-[130px]" />
        {/* Bottom center - Lime */}
        <div className="absolute -bottom-20 left-[40%] w-[450px] h-[450px] bg-brand-green rounded-full opacity-[0.05] blur-[150px]" />
      </div>

      {/* Header with back button */}
      <header className="relative bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b-2 border-brand-dark/10">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-brand-dark shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-body-bold text-brand-dark"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex-1 flex items-center gap-3">
            {/* Fork/utensil logo SVG */}
            <svg
              className="w-7 h-7"
              viewBox="0 0 182.59 194.77"
              fill="currentColor"
            >
              <path d="M69.46,5.75v35.25c-7.33,1.12-13.99.31-20.95-2.05l-.17-33.08c-2.1-6.84-11.22-7.28-13.36-.09l-.11,32.64c-6.61,3.06-13.72,3.67-20.92,2.58V6.25c0-.76-1.51-3.13-2.25-3.75C7.01-1.45,1.11,1.03,0,6.79l.02,86.9c1.5,13.63,12.86,24.26,26.62,24.38l.69.66-5.37,61.52c1.04,13.38,12.56,15.06,23.77,14.27,11.82-.83,16.31-7.73,15.22-19.27l-5-57.25c13.69-.08,24.73-9.93,26.95-23.3l.02-89.42c-1.59-7.22-12.28-6.68-13.47.47Z"/>
              <path d="M181.95,42.26c-1.63-19.9-22.2-42.26-42.74-42.26h-26.25v183.25c0,6.45,8.81,10.69,14.31,11.19,13.43,1.22,26.16-.22,25.71-16.71l-5.47-59.41c5.97-3.04,12.65-5.19,18.19-9.33,8.24-6.16,15.16-18,16.2-28.3.97-9.7.86-28.62.05-38.43Z"/>
            </svg>
            <h1 className="font-display text-xl font-bold text-brand-dark">
              Halulu is Hungry
            </h1>
          </div>
        </div>
      </header>

      <main className="relative max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 z-10">
        {/* Search area */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8 md:mb-12">
          <PremiumSearch
            query={searchQuery}
            setQuery={setSearchQuery}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            onSearch={handleSearch}
            onRefreshLocation={getLocation}
            disabled={isLoading}
          />
        </div>

        {/* Main content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default AppPage;
