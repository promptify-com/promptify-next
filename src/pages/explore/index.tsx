import React from "react";
import { Box, Button, Chip, Grid } from "@mui/material";
import Head from "next/head";

import {
  useGetCategoriesQuery,
  useGetTemplatesByFilterQuery,
} from "@/core/api/explorer";
import { Layout } from "@/layout";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { setSelectedEngine, setSelectedTag } from "@/core/store/filtersSlice";

export default function ExplorePage() {
  const filters = useSelector((state: RootState) => state.filters);
  const engineId = useSelector((state: RootState) => state.filters.engine?.id);
  const tag = useSelector((state: RootState) => state.filters.tag?.name);
  const { data: templates, isLoading: isTemplatesLoading } =
    useGetTemplatesByFilterQuery({ engineId, tag });

  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery();

  const { engine, tag: selectedTag } = filters;

  const isFiltersNullish = Object.values(filters).every((value) => {
    return value === null ? true : false;
  });

  const dispatch = useDispatch();

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
          {!isFiltersNullish && (
            <Box display={"flex"} alignItems={"center"}>
              {engine && (
                <Chip
                  label={engine.name}
                  sx={{ fontSize: 13, fontWeight: 500 }}
                  onDelete={() => dispatch(setSelectedEngine(null))}
                />
              )}
              {selectedTag && (
                <Chip
                  label={selectedTag.name}
                  sx={{ fontSize: 13, fontWeight: 500 }}
                  onDelete={() => dispatch(setSelectedTag(null))}
                />
              )}
            </Box>
          )}

          <Grid sx={{}} display={"flex"} flexDirection={"column"} gap={"16px"}>
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
