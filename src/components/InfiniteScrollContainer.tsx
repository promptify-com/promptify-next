import { FC, ReactNode, useRef, useCallback } from "react";
import Grid from "@mui/material/Grid";
import ArrowRight from "@mui/icons-material/ArrowRight";
import CardTemplatePlaceholder from "./placeholders/CardTemplatePlaceHolder";
import PaginatedList from "./PaginatedList";
import useBrowser from "@/hooks/useBrowser";

interface InfiniteScrollContainerProps {
  loading: boolean;
  onLoadMore: () => void;
  children: ReactNode;
  hasMore?: boolean;
  isInfiniteScrolling?: boolean;
  hasPrev?: boolean;
  onLoadLess?: () => void;
  placeholder?: ReactNode;
}

const InfiniteScrollContainer: FC<InfiniteScrollContainerProps> = ({
  loading,
  onLoadMore,
  children,
  hasMore,
  isInfiniteScrolling = true,
  hasPrev,
  onLoadLess = () => {},
  placeholder,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const { isMobile } = useBrowser();

  const lastTemplateElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

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

  const PlaceholderElement = placeholder ?? <CardTemplatePlaceholder count={5} />;

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"16px"}
    >
      {isInfiniteScrolling ? (
        <>
          {children}
          {loading && PlaceholderElement}
          <div ref={lastTemplateElementRef}></div>
        </>
      ) : (
        <PaginatedList
          hasNext={hasMore}
          hasPrev={hasPrev}
          canBeShown={hasMore || hasPrev}
          onNextPage={onLoadMore}
          onPrevPage={onLoadLess}
          loading={loading}
          endIcon={<ArrowRight />}
        >
          {loading ? PlaceholderElement : <>{children}</>}
        </PaginatedList>
      )}
    </Grid>
  );
};

export default InfiniteScrollContainer;
