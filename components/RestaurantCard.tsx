import React from 'react';
import type { Restaurant } from '../types';
import { StarIcon, ThumbsUpIcon, ThumbsDownIcon, GoogleIcon, QuoteIcon } from './icons';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} className="w-5 h-5 text-amber-400" filled />
      ))}
      {partialStar > 0 && (
         <div className="relative">
            <StarIcon className="w-5 h-5 text-gray-300" filled/>
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
                <StarIcon className="w-5 h-5 text-amber-400" filled/>
            </div>
         </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300" filled />
      ))}
    </div>
  );
};


const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200/80 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-gray-800">{restaurant.title}</h3>
        
        {/* AI Rating */}
        <div className="flex items-center mt-2 gap-2">
          <StarRating rating={restaurant.aiRating} />
          <span className="text-gray-600 font-semibold text-lg">{restaurant.aiRating.toFixed(1)}</span>
          <span className="text-gray-400 text-sm">(AI Rating)</span>
        </div>
        
        {/* Google Rating */}
        {restaurant.googleRating && restaurant.googleReviewsCount && (
            <div className="flex items-center mt-1 gap-2 text-sm">
                <GoogleIcon className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 font-medium">
                    {restaurant.googleRating.toFixed(1)}
                </span>
                <span className="text-gray-500">
                    ({restaurant.googleReviewsCount.toLocaleString()} reviews)
                </span>
            </div>
        )}
        
        <div className="mt-4 border-t pt-4 space-y-4">
            <div>
              <h4 className="flex items-center text-sm font-semibold text-green-600">
                <ThumbsUpIcon className="w-4 h-4 mr-2" />
                What people liked
              </h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-700">
                {restaurant.pros.map((pro, i) => (
                    <li key={`pro-${i}`} className="flex items-start">
                        <QuoteIcon className="w-4 h-4 text-green-500 flex-shrink-0 mr-2 mt-0.5" />
                        <p className="italic">"{pro}"</p>
                    </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="flex items-center text-sm font-semibold text-red-600">
                <ThumbsDownIcon className="w-4 h-4 mr-2" />
                What people disliked
              </h4>
              <ul className="mt-2 space-y-2 text-sm text-gray-700">
                {restaurant.cons.map((con, i) => (
                    <li key={`con-${i}`} className="flex items-start">
                        <QuoteIcon className="w-4 h-4 text-red-500 flex-shrink-0 mr-2 mt-0.5" />
                        <p className="italic">"{con}"</p>
                    </li>
                ))}
              </ul>
            </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t">
        <a
          href={restaurant.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          View on Google Maps
        </a>
      </div>
    </div>
  );
};

export default RestaurantCard;