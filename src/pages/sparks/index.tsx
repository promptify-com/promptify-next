import { useEffect, useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import TemplatesCarousel from "@/components/Documents/TemplatesCarousel";
import DocumentsContainer from "@/components/Documents/DocumentsContainer";
import { useGetExecutionsByMeQuery } from "@/core/api/executions";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { SEO_DESCRIPTION } from "@/common/constants";
import type { ExecutionsFilterParams, Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import PaginatedList from "@/components/PaginatedList";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetExecutedTemplatesQuery } from "@/core/api/templates";
import { usePrepareTemplatesExecutions } from "@/components/Documents/Hooks/usePrepareTemplatesExecutions";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/system";
import { theme } from "@/theme";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import documentsSlice, {
  initialState as initialDocumentsState,
  setDocumentsTemplate,
} from "@/core/store/documentsSlice";
import lazy from "next/dynamic";
import useBrowser from "@/hooks/useBrowser";
import Box from "@mui/material/Box";
import templatesSlice, { updatePopupTemplate } from "@/core/store/templatesSlice";
import { getExecutionByHash } from "@/hooks/api/executions";
import { getTemplateBySlug } from "@/hooks/api/templates";
import store from "@/core/store";
import GPTDocumentsContainer from "@/components/Documents/GPTDocumentsContainer";

const DocumentsDrawerLazy = lazy(() => import("@/components/sidebar/DocumentsFilter/DocumentsDrawer"), {
  ssr: false,
});
interface TemplateProps {
  fetchedTemplate: Templates;
  hashedExecution: TemplatesExecutions;
}

const PAGINATION_LIMIT = 12;

function DocumentsPage({ fetchedTemplate, hashedExecution }: TemplateProps) {
  const dispatch = useAppDispatch();
  const { isMobile } = useBrowser();
  const filter = useAppSelector(state => state.documents?.filter ?? initialDocumentsState.filter);
  const documentTitle = useAppSelector(state => state.documents?.title);
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
  }, [filter.contentTypes, filter.engine?.id, filter.template, filter.status, documentTitle]);

  useEffect(() => {
    if (fetchExecutions?.results) {
      if (offset === 0) {
        setExecutions(fetchExecutions?.results);
      } else {
        setExecutions(prevTemplates => prevTemplates.concat(fetchExecutions?.results));
      }
    }
  }, [fetchExecutions?.results]);

  useEffect(() => {
    if (!!hashedExecution && !!fetchedTemplate) {
      dispatch(
        updatePopupTemplate({
          data: { ...hashedExecution, template: fetchedTemplate },
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (!store) {
      return;
    }

    store.injectReducers([
      { key: "documents", asyncReducer: documentsSlice },
      { key: "templates", asyncReducer: templatesSlice },
    ]);
  }, [store]);

  const filteredExecutions = useMemo(() => {
    return templatesExecutions.filter(exec => {
      const isDraft = filter.status === "draft" && !exec.is_favorite;
      const isSaved = filter.status === "saved" && exec.is_favorite;
      return !filter.status || isDraft || isSaved;
    });
  }, [templatesExecutions, filter.status]);
  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);
  const hasNext = Boolean(fetchExecutions?.next && filteredExecutions.length >= PAGINATION_LIMIT);
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
        {isMobile && (
          <Box mt={-2}>
            <DocumentsDrawerLazy />
          </Box>
        )}
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
              templates={templates}
              isLoading={isTemplatesLoading}
            />
          )}
          <GPTDocumentsContainer />
          <PaginatedList
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
          </PaginatedList>
        </Stack>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps({ params, query, res }: any) {
  res.setHeader("Cache-Control", "public, maxage=900, stale-while-revalidate=2");

  const { hash, slug } = query;
  let fetchedTemplate: Templates | null = null;
  let hashedExecution: TemplatesExecutions | null = null;

  try {
    if (hash && slug) {
      const [_execution, _templatesResponse] = await Promise.allSettled([
        getExecutionByHash(hash as string),
        getTemplateBySlug(slug as string),
      ]);

      fetchedTemplate = _templatesResponse.status === "fulfilled" ? _templatesResponse.value : fetchedTemplate;
      hashedExecution = _execution.status === "fulfilled" ? _execution.value : hashedExecution;
    }
  } catch (error) {
    console.log("Error occurred:", error);
  }

  return {
    props: {
      title: "Documents",
      hashedExecution,
      fetchedTemplate,
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
