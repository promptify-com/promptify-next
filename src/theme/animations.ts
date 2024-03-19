import { keyframes } from "@mui/system";

export const slideToWithTransformAndOpacity = keyframes`
  from {
    transform: translateY(50%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideToWithTransform = ({ from, to }: { from: string; to: string }) => keyframes`
  0%   { transform: ${from}; }
  100% { transform: ${to}; }
`;

export const fadeIn = keyframes`
  0%   { opacity: 0; }
  100% { opacity: 1; }
`;

export const slideUpWithMargin = (
  { start, end }: { start?: string; end?: string } = { start: "0px", end: "-30px" },
) => keyframes`
  0%   { margin-top: ${start}; }
  100% { margin-top: ${end}; }
`;

export const slideUpWithTop = (
  { start, end }: { start?: string; end?: string } = { start: "0px", end: "-20px" },
) => keyframes`
  0%   { top: ${start}; }
  100% { top: ${end}; }
`;
