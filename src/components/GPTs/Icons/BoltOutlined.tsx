function BoltOutlined({ size, color }: { size: string; color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M14.0833 2.1665L3.25 15.1665H13L11.9167 23.8332L22.75 10.8332H13L14.0833 2.1665Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default BoltOutlined;
