import React from "react";
import { Box, Grid } from "@mui/material";
import { NextPage } from "next";

import { Layout } from "@/layout";
import { CategoriesSection } from "@/components/explorer/CategoriesSection";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import { FiltersSelected } from "@/components/explorer/FiltersSelected";
import { Category } from "@/core/api/dto/templates";
import { authClient } from "@/common/axios";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";

interface IProps {
  categories: Category[];
}

const ExplorePage: NextPage<IProps> = ({ categories }) => {
  const { templates, hasNext, hasPrev, handleNextPage, handlePreviousPage, allFilterParamsNull, isFetching } =
    useGetTemplatesByFilter();

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
              templates={templates?.results ?? []}
              isLoading={isFetching}
              title="Best templates"
              hasNext={hasNext}
              hasPrev={hasPrev}
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
  const responseCategories = await authClient.get<Category[]>("/api/meta/categories/");
  const categories = responseCategories.data?.filter(category => category.prompt_template_count);

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
