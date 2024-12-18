import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ratingServices from '../../services/ratingServices';
import { ArrowLeftIcon, RefreshCwIcon } from 'lucide-react';




const Review = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(false);

  // Fetch reviews when component mounts
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true)
    try {
      // Assuming you want to get product ratings
      const response = await ratingServices.getMerchantShopRatings();
      setReviews(response.ratings);
      // setLoading(false);
    } catch (err) {
      setError(err);
      // setLoading(false);
      console.error('Failed to fetch reviews:', err);
    } finally{
      setLoading(false)
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const ratingPercentages = {
    5: (reviews.filter(r => r.rating === 5).length / reviews.length) * 100 || 0,
    4: (reviews.filter(r => r.rating === 4).length / reviews.length) * 100 || 0,
    3: (reviews.filter(r => r.rating === 3).length / reviews.length) * 100 || 0,
    2: (reviews.filter(r => r.rating === 2).length / reviews.length) * 100 || 0,
    1: (reviews.filter(r => r.rating === 1).length / reviews.length) * 100 || 0
  };

  // Rest of the component remains the same as in the previous implementation
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const handleLike = (id) => {
    const updatedReviews = reviews.map(review =>
      review.id === id ? { ...review, likes: review.likes + 1 } : review
    );
    setReviews(updatedReviews);
  };

  const handleDislike = (id) => {
    const updatedReviews = reviews.map(review =>
      review.id === id ? { ...review, dislikes: review.dislikes + 1 } : review
    );
    setReviews(updatedReviews);
  };

  const toggleReviews = () => {
    setVisibleReviews(visibleReviews === 2 ? reviews.length : 2);
  };

  // Loading and error handling
  // if (loading) {
  //   return <LoadingPage layout="sidebar" />;
  // }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Error loading reviews: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="flex items-center bg-blue-900 text-white p-4 rounded-t-xl">
          <ArrowLeftIcon className="mr-4 cursor-pointer" onClick={() => { navigate(-1) }} />
          <h1 className="text-xl font-bold flex-grow">Reviews</h1>
          <RefreshCwIcon
            className={`cursor-pointer ${loading ? "animate-spin" : ""}`}
            onClick={fetchReviews}
          />
        </div>

        <div className="p-6 space-y-4">

          {/* Header Section */}
          <div className="bg-white rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold text-gray-900">Customer Reviews</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-5xl font-bold text-blue-900">{averageRating.toFixed(1)}</span>
                    </div>
                    <div>
                      <StarRating rating={Math.round(averageRating)} />
                      <p className="text-sm text-gray-500 mt-1">Based on {reviews.length} reviews</p>
                    </div>
                  </div>
                </div>
                {/* Rating Bars */}
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 w-24">
                        <span className="text-xl font-medium text-gray-600">{stars}</span>
                      </div>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-900 rounded-full"
                          style={{ width: `${ratingPercentages[stars]}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-16">
                        {Math.round(ratingPercentages[stars])}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-6 md:pl-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filter Reviews</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === 'all'
                        ? 'bg-blue-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      All Reviews
                    </button>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFilter(rating)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === rating
                          ? 'bg-blue-800 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {rating} Stars
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sort By</h3>
                  <div className="flex flex-wrap gap-2">
                    {['newest', 'oldest', 'highest', 'lowest'].map((sortOption) => (
                      <button
                        key={sortOption}
                        onClick={() => setSort(sortOption)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${sort === sortOption
                          ? 'bg-blue-800 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {sortOption}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            {reviews
              .filter((review) => filter === 'all' || review.rating === filter)
              .slice(0, visibleReviews)
              .map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{review.title}</h3>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <StarRating rating={review.rating} />
                  <p className="mt-3 text-gray-600">{review.comment}</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <button
                      onClick={() => handleLike(review.id)}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      👍 {review.likes}
                    </button>
                    <button
                      onClick={() => handleDislike(review.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      👎 {review.dislikes}
                    </button>
                  </div>
                </div>
              ))}
          </div>
          {reviews.length > 2 && (
            <button
              onClick={toggleReviews}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
            >
              {visibleReviews === 2 ? 'Show All Reviews' : 'Show Less'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;