import { useRef } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useCarousel from "@/hooks/useCarousel";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

import { CategoryCard } from "@/components/common/cards/CardCategory";
import { Category } from "@/core/api/dto/templates";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface CategoryCarouselProps {
  categories: Category[];
  isExplorePage?: boolean;
  showAllCategories?: () => void;
  userScrolled?: boolean;
}

function CategoryCarousel({ categories, isExplorePage, showAllCategories, userScrolled }: CategoryCarouselProps) {
  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel(!isExplorePage);
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
        {!userScrolled && (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={1}
          >
            {isExplorePage ? (
              <Button
                sx={{ color: "#67677C" }}
                variant="outlined"
                onClick={showAllCategories}
              >
                See all
              </Button>
            ) : (
              <Button
                variant="outlined"
                LinkComponent={Link}
                href="/explore"
                sx={{ color: "#67677C" }}
              >
                See all
              </Button>
            )}
            <CarouselButtons
              scrollPrev={scrollPrev}
              scrollNext={scrollNext}
              canScrollNext={true}
              canScrollPrev={true}
            />
          </Stack>
        )}
      </Stack>
      {userScrolled ? (
        <CarouselButtons
          scrollPrev={scrollPrev}
          scrollNext={scrollNext}
          canScrollNext={true}
          canScrollPrev={true}
        >
          <Stack
            ref={carouselRef}
            overflow={"hidden"}
            m={"8px 16px"}
          >
            <Stack
              ref={containerRef}
              direction={"row"}
              m={"8px 16px"}
              gap={"8px"}
            >
              {categories.map(category => (
                <Paper
                  key={category.id}
                  sx={{
                    flex: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    borderRadius: "50px",
                    p: "4px 12px 4px 4px",
                    gap: "8px",
                    border: "1px solid",
                    borderColor: "surfaceContainer",
                    bgcolor: "onPrimary",
                  }}
                >
                  <Avatar
                    src={category.image}
                    alt={category.name}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{ flexGrow: 1, textAlign: "center", whiteSpace: "nowrap" }}
                  >
                    {category.name}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </CarouselButtons>
      ) : (
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
                    isExplorePage={isExplorePage}
                    min
                  />
                </Box>
              ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

export default CategoryCarousel;
