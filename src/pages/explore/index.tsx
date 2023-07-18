import { Box, Button, Grid, Slide, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { useRouter } from "next/router";

import { Category } from "@/core/api/dto/templates";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import {
  useGetCategoriesQuery,
  useGetTemplatesByKeyWordAndTagQuery,
} from "@/core/api/explorer";
import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { FetchLoading } from "@/components/FetchLoading";
import CardTemplate from "@/components/common/cards/CardTemplate";
import { Layout } from "@/layout";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { SubCategoryCard } from "@/components/common/cards/CardSubcategory";

export default function ExplorePage() {
  const router = useRouter();
  const categoriesRef = useRef(null);
  const { data: templates, isLoading: isTemplatesLoading } =
    useGetTemplatesByKeyWordAndTagQuery(
      { keyword: "", tag: "" },
      { refetchOnMountOrArgChange: true }
    );

  const { data: categories, isLoading: isCategoryLoading } =
    useGetCategoriesQuery();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  return (
    <>
      <Layout>
        <Box padding={"0px 8px"}>
          <Grid
            sx={{
              padding: { xs: "1em 0em 0em 1em", sm: "1.5em 2em" },
            }}
            display={"flex"}
            flexDirection={"column"}
            gap={1}
          >
            {!selectedCategory && (
              <Box gap={"16px"} display={"flex"} flexDirection={"column"}>
                <Typography fontSize={19}> Browse Category </Typography>
                {/* Loading Categories  */}
                {isCategoryLoading && (
                  <Box
                    minHeight={"40vh"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <FetchLoading />
                  </Box>
                )}
                <Grid
                  display={"flex"}
                  flexDirection={"row"}
                  gap={"24px"}
                  justifyContent={"space-between"}
                  alignItems={"flex-start"}
                  alignContent={"flex-start"}
                  alignSelf={"stretch"}
                  flexWrap={"wrap"}
                >
                  {categories

                    ?.filter((mainCat) => !mainCat.parent)
                    .map((category) => (
                      <Grid key={category.id}>
                        <CategoryCard
                          category={category}
                          onSelected={() => setSelectedCategory(category)}
                        />
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )}
            <Box ref={categoriesRef}>
              <Slide
                in={!!selectedCategory}
                direction="up"
                mountOnEnter
                unmountOnExit
                container={categoriesRef.current}
              >
                <Box
                  gap={"16px"}
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"start"}
                >
                  <Button
                    onClick={() => setSelectedCategory(null)}
                    variant="text"
                    sx={{ fontSize: 19, color: "onSurface", ml: -3, mt: -1 }}
                  >
                    <KeyboardArrowLeft /> {selectedCategory?.name}
                  </Button>
                  <Grid display={"flex"} gap={"8px"} flexWrap={"wrap"}>
                    {categories
                      ?.filter(
                        (mainCat) =>
                          selectedCategory?.name == mainCat.parent?.name
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
              </Slide>
            </Box>

            <Grid mt={3}>
              {!selectedCategory && (
                <Typography fontSize={19}>Best Templates</Typography>
              )}
              <Grid
                container
                direction={"column"}
                sx={{
                  mt: "10px",
                  gap: "1em",
                  width: "100%",
                }}
              >
                {!isTemplatesLoading &&
                  !!templates &&
                  templates.length > 0 &&
                  templates.map((el: any) => (
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

                {!isTemplatesLoading &&
                  (!templates || templates.length === 0) && (
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

                {isTemplatesLoading && <FetchLoading />}
              </Grid>
            </Grid>
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
