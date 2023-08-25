import React from "react";
import { Box, Grid } from "@mui/material";
import { NextPage } from "next";
import { Layout } from "@/layout";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { RootState } from "@/core/store";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import { Category, SelectedFilters } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
import { useExploreData } from "@/hooks/useExploreData";
import { authClient } from "@/common/axios";

interface IProps {
  categories: Category[];
}

const ExplorePage: NextPage<IProps> = ({ categories }) => {
  const filters = useAppSelector((state: RootState) => state.filters);
  const { templates, isTemplatesLoading, handleNextPage, handlePreviousPage } = useExploreData();
  function areAllStatesNull(filters: SelectedFilters): boolean {
    return (
      filters.engine === null &&
      filters.tag.every(tag => tag === null) &&
      filters.title === null &&
      filters.category === null &&
      filters.subCategory === null
    );
  }

  const allNull = areAllStatesNull(filters);

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
            <FiltersSelected show={!allNull} />
            {allNull && (
              <CategoriesSection
                categories={categories}
                isLoading={false}
              />
            )}
            <TemplatesSection
              filtred={!allNull}
              templates={templates?.results ?? []}
              isLoading={isTemplatesLoading}
              title="Best templates"
              hasNext={!!templates?.next}
              hasPrev={!!templates?.previous}
              onNextPage={handleNextPage}
              onPrevPage={handlePreviousPage}
            />
          </Grid>
        </Box>
      </Layout>
    </>
  );
};

export async function getServerSideProps() {
  const responseCategories = await authClient.get("/api/meta/categories/");
  const categories = responseCategories.data;

  return {
    props: {
      title: "Explore and Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      categories,
    },
  };
}

export default ExplorePage;
