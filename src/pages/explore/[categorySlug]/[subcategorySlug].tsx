import { authClient } from "@/common/axios";
import { FetchLoading } from "@/components/FetchLoading";
import { SubCategoryCard } from "@/components/common/cards/CardSubcategory";
import { Category } from "@/core/api/dto/templates";
import { useGetCategoriesQuery } from "@/core/api/explorer";
import { Layout } from "@/layout";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { Box, Button, Grid } from "@mui/material";
import { useRouter } from "next/router";

export default function Page({ category }: { category: Category }) {
  const router = useRouter();
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  const navigateTo = (slug: string) => {
    router.push(`/explore/${category.slug}/${slug}`);
  };
  return (
    <Layout>
      {isCategoriesLoading ? (
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
            onClick={() => router.push("/explore")}
            variant="text"
            sx={{ fontSize: 19, color: "onSurface", ml: -3 }}
          >
            <KeyboardArrowLeft /> {category.name}
          </Button>
          <Grid display={"flex"} gap={"8px"} flexWrap={"wrap"}>
            {categories
              ?.filter((mainCat) => category?.name == mainCat.parent?.name)
              .map((subcategory) => (
                <Grid key={subcategory.id}>
                  <SubCategoryCard
                    subcategory={subcategory}
                    onSelected={() => navigateTo(subcategory.name)}
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
  const { categorySlug } = params;
  try {
    const categoryRes = await authClient.get(
      `/api/meta/categories/by-slug/${categorySlug}/`
    );
    const category = categoryRes.data; // Extract the necessary data from the response

    return {
      props: {
        category,
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
        category: {},
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      },
    };
  }
}
