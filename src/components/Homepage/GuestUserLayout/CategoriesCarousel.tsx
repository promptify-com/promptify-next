import { Category } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { redirectToPath } from "@/common/helpers";

function CategoryCarousel({ categories }: { categories: Category[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: "auto",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

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
        <IconButton
          sx={{ border: "none", color: "#67677C" }}
          onClick={scrollPrev}
        >
          <ArrowBackIosNew />
        </IconButton>
        <IconButton
          sx={{ border: "none", color: "#67677C" }}
          onClick={scrollNext}
        >
          <ArrowForwardIos />
        </IconButton>
      </Stack>
      <Box
        ref={emblaRef}
        sx={{
          overflow: "hidden",
        }}
      >
        <Stack
          gap={3}
          direction={"row"}
        >
          {categories.map((category, idx) => (
            <Box
              key={category.id}
              sx={{
                flex: "0 0 100%",
                minWidth: 0,
              }}
            >
              <CategoryCard
                category={category}
                index={idx}
                href={`/explore/${category.slug}`}
                min
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

export default CategoryCarousel;
