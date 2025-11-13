import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const LuxuryLoading: React.FC = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="text-center py-12">
      <div className="inline-block h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="mt-6 font-display text-xl text-foreground">Curating your recommendations...</p>
      <p className="text-sm text-muted-foreground mt-2">Our AI is analyzing reviews and rankings</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default LuxuryLoading;
