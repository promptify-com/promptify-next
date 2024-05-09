import { useCallback, useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PaginatedList from "@/components/PaginatedList";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import type { FilterParams, Templates, TemplatesWithPagination } from "@/core/api/dto/templates";
import useBrowser from "@/hooks/useBrowser";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetTemplatesByFilterQuery } from "@/core/api/templates";
interface Props {
  catId?: number;
  initTemplates?: TemplatesWithPagination | null;
}

function PopularTemplates({ catId, initTemplates }: Props) {
  const PAGINATION_LIMIT = 12;
  const SCROLL_THRESHOLD = 24;
  const INIT_OFFSET = initTemplates?.results.length ?? 0;
  const observer = useRef<IntersectionObserver | null>(null);
  const { isMobile } = useBrowser();
  const [offset, setOffset] = useState(INIT_OFFSET);
  const [allTemplates, setAllTemplates] = useState<Templates[]>(initTemplates?.results ?? []);

  const params: FilterParams = {
    offset,
    limit: PAGINATION_LIMIT,
    ordering: "-runs",
    isInternal: false,
    categoryId: catId,
    status: "published",
  };

  const skipFirstFetch = Boolean(initTemplates?.results.length && offset === INIT_OFFSET);

  const { data, isLoading, isFetching } = useGetTemplatesByFilterQuery(params, {
    skip: skipFirstFetch,
  });

  const handleNextPage = () => {
    setOffset(prevOffset => prevOffset + PAGINATION_LIMIT);
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
      const hasNext = skipFirstFetch ? !!initTemplates?.next : !!data?.next;

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasNext) {
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
          fontSize={{ xs: 24, md: 32 }}
          fontWeight={400}
          color={"onSurface"}
          lineHeight={"120%"}
          letterSpacing={"0.17px"}
          fontStyle={"normal"}
        >
          Most popular templates:
        </Typography>
      </Stack>
      <PaginatedList
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
            templateLoading={skipFirstFetch && isLoading}
            templates={allTemplates}
            type="popularTemplates"
          />
        </Box>
        <div ref={lastTemplateElementRef}></div>
      </PaginatedList>
    </Stack>
  );
}

export default PopularTemplates;
