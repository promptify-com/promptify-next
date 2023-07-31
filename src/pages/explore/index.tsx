import React from "react";
import { Box, Grid } from "@mui/material";
import Head from "next/head";

import { Layout } from "@/layout";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import { SelectedFilters } from "@/core/api/dto/templates";
import { useExploreData } from "@/hooks/useExploreData";

export default function ExplorePage() {
  function areAllStatesNull(filters: SelectedFilters): boolean {
    return (
      filters.engine === null &&
      filters.tag.every((tag) => tag === null) &&
      filters.title === null &&
      filters.category === null &&
      filters.subCategory === null
    );
  }
  const {
    categories,
    templates,
    filters,
    isTemplatesLoading,
    isCategoryLoading,
  } = useExploreData();

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
}
