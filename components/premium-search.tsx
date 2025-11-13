import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, MapPin } from 'lucide-react';
import { ATTRIBUTE_FILTERS, INSPIRATIONS } from '../constants';

interface PremiumSearchProps {
  query: string;
  setQuery: (q: string) => void;
  activeFilters: string[];
  setActiveFilters: (f: string[]) => void;
  onSearch: () => void;
  onRefreshLocation: () => void;
  disabled?: boolean;
}

const PremiumSearch: React.FC<PremiumSearchProps> = ({
  query,
  setQuery,
  activeFilters,
  setActiveFilters,
  onSearch,
  onRefreshLocation,
  disabled
}) => {
  const handleFilterClick = (filter: string) => {
    setActiveFilters(
      activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters, filter]
    );
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
      <div className="flex flex-col gap-4">
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

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Atmosphere</p>
          <div className="flex flex-wrap gap-2">
            {ATTRIBUTE_FILTERS.map((filter) => (
              <Badge
                key={filter}
                variant={activeFilters.includes(filter) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/90 transition-colors px-3 py-1"
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSearch;
