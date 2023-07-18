import React from "react";
import { Box, Grid } from "@mui/material";
import Head from "next/head";

import {
  useGetCategoriesQuery,
  useGetTemplatesByKeyWordAndTagQuery,
} from "@/core/api/explorer";
import { Layout } from "@/layout";
import { Categories } from "./components/Categories";
import { TemplatesSection } from "./components/Templates";

export default function ExplorePage() {
  const { data: templates, isLoading: isTemplatesLoading } =
    useGetTemplatesByKeyWordAndTagQuery(
      { keyword: "", tag: "" },
      { refetchOnMountOrArgChange: true }
    );

  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery();

  return (
    <>
      <Layout>
        <Head>
          <title>Explore | Boost your creativity</title>
          <meta
            name="description"
            content="Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
            key="desc"
          />
        </Head>
        <Box>
          <Grid sx={{}} display={"flex"} flexDirection={"column"} gap={"16px"}>
            <Categories categories={categories} isLoading={isCategoryLoading} />
            <TemplatesSection
              templates={templates ?? []}
              isLoading={isTemplatesLoading}
            />
          </Grid>
        </Box>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}
