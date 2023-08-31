import React from "react";

const ShareIcon = ({ className, opacity }: { className?: string; opacity?: number }) => {
  return (
    <svg
      width="16"
      className={className}
      opacity={opacity}
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <path
          d="M14 7.9987L9.33333 3.33203V5.9987C4.66667 6.66536 2.66667 9.9987 2 13.332C3.66667 10.9987 6 9.93203 9.33333 9.93203V12.6654L14 7.9987Z"
          fill="#1B1B1E"
        />
      </g>
    </svg>
  );
};

export default ShareIcon;
