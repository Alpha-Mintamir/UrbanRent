import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import AccountNav from '@/components/ui/AccountNav';
import Spinner from '@/components/ui/Spinner';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // This is a placeholder - you'll need to implement the API endpoint
        const { data } = await axiosInstance.get('/places/user-reviews');
        setReviews(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // If the API doesn't exist yet, just show empty state
        setReviews([]);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              i < rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="px-4 pt-20">
      <AccountNav />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">የእኔ ንብረቶች ግምገማዎች</h1>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <h2 className="text-2xl font-semibold mb-2">ምንም ግምገማዎች የሉም</h2>
            <p className="text-gray-600 mb-6">
              እስካሁን ለእርስዎ ንብረቶች ምንም ግምገማዎች አልተሰጡም። ደንበኞች ንብረትዎን ሲከራዩ እና ሲጠቀሙ ግምገማዎች ይታያሉ።
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {review.propertyName}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    {review.guestName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{review.guestName}</p>
                    <p className="text-gray-500 text-sm">ደንበኛ</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
