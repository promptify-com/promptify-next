import { useCallback, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TemplatesPaginatedList from "@/components/TemplatesPaginatedList";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { isDesktopViewPort } from "@/common/helpers";

import type { Templates } from "@/core/api/dto/templates";

interface Props {
  loading: boolean;
  hasNext: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  popularTemplate: Templates[];
  isExplorePage: boolean;
  itemPerPage: number;
}

function PopularTemplate({
  loading,
  hasNext,
  onNextPage,
  onPrevPage,
  popularTemplate,
  isExplorePage,
  itemPerPage,
}: Props) {
  const [itemCount, setItemCount] = useState(0);
  const [useLoadMore, setUseLoadMore] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const isMobile = !isDesktopViewPort();

  const SCROLL_THRESHOLD = 24;

  const lastTemplateElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      if (itemCount >= SCROLL_THRESHOLD) {
        setUseLoadMore(true);
        return;
      }

      const rowHeight = isMobile ? 145 : 80;
      const margin = `${2 * rowHeight}px`;

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasNext) {
            onNextPage();
            setItemCount(prevCount => prevCount + itemPerPage);
          }
        },
        { rootMargin: margin },
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasNext, itemCount],
  );

  return (
    <Stack
      py={{ xs: "30px", md: "48px" }}
      gap={3}
    >
      <Stack p={"8px 16px"}>
        <Typography
          fontSize={{ xs: 28, md: 32 }}
          fontWeight={400}
          color={"#2A2A3C"}
        >
          Most popular templates:
        </Typography>
      </Stack>
      <TemplatesPaginatedList
        loading={loading}
        hasNext={hasNext && useLoadMore}
        onNextPage={() => {
          onNextPage();
          setItemCount(prevCount => prevCount + itemPerPage);
        }}
        hasPrev={false}
        onPrevPage={onPrevPage}
        isExplorePage={isExplorePage}
      >
        <TemplatesSection
          templateLoading={loading}
          templates={popularTemplate}
          type="popularTemplates"
          isExplorePage={isExplorePage}
        />
        <div ref={lastTemplateElementRef}></div>
      </TemplatesPaginatedList>
    </Stack>
  );
}

export default PopularTemplate;
