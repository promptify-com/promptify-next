import { useEffect, useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import TemplatesCarousel from "@/components/Documents/TemplatesCarousel";
import DocumentsContainer from "@/components/Documents/DocumentsContainer";
import { useGetExecutionsByMeQuery } from "@/core/api/executions";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { SEO_DESCRIPTION } from "@/common/constants";
import type { ExecutionsFilterParams, TemplatesExecutions } from "@/core/api/dto/templates";
import TemplatesPaginatedList from "@/components/TemplatesPaginatedList";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetExecutedTemplatesQuery } from "@/core/api/templates";
import { usePrepareTemplatesExecutions } from "@/components/Documents/Hooks/usePrepareTemplatesExecutions";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/system";
import { theme } from "@/theme";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import { setDocumentsTemplate } from "@/core/store/documentsSlice";

const PAGINATION_LIMIT = 12;

function DocumentsPage() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(state => state.documents.filter);
  const [offset, setOffset] = useState(0);
  const [executions, setExecutions] = useState<TemplatesExecutions[]>([]);

  const { data: templates, isLoading: isTemplatesLoading } = useGetExecutedTemplatesQuery();

  const params: ExecutionsFilterParams = useMemo(
    () => ({
      offset,
      limit: PAGINATION_LIMIT,
      engineId: filter.engine?.id,
      engine_type: filter.contentTypes,
      template: filter.template ?? undefined,
    }),
    [filter.contentTypes, filter.engine?.id, filter.template, offset],
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

  const filteredExecutions = useMemo(() => {
    return templatesExecutions.filter(exec => {
      const isDraft = filter.status === "draft" && !exec.is_favorite;
      const isSaved = filter.status === "saved" && exec.is_favorite;
      return !filter.status || isDraft || isSaved;
    });
  }, [templatesExecutions, filter.status]);

  const sortedTemplates = [...(templates ?? [])].sort(
    ({ executions: executionsA = [] }, { executions: executionsB = [] }) => {
      return executionsB.length - executionsA.length;
    },
  );

  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);

  const hasNext = Boolean(fetchExecutions?.next && filteredExecutions.length);

  const activeTemplate = templates?.find(template => template.id === filter.template);

  const templateBreadcrumbs = [
    <Link
      key={"0"}
      href="/sparks"
      onClick={e => {
        e.preventDefault();
        dispatch(setDocumentsTemplate(null));
      }}
      sx={breadcrumbStyle}
    >
      All Templates
    </Link>,
    <Typography
      key={"1"}
      sx={{
        ...breadcrumbStyle,
        color: "onSurface",
        ":hover": {
          color: "onSurface",
        },
      }}
    >
      {activeTemplate?.title}
    </Typography>,
  ];

  return (
    <Protected>
      <Layout>
        <Stack
          gap={3}
          sx={{
            p: { md: "40px 72px" },
            mt: { xs: theme.custom.headerHeight.xs, md: 0 },
            width: { xs: "100svw", md: "calc(100% - 144px)" },
            bgcolor: { xs: "surfaceContainerLow", md: "transparent" },
            ...(!isDocumentsFiltersSticky && {
              maxWidth: "1112px",
              m: "auto",
            }),
          }}
        >
          {activeTemplate ? (
            <Breadcrumbs
              separator={<ArrowBackIosNew sx={{ fontSize: 14, color: alpha(theme.palette.onSurface, 0.3) }} />}
              sx={{
                p: { xs: "24px 16px 0", md: 0 },
              }}
            >
              {templateBreadcrumbs}
            </Breadcrumbs>
          ) : (
            <TemplatesCarousel
              templates={sortedTemplates}
              isLoading={isTemplatesLoading}
            />
          )}
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

const breadcrumbStyle = {
  color: alpha(theme.palette.onSurface, 0.3),
  fontSize: 16,
  fontWeight: 400,
  letterSpacing: ".2px",
  p: "8px",
  ":hover": {
    color: "rgba(0, 0, 0, 0.6)",
  },
};
