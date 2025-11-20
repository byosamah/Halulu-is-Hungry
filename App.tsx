import React, { useState, useEffect, useCallback } from 'react';
import type { Restaurant, Coordinates } from './types';
import { QuotaExceededError, APIKeyError, NetworkError, InvalidResponseError } from './types';
import { findRestaurants, validateAPIKey } from './services/geminiService';
import LuxuryHeader from './components/luxury-header';
import PremiumSearch from './components/premium-search';
import RestaurantGridCard from './components/restaurant-grid-card';
import LuxuryLoading from './components/luxury-loading';
import LuxuryError from './components/luxury-error';
import PasswordWall from './components/PasswordWall';
import { MapPin } from 'lucide-react';

const App: React.FC = () => {
  // 🔒 PASSWORD PROTECTION STATE
  // When true, the PasswordWall component is shown
  // When false, the normal app content is displayed
  const [isLocked, setIsLocked] = useState<boolean>(true);

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
        setError(`Location access required: ${error.message}. Please enable location services.`);
        setLocation(null);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    if (!validateAPIKey()) {
      setError('API key not configured. Please add GEMINI_API_KEY to your .env.local file.');
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!location) {
      setError("Location required. Please enable location services to discover restaurants.");
      return;
    }
    if (!searchQuery.trim()) {
      setError("Please enter a search query to begin your culinary discovery.");
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

  const renderContent = () => {
    if (isLoading && !location) {
      return (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
          <MapPin className="h-12 w-12 text-primary mb-4" />
          <h3 className="font-display text-xl text-foreground">Acquiring your location...</h3>
          <p className="text-muted-foreground mt-2">Please allow location access</p>
        </div>
      );
    }

    if (error) {
      return <LuxuryError message={error} />;
    }

    if (isLoading) {
      return <LuxuryLoading />;
    }

    if (restaurants.length > 0) {
      return (
        <div className="space-y-8">
          {/* Fun results count */}
          <div className="text-center animate-fade-in">
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-3xl p-4 inline-block border-2 border-primary/20">
              <p className="text-lg text-foreground font-body font-bold flex items-center gap-2">
                <span className="text-2xl">🎉</span>
                Found {restaurants.length} amazing {restaurants.length === 1 ? 'spot' : 'spots'} for you!
                <span className="text-2xl">✨</span>
              </p>
            </div>
          </div>

          {/* All Cards in Uniform Grid with staggered animation */}
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

    return (
      <div className="text-center py-24 animate-fade-in max-w-3xl mx-auto space-y-8">
        {/* Fun welcome with emoji */}
        <div className="space-y-6">
          <div className="text-7xl animate-bounce-in mb-6">
            🍽️
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Let's Find Your Next
            <span className="text-primary block mt-2">
              Food Adventure!
            </span>
            <span className="text-5xl md:text-6xl inline-block animate-wiggle ml-2">🎉</span>
          </h2>
          <p className="text-foreground/80 text-xl font-body leading-relaxed max-w-2xl mx-auto font-medium">
            Tell Halulu what your tummy is craving, and I'll dig through <span className="text-primary font-bold">thousands of reviews</span> to find the <span className="text-secondary font-bold">perfect spot</span> just for you!
            <span className="inline-block ml-1">🔍✨</span>
          </p>
        </div>

        {/* Fun decorative food emojis */}
        <div className="flex items-center justify-center gap-6 py-8">
          <span className="text-4xl animate-float">🍕</span>
          <span className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🍜</span>
          <span className="text-4xl animate-float" style={{ animationDelay: '1s' }}>🍔</span>
          <span className="text-4xl animate-float" style={{ animationDelay: '1.5s' }}>🌮</span>
          <span className="text-4xl animate-float" style={{ animationDelay: '2s' }}>🍣</span>
        </div>

        {/* Fun call to action */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-3xl p-6 border-2 border-primary/20">
          <p className="text-base text-foreground font-body font-semibold">
            👆 Start by typing what you're craving above! <span className="inline-block">😋</span>
          </p>
        </div>
      </div>
    );
  };

  // 🔒 CONDITIONAL RENDERING LOGIC
  // If the app is locked, show the PasswordWall component
  // Once the correct PIN is entered, setIsLocked(false) will be called
  // and the normal app will be displayed
  if (isLocked) {
    return <PasswordWall onUnlock={() => setIsLocked(false)} />;
  }

  // ✅ Normal app content (shown after correct PIN is entered)
  return (
    <div className="min-h-screen bg-background">
      <LuxuryHeader />

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto mb-12">
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

        {renderContent()}
      </main>
    </div>
  );
};

export default App;
