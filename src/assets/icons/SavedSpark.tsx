import React from "react";

const SavedSpark = ({ size = "16", color = "#1B1B1E", opacity = 0.8 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill={color}
    >
      <g opacity={opacity}>
        <path
          d="M9.33317 1.33203H3.99984C3.64622 1.33203 3.30708 1.47251 3.05703 1.72256C2.80698 1.9726 2.6665 2.31174 2.6665 2.66536V13.332C2.6665 13.6857 2.80698 14.0248 3.05703 14.2748C3.30708 14.5249 3.64622 14.6654 3.99984 14.6654H11.9998C12.3535 14.6654 12.6926 14.5249 12.9426 14.2748C13.1927 14.0248 13.3332 13.6857 13.3332 13.332V5.33203L9.33317 1.33203ZM11.9998 13.332H3.99984V2.66536H8.6665V5.9987H11.9998V13.332Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default SavedSpark;
