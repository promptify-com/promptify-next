import { useWindowSize } from "usehooks-ts";

export const determineIsMobile = () => {
  const { width: windowWidth } = useWindowSize();
  return windowWidth < 900;
};
