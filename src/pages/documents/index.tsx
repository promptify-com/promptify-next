import Stack from "@mui/material/Stack";
import Seo from "@/components/Seo";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import TemplatesCarousel from "@/components/Documents/TemplatesCarousel";
import DocumentsContainer from "@/components/Documents/DocumentsContainer";
import { useGetTemplatesExecutionsByMeQuery } from "@/core/api/executions";
import { useAppSelector } from "@/hooks/useStore";

export default function DocumentsPage() {
  const { data: executedTemplates, isLoading: isExecutedTemplatesLoading } =
    useGetTemplatesExecutionsByMeQuery(undefined);

  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);

  return (
    <>
      <Seo title={"My Documents"} />
      <Layout>
        <Protected>
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
              templates={executedTemplates}
              isLoading={isExecutedTemplatesLoading}
            />
            <DocumentsContainer
              templates={executedTemplates}
              isLoading={isExecutedTemplatesLoading}
            />
          </Stack>
        </Protected>
      </Layout>
    </>
  );
}
