import { FC, ReactNode, useEffect, useRef, useCallback } from "react";
import { Grid } from "@mui/material";
import CardTemplatePlaceholder from "./placeholders/CardTemplatePlaceHolder";

interface TemplatesInfiniteScrollProps {
  loading: boolean;
  onLoadMore: () => void;
  children: ReactNode;
  hasMore?: boolean;
}

const TemplatesInfiniteScroll: FC<TemplatesInfiniteScrollProps> = ({ loading, onLoadMore, children, hasMore }) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastTemplateElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"16px"}
    >
      {children}
      {loading && <CardTemplatePlaceholder count={1} />}
      <div ref={lastTemplateElementRef}></div>
    </Grid>
  );
};

export default TemplatesInfiniteScroll;
