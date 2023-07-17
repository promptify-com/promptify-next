import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWindowSize } from "usehooks-ts";

import { Popularity, TypePopularity } from "@/common/helpers/getFilter";
import { Category, Engine, Tag } from "@/core/api/dto/templates";
import { useCollection } from "@/hooks/api/collections";
import { ICollection } from "@/common/types/collection";
import { authClient } from "@/common/axios";
import { Sidebar } from "@/components/blocks/VHeader/Sidebar";
import { Header } from "@/components/blocks/VHeader";
import { ExploreFilterSideBar } from "@/components/explorer/ExploreFilterSideBar";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import { useGetTemplatesByKeyWordAndTagQuery } from "@/core/api/explorer";
import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { FetchLoading } from "@/components/FetchLoading";
import CardTemplate from "@/components/common/cards/CardTemplate";
import { Layout } from "@/layout";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { SubCategoryCard } from "@/components/common/cards/CardSubcategory";

export default function ExplorerDetail({
  categories,
  engines,
  tags,
}: {
  collections: ICollection[];
  categories: Category[];
  engines: Engine[];
  tags: Tag[];
}) {
  const router = useRouter();
  const { data: templates, isFetching } = useGetTemplatesByKeyWordAndTagQuery(
    { keyword: "", tag: "" },
    { refetchOnMountOrArgChange: true }
  );

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  return (
    <>
      <Layout>
        <Box>
          <Grid
            sx={{
              padding: { xs: "1em 0em 0em 1em", sm: "1.5em 2em" },
            }}
            display={"flex"}
            direction={"column"}
            gap={1}
          >
            {selectedCategory ? (
              <Box
                gap={1}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"start"}
              >
                <Button
                  onClick={() => setSelectedCategory(null)}
                  variant="text"
                  sx={{ fontSize: 19, color: "onSurface", ml: -3, mt: -1 }}
                >
                  <KeyboardArrowLeft /> {selectedCategory.name}
                </Button>
                <Grid display={"flex"} gap={"8px"} flexWrap={"wrap"}>
                  {categories
                    ?.filter(
                      (mainCat) => selectedCategory.name == mainCat.parent?.name
                    )
                    .map((subcategory) => (
                      <Grid key={subcategory.id}>
                        <SubCategoryCard
                          subcategory={subcategory}
                          onSelected={() => {}}
                        />
                      </Grid>
                    ))}
                </Grid>
              </Box>
            ) : (
              <Box gap={1} display={"flex"} flexDirection={"column"}>
                <Typography fontSize={19}> Browse Category </Typography>
                <Grid container spacing={3}>
                  {categories

                    ?.filter((mainCat) => !mainCat.parent)
                    .map((category) => (
                      <Grid key={category.id} item xs={6} sm={4} md={3} xl={2}>
                        <CategoryCard
                          category={category}
                          onSelected={() => setSelectedCategory(category)}
                        />
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )}

            <Grid mt={3}>
              {!selectedCategory && (
                <Typography fontSize={19}>Best Templates</Typography>
              )}
              <Grid
                container
                sx={{
                  mt: "10px",
                  gap: "1em",
                  width: "100%",
                }}
              >
                {!isFetching &&
                  !!templates &&
                  templates.length > 0 &&
                  templates.map((el: any, idx) => (
                    <Grid key={el.id} item xs={12}>
                      <CardTemplate
                        onFavoriteClick={() =>
                          router.push(`/prompt/${el.slug}`)
                        }
                        key={el.id}
                        template={el}
                        lengthTemplate={templates.length}
                      />
                    </Grid>
                  ))}

                {!isFetching && (!templates || templates.length === 0) && (
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <NotFoundIcon />
                  </Grid>
                )}

                {isFetching && <FetchLoading />}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Layout>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const tagsResponse = await authClient.get("/api/meta/tags/popular/");
    const tags = tagsResponse.data;
    const enginesResponse = await authClient.get("/api/meta/engines");
    const engines = enginesResponse.data;
    const categoryRequest = await authClient.get("/api/meta/categories/");
    const categories = categoryRequest.data;

    return {
      props: {
        categories,
        tags,
        engines,
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      },
    };
  } catch (error) {
    console.error("Error fetching collections:", error);
    return {
      props: {
        collections: [],
        categories: [],
        engines: [],
        tags: [],
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      },
    };
  }
}
