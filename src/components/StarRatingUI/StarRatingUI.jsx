import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";

const StarRatingUI = ({ rating, color = "white" }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    let starIcon;
    if (index < Math.floor(rating)) {
      // Hiển thị sao đầy
      starIcon = faStar;
    } else if (index === Math.floor(rating) && rating % 1 !== 0) {
      // Hiển thị nửa sao nếu có rating là số thập phân (4.5, 3.5, v.v.)
      starIcon = faStarHalfStroke;
    } else {
      // Hiển thị sao rỗ
      starIcon = faStar;
    }

    return (
      <FontAwesomeIcon
        key={index}
        icon={starIcon}
        style={{
          color: index < rating ? "gold" : color, // Màu vàng khi được chọn, màu xám khi không được chọn
          fontSize: "1em",
        }}
      />
    );
  });

  return <div>{stars}</div>;
};

export default StarRatingUI;
