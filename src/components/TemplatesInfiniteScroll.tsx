import { FC, ReactNode, useEffect, useRef } from "react";
import { Grid } from "@mui/material";

interface TemplatesInfiniteScrollProps {
  loading: boolean;
  onLoadMore: () => void;
  children: ReactNode;
}

const TemplatesInfiniteScroll: FC<TemplatesInfiniteScrollProps> = ({ loading, onLoadMore, children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (!loading && containerRef.current && containerRef.current.getBoundingClientRect().bottom <= window.innerHeight) {
      onLoadMore();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Grid
      ref={containerRef}
      display={"flex"}
      flexDirection={"column"}
      gap={"16px"}
    >
      {children}
      {loading && <p>Loading...</p>}
    </Grid>
  );
};

export default TemplatesInfiniteScroll;
