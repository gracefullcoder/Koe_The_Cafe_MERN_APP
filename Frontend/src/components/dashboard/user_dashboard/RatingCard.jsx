import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { patchData } from '../../../helperfunction';

function RatingCard({ orderDetail, onSubmit, onCancel }) {
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [overallRating, setOverallRating] = useState(null);
  const [overallHover, setOverallHover] = useState(null);
  const [overallComment, setOverallComment] = useState('');

  const handleDishRating = (dishId, ratingValue) => {
    setRatings(prevRatings => ({ ...prevRatings, [dishId]: ratingValue }));
  };

  const handleDishComment = (dishId, comment) => {
    setComments(prevComments => ({ ...prevComments, [dishId]: comment }));
  };

  const handleSubmit = async (orderId) => {
    const reviews = orderDetail.orders.map(order => ({
      dishId: order.dish._id,
      dishName: order.dish.dishName,
      rating: ratings[order.dish._id] || null,
      comment: comments[order.dish._id] || '',
    }));

    if (reviews.every(review => review.rating) && overallRating) {
      let response = await patchData(`order/rating/${orderId}`, {
        overallRating,
        overallComment,
        dishReviews: reviews
      })

      if (response.success) onCancel(false);

    } else {
      alert('Please provide a rating for all dishes and the overall order.');
    }
  };

  return (
    <div className="rating-card">
      {orderDetail.review && orderDetail.review.rating ?
        <>
          <h2>Thanks, FeedBack Already Submited!</h2>
          <div className="rating-buttons">
            <button className="cancel-btn" onClick={() => onCancel(false)}>Close</button>
          </div>
        </>
        :
        <>
          <h2>Rate Your Order</h2>

          <div className="overall-rating">
            <h3>Overall Order Rating</h3>
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="overall-rating"
                      value={ratingValue}
                      onClick={() => setOverallRating(ratingValue)}
                    />
                    <FaStar
                      className="star"
                      color={ratingValue <= (overallHover || overallRating) ? '#ffc107' : '#e4e5e9'}
                      size={30}
                      onMouseEnter={() => setOverallHover(ratingValue)}
                      onMouseLeave={() => setOverallHover(null)}
                    />
                  </label>
                );
              })}
            </div>
            <textarea
              className="comment-box"
              placeholder="Write your overall review here..."
              value={overallComment}
              onChange={(e) => setOverallComment(e.target.value)}
            ></textarea>
          </div>

          {orderDetail.orders.map(order => (
            <div key={order.dish._id} className="dish-rating">
              <p>{order.dish.dishName}</p>
              <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <label key={index}>
                      <input
                        type="radio"
                        name={`rating-${order.dish._id}`}
                        value={ratingValue}
                        onClick={() => handleDishRating(order.dish._id, ratingValue)}
                      />
                      <FaStar
                        className="star"
                        color={ratingValue <= (ratings[order.dish._id] || 0) ? '#ffc107' : '#e4e5e9'}
                        size={30}
                        onMouseEnter={() => setRatings(prevRatings => ({ ...prevRatings, [order.dish._id]: ratingValue }))}
                        onMouseLeave={() => setRatings(prevRatings => ({ ...prevRatings, [order.dish._id]: ratings[order.dish._id] }))}
                      />
                    </label>
                  );
                })}
              </div>
              <textarea
                className="comment-box"
                placeholder="Write your review here..."
                value={comments[order.dish._id] || ''}
                onChange={(e) => handleDishComment(order.dish._id, e.target.value)}
              ></textarea>
            </div>
          ))}

          <div className="rating-buttons">
            <button className="submit-btn" onClick={() => handleSubmit(orderDetail._id)}>Submit</button>
            <button className="cancel-btn" onClick={() => onCancel(false)}>Cancel</button>
          </div>
        </>
      }
    </div>
  );
}

export default RatingCard;
