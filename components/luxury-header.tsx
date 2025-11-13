import React from 'react';
import { Separator } from '@/components/ui/separator';

const LuxuryHeader: React.FC = () => (
  <header className="bg-card border-b">
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="text-center">
        <h1 className="font-display text-5xl font-bold text-foreground tracking-tight">
          Halulu is Hungry
        </h1>
        <p className="font-body text-muted-foreground mt-2 text-sm uppercase tracking-[0.2em]">
          AI-Curated Restaurant Discovery
        </p>
      </div>
    </div>
    <Separator />
  </header>
);

export default LuxuryHeader;
