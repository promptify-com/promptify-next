const LogoutIcon = ({ size = "24", color = "#1B1B1E" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <mask
        id="mask0_2141_10030"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={size}
        height={size}
      >
        <rect
          width={size}
          height={size}
          fill="#D9D9D9"
        />
      </mask>
      <g mask="url(#mask0_2141_10030)">
        <path
          d="M5.3077 20.5C4.80257 20.5 4.375 20.325 4.025 19.975C3.675 19.625 3.5 19.1974 3.5 18.6923V5.3077C3.5 4.80257 3.675 4.375 4.025 4.025C4.375 3.675 4.80257 3.5 5.3077 3.5H12.0096V4.99998H5.3077C5.23077 4.99998 5.16024 5.03203 5.09612 5.09613C5.03202 5.16024 4.99997 5.23077 4.99997 5.3077V18.6923C4.99997 18.7692 5.03202 18.8397 5.09612 18.9038C5.16024 18.9679 5.23077 19 5.3077 19H12.0096V20.5H5.3077ZM16.2308 16.2692L15.1923 15.1846L17.6269 12.75H9.09613V11.25H17.6269L15.1923 8.81538L16.2308 7.7308L20.5 12L16.2308 16.2692Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default LogoutIcon;
