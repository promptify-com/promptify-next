import { useRouter } from "next/router";
import { Box, Grid, Typography } from "@mui/material";

import { FetchLoading } from "@/components/FetchLoading";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import { Category } from "@/core/api/dto/templates";

interface CategoriesSectionProps {
  isLoading: boolean;
  categories: Category[] | undefined;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  isLoading,
  categories,
}) => {
  const router = useRouter();
  const navigateToCategory = (slug: string) => {
    router.push(`/explore/${slug}`);
  };
  return (
    <>
      <Box gap={"16px"} display={"flex"} flexDirection={"column"}>
        <Typography fontSize={19}> Browse Category </Typography>
        {/* Loading Categories  */}
        {isLoading && (
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
          gap={"16px"}
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
                  onClick={() => navigateToCategory(category.slug)}
                />
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
};
