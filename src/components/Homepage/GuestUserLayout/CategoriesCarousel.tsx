import { Category } from "@/core/api/dto/templates";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import useCarousel from "@/hooks/useCarousel";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import Link from "next/link";

function CategoryCarousel({ categories }: { categories: Category[] }) {
  const { containerRef, scrollNext, scrollPrev, canScrollNext, canScrollPrev } = useCarousel();

  return (
    <Stack
      gap={5}
      sx={{
        p: { md: "48px 16px" },
      }}
    >
      <Stack
        direction={{ md: "row" }}
        alignItems={{ md: "center" }}
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
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={1}
        >
          <Button
            variant="outlined"
            LinkComponent={Link}
            href="/explore"
            sx={{ color: "#67677C" }}
          >
            See all
          </Button>
          <CarouselButtons
            scrollPrev={scrollPrev}
            scrollNext={scrollNext}
            canScrollNext={canScrollNext}
            canScrollPrev={canScrollPrev}
          />
        </Stack>
      </Stack>
      <Stack
        ref={containerRef}
        overflow={"hidden"}
      >
        <Stack
          direction={"row"}
          gap={3}
          p={"8px 16px"}
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
