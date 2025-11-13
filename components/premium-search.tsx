import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, MapPin } from 'lucide-react';
import { ATTRIBUTE_FILTERS, PRICE_RANGES, CUISINE_TYPES, DISTANCE_OPTIONS, DIETARY_RESTRICTIONS, INSPIRATIONS } from '../constants';
import type { FilterState } from '../types';

interface PremiumSearchProps {
  query: string;
  setQuery: (q: string) => void;
  filters: FilterState; // Changed from activeFilters: string[]
  setFilters: (f: FilterState) => void; // Changed from setActiveFilters
  onSearch: () => void;
  onRefreshLocation: () => void;
  disabled?: boolean;
}

const PremiumSearch: React.FC<PremiumSearchProps> = ({
  query,
  setQuery,
  filters,
  setFilters,
  onSearch,
  onRefreshLocation,
  disabled
}) => {
  // Toggle a multi-select filter (attributes, priceRanges, cuisineTypes, dietaryRestrictions)
  const toggleArrayFilter = (category: keyof Pick<FilterState, 'attributes' | 'priceRanges' | 'cuisineTypes' | 'dietaryRestrictions'>, value: string) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setFilters({ ...filters, [category]: updated });
  };

  // Set distance (single-select)
  const setDistance = (value: string | null) => {
    setFilters({ ...filters, distance: value });
  };

  const handleInspireMe = () => {
    const randomInspiration = INSPIRATIONS[Math.floor(Math.random() * INSPIRATIONS.length)];
    setQuery(randomInspiration);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled) {
      onSearch();
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border p-8">
      <div className="flex flex-col gap-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Discover exceptional dining experiences..."
            className="pl-12 h-14 text-lg border-input focus-visible:ring-primary"
            disabled={disabled}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={onSearch} disabled={disabled} size="lg" className="flex-shrink-0">
            Search
          </Button>
          <Button onClick={handleInspireMe} disabled={disabled} variant="outline" size="lg" className="flex-shrink-0">
            <Sparkles className="h-4 w-4 mr-2" />
            Inspire Me
          </Button>
          <Button onClick={onRefreshLocation} disabled={disabled} variant="outline" size="icon" className="flex-shrink-0">
            <MapPin className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters Section */}
        <div className="space-y-4 pt-2 border-t">
          {/* Atmosphere Filters */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Atmosphere</p>
            <div className="flex flex-wrap gap-2">
              {ATTRIBUTE_FILTERS.map((filter) => (
                <Badge
                  key={filter}
                  variant={filters.attributes.includes(filter) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 transition-colors px-3 py-1"
                  onClick={() => toggleArrayFilter('attributes', filter)}
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Range Filters */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Price Range</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((priceRange) => (
                <Badge
                  key={priceRange.value}
                  variant={filters.priceRanges.includes(priceRange.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 transition-colors px-3 py-1"
                  onClick={() => toggleArrayFilter('priceRanges', priceRange.value)}
                  title={priceRange.description}
                >
                  {priceRange.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Cuisine Type Filters */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Cuisine Type</p>
            <div className="flex flex-wrap gap-2">
              {CUISINE_TYPES.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant={filters.cuisineTypes.includes(cuisine) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 transition-colors px-3 py-1"
                  onClick={() => toggleArrayFilter('cuisineTypes', cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>

          {/* Distance Filters (Single-select) */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Distance</p>
            <div className="flex flex-wrap gap-2">
              {DISTANCE_OPTIONS.map((option) => (
                <Badge
                  key={option.value}
                  variant={filters.distance === option.value ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 transition-colors px-3 py-1"
                  onClick={() => setDistance(filters.distance === option.value ? null : option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions Filters */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Dietary Restrictions</p>
            <div className="flex flex-wrap gap-2">
              {DIETARY_RESTRICTIONS.map((restriction) => (
                <Badge
                  key={restriction}
                  variant={filters.dietaryRestrictions.includes(restriction) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 transition-colors px-3 py-1"
                  onClick={() => toggleArrayFilter('dietaryRestrictions', restriction)}
                >
                  {restriction}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSearch;
