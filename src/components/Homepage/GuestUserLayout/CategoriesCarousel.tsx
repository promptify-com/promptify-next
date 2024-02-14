import { Category } from "@/core/api/dto/templates";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import useCarousel from "@/hooks/useCarousel";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import Link from "next/link";
import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

function CategoryCarousel({ categories }: { categories: Category[] }) {
  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observer = useIntersectionObserver(containerRef, {
    threshold: 0.5,
  });

  return (
    <Stack
      gap={5}
      sx={{
        pt: { md: "48px" },
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
          fontSize={{ xs: 28, md: 32 }}
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
            canScrollNext={true}
            canScrollPrev={true}
          />
        </Stack>
      </Stack>
      <Stack
        ref={carouselRef}
        overflow={"hidden"}
        m={"8px 16px"}
      >
        <Stack
          ref={containerRef}
          direction={"row"}
        >
          {observer?.isIntersecting &&
            categories.map(category => (
              <Box
                key={category.id}
                mx={"12px"}
              >
                <CategoryCard
                  category={category}
                  priority={false}
                  href={`/explore/${category.slug}`}
                  min
                />
              </Box>
            ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default CategoryCarousel;
