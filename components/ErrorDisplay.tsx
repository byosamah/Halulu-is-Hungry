
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-md shadow-sm" role="alert">
    <p className="font-bold">Oops! Something went wrong.</p>
    <p>{message}</p>
  </div>
);

export default ErrorDisplay;
