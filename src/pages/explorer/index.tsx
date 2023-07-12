import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useWindowSize } from "usehooks-ts";

import { Popularity, TypePopularity } from "@/common/helpers/getFilter";
import { Category, Tag } from "@/core/api/dto/templates";
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

export default function ExplorerDetail({
  categories,
  engines,
  tags,
}: {
  collections: ICollection[];
  categories: Category[];
  engines: any[];
  tags: Tag[];
}) {
  const router = useRouter();
  const { category, subcategory, keyWordP } = router.query;

  const [keyWord, setKeyWord] = React.useState<string>("");

  // const queryString = selectedTag
  //   .map((tag) => `tag=${encodeURIComponent(tag.name)}`)
  //   .join("&");
  const { data: templates, isFetching } = useGetTemplatesByKeyWordAndTagQuery(
    { keyword: "", tag: "" },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <>
      <Box sx={{ bgcolor: "surface.3" }}>
        <Grid display={"flex"}>
          <Sidebar />
          <ExploreFilterSideBar
            categories={categories}
            engines={engines}
            tags={tags}
          />
        </Grid>
        <Box
          sx={{
            minHeight: "100vh",
            width: { xs: "100%", md: "calc(100% - 96px - 230px)" },
            ml: { md: "auto" },
          }}
        >
          <Header transparent />
          <Box>
            <Grid
              sx={{
                padding: { xs: "1em 0em 0em 1em", sm: "1.5em 2em" },
              }}
              display={"flex"}
              direction={"column"}
              gap={1}
            >
              <Typography fontSize={19}> Browse Category </Typography>
              <Grid container spacing={3}>
                {categories
                  ?.filter((mainCat) => !mainCat.parent)
                  .map((category) => (
                    <Grid item xs={6} md={3}>
                      <CategoryCard category={category} />
                    </Grid>
                  ))}
              </Grid>
              <Grid mt={3}>
                <Typography fontSize={19}>Best Templates</Typography>
                <Grid
                  container
                  sx={{
                    mt: "10px",
                    gap: "1em",
                    width: "100%",
                  }}
                >
                  {!isFetching ? (
                    !!templates && templates.length > 0 ? (
                      templates.map((el: any, idx) => (
                        <Grid item xs={12}>
                          <CardTemplate
                            onFavoriteClick={() =>
                              router.push(`/prompt/${el.slug}`)
                            }
                            key={idx}
                            template={el}
                            lengthTemplate={templates.length}
                          />
                        </Grid>
                      ))
                    ) : (
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
                    )
                  ) : (
                    <FetchLoading />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
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
