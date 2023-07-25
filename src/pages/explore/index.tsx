import React from "react";
import { Box, Grid } from "@mui/material";
import Head from "next/head";
import { useSelector } from "react-redux";

import { useGetTemplatesByFilterQuery } from "@/core/api/explorer";
import { Layout } from "@/layout";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { RootState } from "@/core/store";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import { useGetCategoriesQuery } from "@/core/api/categories";
import { FilterParams, SelectedFilters } from "@/core/api/dto/templates";

export default function ExplorePage() {
  const tags = useSelector((state: RootState) => state.filters.tag);
  const engineId = useSelector((state: RootState) => state.filters.engine?.id);
  const params: FilterParams = {
    tag: tags
      .map((item) => item?.name)
      .filter((name) => name !== null)
      .join("&tag="), // Filter out null values and convert to string array
    engineId,
  };
  const { data: templates, isLoading: isTemplatesLoading } =
    useGetTemplatesByFilterQuery(params);
  const filters = useSelector((state: RootState) => state.filters);

  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery();

  function areAllStatesNull(filters: SelectedFilters): boolean {
    return (
      filters.engine === null &&
      filters.tag.every((tag) => tag === null) &&
      filters.keyword === null &&
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
        <Box>
          <Grid sx={{}} display={"flex"} flexDirection={"column"} gap={"16px"}>
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
            />
          </Grid>
        </Box>
      </Layout>
    </>
  );
}
