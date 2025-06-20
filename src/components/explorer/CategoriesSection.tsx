import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import type { Category } from "@/core/api/dto/templates";
import CategoriesPlaceholder from "@/components/placeholders/CategoriesPlaceHolder";

interface CategoriesSectionProps {
  isLoading: boolean;
  categories: Category[] | undefined;
  displayTitle?: boolean;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  isLoading,
  categories,
  displayTitle = false,
}) => {
  if (!categories?.length) {
    return null;
  }

  return (
    <>
      <Box
        gap={"16px"}
        display={"flex"}
        flexDirection={"column"}
      >
        {displayTitle && <Typography fontSize={19}> Prompt Template Category </Typography>}
        {isLoading ? (
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
        ) : (
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
              ?.filter(category => !category.parent && category.is_visible && category.prompt_template_count)
              .map((category, idx) => (
                <Grid key={category.id}>
                  <CategoryCard
                    category={category}
                    index={idx}
                    href={`/explore/${category.slug}`}
                  />
                </Grid>
              ))}
          </Grid>
        )}
      </Box>
    </>
  );
};
