import React from "react";

export const ElectricBoltIcon = ({ color = "#1C1B1F", small = false }) =>
  small ? (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.66667 1.3335L1 9.3335H7L6.33333 14.6668L13 6.66683H7L7.66667 1.3335Z"
        stroke={color}
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ) : (
    <svg
      width="49"
      height="48"
      viewBox="0 0 49 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="electric_bolt">
        <mask
          id="mask0_1757_51426"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="49"
          height="48"
        >
          <rect
            id="Bounding box"
            x="0.333374"
            width="48"
            height="48"
            fill="#D9D9D9"
          />
        </mask>
        <g mask="url(#mask0_1757_51426)">
          <path
            id="electric_bolt_2"
            d="M15.2295 43.05L23.6641 28.2769L7.33337 26.3731L31.141 4.95007H33.4756L24.9448 19.7424L41.3333 21.627L17.5449 43.05H15.2295ZM21.5986 36.0655L36.1411 23.3385L21.3103 21.6154L27.1065 11.8768L12.4948 24.6731L27.3064 26.4231L21.5986 36.0655Z"
            fill={color}
          />
        </g>
      </g>
    </svg>
  );
