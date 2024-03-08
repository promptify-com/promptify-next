import { useCallback, useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TemplatesPaginatedList from "@/components/TemplatesPaginatedList";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";

import type { FilterParams, Templates } from "@/core/api/dto/templates";
import useBrowser from "@/hooks/useBrowser";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetTemplatesByFilterQuery } from "@/core/api/templates";

interface Props {
  catId?: number;
}

function PopularTemplates({ catId }: Props) {
  const observer = useRef<IntersectionObserver | null>(null);
  const { isMobile } = useBrowser();
  const [offset, setOffset] = useState(0);
  const [allTemplates, setAllTemplates] = useState<Templates[]>([]);
  const PAGINATION_LIMIT = 12;
  const SCROLL_THRESHOLD = 24;

  const params: FilterParams = {
    offset,
    limit: PAGINATION_LIMIT,
    ordering: "-runs",
    isInternal: false,
    categoryId: catId,
  };

  const { data, isLoading, isFetching } = useGetTemplatesByFilterQuery(params);

  const handleNextPage = () => {
    if (!!data?.next) {
      setOffset(prevOffset => prevOffset + PAGINATION_LIMIT);
    }
  };

  useEffect(() => {
    if (data?.results) {
      if (offset === 0) {
        setAllTemplates(data?.results);
      } else {
        setAllTemplates(prevTemplates => prevTemplates.concat(data?.results));
      }
    }
  }, [data?.results]);

  const lastTemplateElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      if (allTemplates.length >= SCROLL_THRESHOLD) {
        observer.current?.disconnect();
        return;
      }

      const rowHeight = isMobile ? 145 : 80;
      const margin = `${2 * rowHeight}px`;

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && !!data?.next) {
            handleNextPage();
          }
        },
        { rootMargin: margin },
      );
      if (node) observer.current.observe(node);
    },
    [isFetching, !!data?.next, allTemplates.length],
  );

  return (
    <Stack gap={3}>
      <Stack
        p={"8px 16px"}
        mb={"-24px"}
      >
        <Typography
          fontSize={{ xs: 28, md: 32 }}
          fontWeight={400}
          color={"#2A2A3C"}
        >
          Most popular templates:
        </Typography>
      </Stack>
      <TemplatesPaginatedList
        loading={isFetching}
        hasNext={!!data?.next}
        onNextPage={handleNextPage}
        hasPrev={false}
        buttonText={isFetching ? "Loading..." : "Load more"}
        variant="outlined"
        endIcon={
          isFetching && (
            <CircularProgress
              size={24}
              color="primary"
            />
          )
        }
      >
        <Box sx={{ px: { xs: "20px", md: "0px" } }}>
          <TemplatesSection
            templateLoading={isLoading}
            templates={allTemplates}
            type="popularTemplates"
            bgColor="surfaceContainerLow"
          />
        </Box>
        <div ref={lastTemplateElementRef}></div>
      </TemplatesPaginatedList>
    </Stack>
  );
}

export default PopularTemplates;
