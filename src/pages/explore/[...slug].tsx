import { authClient } from "@/common/axios";
import { FetchLoading } from "@/components/FetchLoading";
import { SubCategoryCard } from "@/components/common/cards/CardSubcategory";
import {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
} from "@/core/api/explorer";
import { Layout } from "@/layout";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { Box, Button, Grid } from "@mui/material";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  console.log(router.pathname);

  const slug = router.query?.slug as string;
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();
  const { data: selectedCategory, isLoading: isCategoryLoading } =
    useGetCategoryBySlugQuery(slug);

  return (
    <Layout>
      {isCategoryLoading || isCategoriesLoading ? (
        <Box>
          <FetchLoading />
        </Box>
      ) : (
        <Box
          gap={"16px"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"start"}
        >
          <Button
            onClick={() => router.back()}
            variant="text"
            sx={{ fontSize: 19, color: "onSurface", ml: -3 }}
          >
            <KeyboardArrowLeft /> {selectedCategory?.name}
          </Button>
          <Grid display={"flex"} gap={"8px"} flexWrap={"wrap"}>
            {categories
              ?.filter(
                (mainCat) => selectedCategory?.name == mainCat.parent?.name
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
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }: any) {
  const { slug } = params;
  try {
    const categoryRes = await authClient.get(`/api/meta/categories/${slug}/`);
    const category = categoryRes.data; // Extract the necessary data from the response

    return {
      props: {
        title: category?.name,
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
        meta_keywords: "",
        image: category.image,
      },
    };
  } catch (error) {
    return {
      props: {
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      },
    };
  }
}
