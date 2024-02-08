import { Category } from "@/core/api/dto/templates";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import { redirectToPath } from "@/common/helpers";
import useCarousel from "@/hooks/useCarousel";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";

function CategoryCarousel({ categories }: { categories: Category[] }) {
  const { containerRef, scrollNext, scrollPrev } = useCarousel();

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
          onClick={() => redirectToPath("/explore")}
        >
          See all
        </Button>
        <CarouselButtons
          scrollPrev={scrollPrev}
          scrollNext={scrollNext}
        />
      </Stack>
      <Stack ref={containerRef}>
        <Stack
          gap={3}
          direction={"row"}
        >
          {categories.map((category, idx) => (
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
    </Stack>
  );
}

export default CategoryCarousel;
