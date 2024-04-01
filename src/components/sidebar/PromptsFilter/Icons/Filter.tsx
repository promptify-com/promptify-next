function FilterIcon({ fill = "#032100" }: { fill?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_2516_9043"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="32"
        height="32"
      >
        <rect
          width="32"
          height="32"
          fill="#D9D9D9"
        />
      </mask>
      <g mask="url(#mask0_2516_9043)">
        <path
          d="M6.8975 26.3331V16.9228H4.23083V14.9229H11.5641V16.9228H8.89743V26.3331H6.8975ZM6.8975 11.7434V5.6665H8.89743V11.7434H6.8975ZM12.3334 11.7434V9.74344H15.0001V5.6665H17V9.74344H19.6667V11.7434H12.3334ZM15.0001 26.3331V14.9229H17V26.3331H15.0001ZM23.1026 26.3331V22.2562H20.436V20.2562H27.7692V22.2562H25.1026V26.3331H23.1026ZM23.1026 17.0767V5.6665H25.1026V17.0767H23.1026Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default FilterIcon;
