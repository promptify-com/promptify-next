import { FC, ReactNode, useRef, useCallback } from "react";
import { Grid } from "@mui/material";
import CardTemplatePlaceholder from "./placeholders/CardTemplatePlaceHolder";
import { determineIsMobile } from "@/common/helpers/determineIsMobile";

interface TemplatesInfiniteScrollProps {
  loading: boolean;
  onLoadMore: () => void;
  children: ReactNode;
  hasMore?: boolean;
}

const TemplatesInfiniteScroll: FC<TemplatesInfiniteScrollProps> = ({ loading, onLoadMore, children, hasMore }) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const isMobile = determineIsMobile();
  console.log(isMobile);
  const lastTemplateElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      console.log(isMobile);
      const rowHeight = isMobile ? 145 : 80;
      const margin = `${2 * rowHeight}px`;

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore();
          }
        },
        { rootMargin: margin },
      );
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
      {loading && <CardTemplatePlaceholder count={4} />}
      <div ref={lastTemplateElementRef}></div>
    </Grid>
  );
};

export default TemplatesInfiniteScroll;
