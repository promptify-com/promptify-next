import React from "react";
import { Box, Grid } from "@mui/material";
import Head from "next/head";
import { explorerApi } from "@/core/api/explorer";
import { CategoriesApi } from "@/core/api/categories";
import { Layout } from "@/layout";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { RootState, wrapper, AppDispatch } from "@/core/store"; // Make sure to import AppStore here
import { FiltersSelected } from "@/components/explorer/FiltersSelected";

import {
  Category,
  FilterParams,
  SelectedFilters,
  Tag,
  Templates,
} from "@/core/api/dto/templates";
import { NextPage } from "next";
import { useAppSelector } from "@/hooks/useStore";

interface IProps {
  props: {
    categories: Category[];
    templates: Templates[];
    isCategoryLoading: boolean;
    isTemplatesLoading: boolean;
  };
}

const ExplorePage: NextPage<IProps> = ({ props }) => {
  const { categories, templates, isCategoryLoading, isTemplatesLoading } =
    props;

  const filters = useAppSelector((state: RootState) => state.filters);

  function areAllStatesNull(filters: SelectedFilters): boolean {
    return (
      filters.engine === null &&
      filters.tag.every((tag) => tag === null) &&
      filters.title === null &&
      filters.category === null &&
      filters.subCategory === null
    );
  }

  const allNull = areAllStatesNull(filters);

  return (
    <>
      <Layout>
        <Head>
          <title>Explore and Boost your creativity</title>
          <meta
            name="description"
            content="Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
            key="desc"
          />
        </Head>
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
              templates={templates ?? []}
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
    async ({ store }) => {
      // Specify the type for 'store' variable
      const { filters } = store.getState();

      const filteredTags = filters.tag
        .filter((item: Tag | null) => item !== null)
        .map((item: Tag | null) => item?.name)
        .join("&tag=");

      const params: FilterParams = {
        tag: filteredTags,
        engineId: filters.engine?.id,
        title: filters.title,
      };

      const templates = await dispatch(
        explorerApi.endpoints.getTemplatesByFilter.initiate(params)
      );

      const categories = await dispatch(
        CategoriesApi.endpoints.getCategories.initiate()
      );

      return {
        props: {
          templates: templates.data,
          categories: categories.data,
          isTemplatesLoading: templates.isLoading,
          isCategoryLoading: categories.isLoading,
        },
      };
    }
);

export default ExplorePage;
