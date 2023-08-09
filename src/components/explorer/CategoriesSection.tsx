import { Box, Grid, Typography } from "@mui/material";
import { FetchLoading } from "@/components/FetchLoading";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import { Category } from "@/core/api/dto/templates";

import CategoriesPlaceholder from "@/components/placeholders/CategoriesPlaceHolder";

interface CategoriesSectionProps {
  isLoading: boolean;
  categories: Category[] | undefined;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  isLoading,
  categories,
}) => {
  return (
    <>
      <Box gap={"16px"} display={"flex"} flexDirection={"column"}>
        {!isLoading && <Typography fontSize={19}> Browse Category </Typography>}
        {isLoading && (
          <Grid
            display={"flex"}
            flexDirection={"row"}
            gap={"16px"}
            alignItems={"flex-start"}
            alignContent={"flex-start"}
            alignSelf={"stretch"}
            flexWrap={{ xs: "nowrap", md: "wrap" }}
          >
            <CategoriesPlaceholder />
          </Grid>
        )}
        <Grid
          display={"flex"}
          flexDirection={"row"}
          gap={"16px"}
          alignItems={"flex-start"}
          alignContent={"flex-start"}
          alignSelf={"stretch"}
          flexWrap={{ xs: "nowrap", md: "wrap" }}
          sx={{
            overflow: { xs: "auto", md: "initial" },
            WebkitOverflowScrolling: { xs: "touch", md: "initial" },
          }}
        >
          {categories
            ?.filter((mainCat) => !mainCat.parent)
            .map((category) => (
              <Grid key={category.id}>
                <CategoryCard
                  category={category}
                  href={`/explore/${category.slug}`}
                />
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
};
