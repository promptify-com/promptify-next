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

export default function ExplorePage() {
  const engineId = useSelector((state: RootState) => state.filters.engine?.id);
  const tag = useSelector((state: RootState) => state.filters.tag?.name);
  const { data: templates, isLoading: isTemplatesLoading } =
    useGetTemplatesByFilterQuery({ engineId, tag });
  const filters = useSelector((state: RootState) => state.filters);

  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery();

  const isFiltersNullish = Object.values(filters).every((value) => {
    return value === null ? true : false;
  });

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
            <FiltersSelected show={!isFiltersNullish} />
            {isFiltersNullish && (
              <CategoriesSection
                categories={categories}
                isLoading={isCategoryLoading}
              />
            )}

            <TemplatesSection
              filtred={!isFiltersNullish}
              templates={templates ?? []}
              isLoading={isTemplatesLoading}
            />
          </Grid>
        </Box>
      </Layout>
    </>
  );
}
