import React, { useMemo } from "react";
import { Box, Grid } from "@mui/material";
import { NextPage } from "next";

import { categoriesApi } from "@/core/api/categories";
import { Layout } from "@/layout";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { RootState, wrapper, AppDispatch } from "@/core/store"; // Make sure to import AppStore here
import { FiltersSelected } from "@/components/explorer/FiltersSelected";

import { Category, SelectedFilters } from "@/core/api/dto/templates";
import { useAppSelector } from "@/hooks/useStore";
import { useExploreData } from "@/hooks/useExploreData";

interface IProps {
  props: {
    categories: Category[];
    isCategoryLoading: boolean;
  };
}

const ExplorePage: NextPage<IProps> = ({ props }) => {
  const { categories, isCategoryLoading } = props;

  const filters = useAppSelector((state: RootState) => state.filters);

  const { templates, isTemplatesLoading } = useExploreData();

  function areAllStatesNull(filters: SelectedFilters): boolean {
    return (
      filters.engine === null &&
      filters.tag.every((tag) => tag === null) &&
      filters.title === null &&
      filters.category === null &&
      filters.subCategory === null
    );
  }

  const filteredTemplates = useMemo(() => {
    if (templates) {
      return templates.filter((template) => template.status !== "ARCHIVED");
    }
    return templates ?? [];
  }, [templates]);

  const allNull = areAllStatesNull(filters);

  return (
    <>
      <Layout>
        <Box mt={{ xs: 7, md: 0 }} padding={{ xs: "4px 0px", md: "0px 8px" }}>
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
                isLoading={isCategoryLoading}
              />
            )}
            <TemplatesSection
              filtred={!allNull}
              templates={filteredTemplates}
              isLoading={isTemplatesLoading}
              title="Best templates"
            />
          </Grid>
        </Box>
      </Layout>
    </>
  );
};

ExplorePage.getInitialProps = wrapper.getInitialPageProps(
  ({ dispatch }: { dispatch: AppDispatch }) =>
    async () => {
      const { data: categories, isLoading: isCategoryLoading } = await dispatch(
        categoriesApi.endpoints.getCategories.initiate()
      );

      return {
        props: {
          title: "Explore and Boost Your Creativity",
          description:
            "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
          categories,
          isCategoryLoading,
        },
      };
    }
);

export default ExplorePage;
