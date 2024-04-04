import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import TemplatesCarousel from "@/components/Documents/TemplatesCarousel";
import DocumentsContainer from "@/components/Documents/DocumentsContainer";
import { useGetExecutionsByMeQuery } from "@/core/api/executions";
import { useAppSelector } from "@/hooks/useStore";
import { SEO_DESCRIPTION } from "@/common/constants";
import type { ExecutionsFilterParams, TemplatesExecutions } from "@/core/api/dto/templates";
import useBrowser from "@/hooks/useBrowser";
import TemplatesPaginatedList from "@/components/TemplatesPaginatedList";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetExecutedTemplatesQuery } from "@/core/api/templates";
import { usePrepareTemplatesExecutions } from "@/components/Documents/Hooks/usePrepareTemplatesExecutions";

const PAGINATION_LIMIT = 12;
const SCROLL_THRESHOLD = 24;

function DocumentsPage() {
  const { isMobile } = useBrowser();
  const observer = useRef<IntersectionObserver | null>(null);
  const filter = useAppSelector(state => state.documents);
  const [offset, setOffset] = useState(0);
  const [executions, setExecutions] = useState<TemplatesExecutions[]>([]);

  const { data: templates, isLoading: isTemplatesLoading } = useGetExecutedTemplatesQuery();

  const params: ExecutionsFilterParams = useMemo(
    () => ({
      offset,
      limit: PAGINATION_LIMIT,
      engineId: filter.engine?.id,
      engine_type: filter.contentTypes,
    }),
    [filter.contentTypes, filter.engine?.id, offset],
  );

  const {
    data: fetchExecutions,
    isLoading: isExecutionsLoading,
    isFetching: isExecutionsFetching,
  } = useGetExecutionsByMeQuery(params);

  const { executions: templatesExecutions } = usePrepareTemplatesExecutions(
    executions,
    templates ?? [],
    isTemplatesLoading,
  );

  const handleNextPage = () => {
    if (!!fetchExecutions?.next) {
      setOffset(prevOffset => prevOffset + PAGINATION_LIMIT);
    }
  };

  useEffect(() => {
    setOffset(0);
  }, [filter.contentTypes, filter.engine?.id, filter.template, filter.status]);

  useEffect(() => {
    if (fetchExecutions?.results) {
      if (offset === 0) {
        setExecutions(fetchExecutions?.results);
      } else {
        setExecutions(prevTemplates => prevTemplates.concat(fetchExecutions?.results));
      }
    }
  }, [fetchExecutions?.results]);

  const lastExecutionElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isExecutionsFetching) return;

      if (observer.current) observer.current.disconnect();
      if (executions.length >= SCROLL_THRESHOLD) {
        observer.current?.disconnect();
        return;
      }

      const rowHeight = isMobile ? 145 : 80;
      const margin = `${2 * rowHeight}px`;

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && !!fetchExecutions?.next) {
            handleNextPage();
          }
        },
        { rootMargin: margin },
      );
      if (node) observer.current.observe(node);
    },
    [isExecutionsFetching, !!fetchExecutions?.next, executions.length],
  );

  const filteredExecutions = useMemo(() => {
    return templatesExecutions.filter(exec => {
      const isDraft = filter.status === "draft" && !exec.is_favorite;
      const isSaved = filter.status === "saved" && exec.is_favorite;
      const statusMatch = !filter.status || isDraft || isSaved;
      const templateMatch = !filter.template || exec.template?.id === filter.template;

      return statusMatch && templateMatch;
    });
  }, [templatesExecutions, filter.status, filter.template]);

  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);

  const hasNext = Boolean(fetchExecutions?.next && filteredExecutions.length);

  return (
    <Protected>
      <Layout>
        <Stack
          gap={3}
          sx={{
            p: "40px 72px",
            ...(!isDocumentsFiltersSticky && {
              maxWidth: "1112px",
              m: "auto",
            }),
          }}
        >
          <TemplatesCarousel
            templates={templates}
            isLoading={isTemplatesLoading}
          />
          <TemplatesPaginatedList
            loading={isExecutionsFetching}
            hasNext={hasNext}
            onNextPage={handleNextPage}
            buttonText={isExecutionsFetching ? "Loading..." : "Load more"}
            variant="outlined"
            endIcon={
              isExecutionsFetching && (
                <CircularProgress
                  size={24}
                  color="primary"
                />
              )
            }
          >
            <DocumentsContainer
              executions={filteredExecutions}
              isLoading={isTemplatesLoading || isExecutionsLoading}
            />
            <div ref={lastExecutionElementRef}></div>
          </TemplatesPaginatedList>
        </Stack>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps({ params }: any) {
  return {
    props: {
      title: "Documents",
      description: SEO_DESCRIPTION,
    },
  };
}

export default DocumentsPage;
