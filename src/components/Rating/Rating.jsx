import React, { useState } from "react";

const Rating = ({ initialRating, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating || 0);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);

    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleStarClick(star)}
          style={{
            cursor: "pointer",
            color: star <= rating ? "orange" : "gray",
            fontSize: "2rem",

            marginRight: "5px",
          }}
        >
          &#9733; {/* Unicode character for a star */}
        </span>
      ))}
    </div>
  );
};
export default Rating;
