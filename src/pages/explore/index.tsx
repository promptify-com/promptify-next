import React from "react";
import { Box, Grid } from "@mui/material";
import Head from "next/head";

import {
  useGetCategoriesQuery,
  useGetTemplatesByFilterQuery,
  useGetTemplatesByKeyWordAndTagQuery,
} from "@/core/api/explorer";
import { Layout } from "@/layout";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";

export default function ExplorePage() {
  const selectedEngine = useSelector(
    (state: RootState) => state.engines.engine
  );
  const { data: templates, isLoading: isTemplatesLoading } =
    useGetTemplatesByFilterQuery({ engineId: selectedEngine as number });

  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery();

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
            {!selectedEngine && (
              <CategoriesSection
                categories={categories}
                isLoading={isCategoryLoading}
              />
            )}

            <TemplatesSection
              filtred={!!selectedEngine}
              templates={templates ?? []}
              isLoading={isTemplatesLoading}
            />
          </Grid>
        </Box>
      </Layout>
    </>
  );
}
