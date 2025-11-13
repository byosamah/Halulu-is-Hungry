import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Clock, Key, Wifi } from 'lucide-react';

interface LuxuryErrorProps {
  message: string;
}

const LuxuryError: React.FC<LuxuryErrorProps> = ({ message }) => {
  const isQuotaError = message.includes('rate limit') || message.includes('quota') || message.includes('⏱️');
  const isAPIKeyError = message.includes('API key') || message.includes('🔑');
  const isNetworkError = message.includes('network') || message.includes('📡');

  const Icon = isQuotaError ? Clock : isAPIKeyError ? Key : isNetworkError ? Wifi : AlertCircle;
  const variant = isQuotaError ? "default" : "destructive";

  return (
    <Alert variant={variant} className="animate-fade-in">
      <Icon className="h-5 w-5" />
      <AlertTitle className="font-display text-lg">Something needs attention</AlertTitle>
      <AlertDescription className="font-body mt-2">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default LuxuryError;
