
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-12 text-center mt-8">
    <div className="w-16 h-16 border-4 border-rose-500 border-dotted rounded-full animate-spin"></div>
    <p className="mt-6 text-xl font-semibold text-gray-700">Finding the best spots for you...</p>
    <p className="text-gray-500 mt-2 max-w-sm">
      Our AI is reading reviews, analyzing sentiment, and curating your personalized list. This might take a moment.
    </p>
  </div>
);

export default LoadingSpinner;
