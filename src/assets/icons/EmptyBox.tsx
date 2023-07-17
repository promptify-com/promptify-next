import React from "react";

export const EmptyBox: React.FC = () => {
  return (
    <svg
      width="90"
      height="43"
      viewBox="0 0 90 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 17H90V37C90 40.3137 87.3137 43 84 43H6C2.68629 43 0 40.3137 0 37V17Z"
        fill="#E7E7F0"
      />
      <path
        d="M60 17L29 17L29 26C29 28.2091 30.7909 30 33 30L56 30C58.2091 30 60 28.2091 60 26L60 17Z"
        fill="#F5F4FA"
      />
      <path d="M0 17L90 17L75.9996 0H14.0004L0 17Z" fill="#F5F4FA" />
      <path d="M0 17L14 17V0L0 17Z" fill="#E1E2EC" />
      <path d="M90 17L76 17V0L90 17Z" fill="#E1E2EC" />
    </svg>
  );
};
