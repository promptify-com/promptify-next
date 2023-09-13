import React from "react";

const Terminal = ({ size = "16", color = "#1B1B1E", opacity = 0.8 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <g opacity={opacity}>
        <path
          d="M10.9583 15.8333V13.3333H17.625V15.8333H10.9583ZM7.20835 10.8333L2.18335 5.83325H5.71668L9.85002 9.95825C10.3333 10.4499 10.3333 11.2499 9.85002 11.7249L5.74168 15.8333H2.20835L7.20835 10.8333Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default Terminal;
