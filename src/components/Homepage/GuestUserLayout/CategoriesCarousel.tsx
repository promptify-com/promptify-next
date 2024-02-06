import { Category } from "@/core/api/dto/templates";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { CategoryCard } from "@/components/common/cards/CardCategory";

function CategoryCarousel({ categories }: { categories: Category[] }) {
  const _categories = categories.filter(
    category => !category.parent && category.is_visible && category.prompt_template_count,
  );

  return (
    <Stack
      gap={5}
      sx={{
        py: "48px",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        p={"8px 16px"}
        gap={1}
      >
        <Typography
          flex={1}
          fontSize={32}
          fontWeight={400}
          color={"#2A2A3C"}
        >
          Browse category
        </Typography>
        <Button
          variant="outlined"
          sx={{ color: "#67677C" }}
        >
          See all
        </Button>
        <IconButton sx={{ border: "none", color: "#67677C" }}>
          <ArrowBackIosNew />
        </IconButton>
        <IconButton sx={{ border: "none", color: "#67677C" }}>
          <ArrowForwardIos />
        </IconButton>
      </Stack>
      <Stack
        direction={"row"}
        gap={3}
        sx={{
          overflow: "auto",
          overscrollBehavior: "contain",
        }}
      >
        {_categories.map((category, idx) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={idx}
            href={`/explore/${category.slug}`}
            min
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default CategoryCarousel;
