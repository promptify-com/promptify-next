import React from "react";

const ArrowRightBottom = ({ size = "16", color = "#1B1B1E", opacity = 0.8 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill={color}
    >
      <g opacity={opacity}>
        <path
          d="M16.6668 13.3333L12.0835 17.9166L10.9002 16.7416L13.4752 14.1666H8.75016C5.7585 14.1666 3.3335 11.7416 3.3335 8.74992V3.33325H5.00016V8.74992C5.00016 10.8333 6.66683 12.4999 8.75016 12.4999H13.4752L10.9085 9.92492L12.0835 8.74992L16.6668 13.3333Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default ArrowRightBottom;
