import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import type { GetServerSideProps } from "next";
import { Layout } from "@/layout";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import { Category } from "@/core/api/dto/templates";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import { getCategories } from "@/hooks/api/categories";
import { useGetsuggestedTemplatesByCategoryQuery } from "@/core/api/templates";

interface Props {
  categories: Category[];
}

export default function ExplorePage({ categories }: Props) {
  const {
    templates,
    isTemplatesLoading,
    handleNextPage,
    hasMore,
    allFilterParamsNull,
    isFetching,
    hasPrev,
    handlePrevPage,
  } = useGetTemplatesByFilter({ ordering: "-likes", templateLimit: 5, paginatedList: true });
  const { data: suggestedTemplates, isLoading: isSuggestedTemplatesLoading } =
    useGetsuggestedTemplatesByCategoryQuery();

  return (
    <Layout>
      <Box
        mt={{ xs: 7, md: 0 }}
        padding={{ xs: "4px 0px", md: "0px 8px" }}
      >
        <Grid
          display={"flex"}
          flexDirection={"column"}
          gap={"36px"}
          sx={{
            padding: { xs: "16px", md: "32px" },
          }}
        >
          <FiltersSelected show={!allFilterParamsNull} />
          {allFilterParamsNull && (
            <CategoriesSection
              categories={categories ?? []}
              isLoading={false}
            />
          )}
          <TemplatesSection
            filtred={!allFilterParamsNull}
            templates={templates ?? []}
            isLoading={isFetching}
            templateLoading={isTemplatesLoading}
            title="Best templates"
            onNextPage={handleNextPage}
            hasMore={hasMore}
            isInfiniteScrolling={false}
            hasPrev={hasPrev}
            onPrevPage={handlePrevPage}
          />
          <TemplatesSection
            filtred={false}
            templates={suggestedTemplates ?? []}
            isLoading={isSuggestedTemplatesLoading}
            templateLoading={isSuggestedTemplatesLoading}
            title={`Because you use ${suggestedTemplates?.[0].category?.name} prompts`}
          />
        </Grid>
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=60");

  const categories = await getCategories();

  return {
    props: {
      title: "Explore and Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      categories,
    },
  };
};
