import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import type { GetServerSideProps, NextPage } from "next";
import { Layout } from "@/layout";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import { Category } from "@/core/api/dto/templates";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import { getCategories } from "@/hooks/api/categories";

interface IProps {
  categories: Category[];
}

const ExplorePage: NextPage<IProps> = ({ categories }) => {
  const { templates, isTemplatesLoading, handleNextPage, hasMore, allFilterParamsNull, isFetching } =
    useGetTemplatesByFilter({ ordering: "-runs" });

  return (
    <>
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
                categories={categories}
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
            />
          </Grid>
        </Box>
      </Layout>
    </>
  );
};

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

export default ExplorePage;
