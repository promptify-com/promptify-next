import { useRef } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useCarousel from "@/hooks/useCarousel";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import Avatar from "@mui/material/Avatar";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import type { Category } from "@/core/api/dto/templates";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Link from "next/link";
import { useAppSelector } from "@/hooks/useStore";
import ExploreCardCategory from "@/components/common/cards/ExploreCardCategory";
import { theme } from "@/theme";
import Slide from "@mui/material/Slide";

interface CategoryCarouselProps {
  categories: Category[];
  onClick: () => void;
  userScrolled?: boolean;
  autoPlay?: boolean;
  gap?: number;
  explore?: boolean;
}

function CategoryCarousel({
  categories = [],
  onClick,
  userScrolled,
  autoPlay = false,
  gap = 5,
  explore,
}: CategoryCarouselProps) {
  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel(autoPlay);
  const {
    containerRef: carouselScrollRef,
    scrollNext: carouselScrollNext,
    scrollPrev: carouselScrollPrev,
  } = useCarousel(autoPlay);
  const isPromptsFiltersSticky = useAppSelector(state => state.sidebar.isPromptsFiltersSticky);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const carouselContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <Stack
      ref={carouselContainerRef}
      gap={gap}
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
          fontSize={{ xs: 19, md: 32 }}
          fontWeight={400}
          color={"onSurface"}
          fontFamily={"Poppins"}
          lineHeight={"120%"}
          letterSpacing={"0.17px"}
          fontStyle={"normal"}
        >
          Browse category
        </Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={1}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Button
            variant="outlined"
            sx={{ color: "#67677C" }}
            onClick={onClick}
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
          ref={carouselContainerRef}
          direction={"row"}
        >
          {categories.map(category => (
            <Box key={category.id}>
              {explore ? (
                <ExploreCardCategory category={category} />
              ) : (
                <CategoryCard
                  category={category}
                  priority={false}
                  href={`/explore/${category.slug}`}
                  min
                />
              )}
            </Box>
          ))}
        </Stack>
      </Stack>
      <Slide
        in={userScrolled}
        container={containerRef.current}
      >
        <Box
          sx={{
            width: `calc(100% - ${theme.custom.leftClosedSidebarWidth})`,
            position: "fixed",
            top: theme.custom.headerHeight.md,
            left: theme.custom.leftClosedSidebarWidth,
            zIndex: 1000,
            bgcolor: "surfaceContainerLowest",
          }}
        >
          <CarouselButtons
            scrollPrev={carouselScrollPrev}
            scrollNext={carouselScrollNext}
            canScrollNext={true}
            canScrollPrev={true}
          >
            <Stack
              ref={carouselScrollRef}
              overflow={"hidden"}
              py={"8px"}
            >
              <Stack
                ref={containerRef}
                direction={"row"}
                m={"8px"}
              >
                {categories.map(category => (
                  <Link
                    key={category.id}
                    href={`/explore/${category.slug}`}
                    style={{ textDecoration: "none", margin: "0 4px" }}
                  >
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      gap={1}
                      sx={{
                        minWidth: "224px",
                        bgcolor: "surfaceContainerLowest",
                        border: `1px solid ${theme.palette.surfaceContainer}`,
                        borderRadius: "999px",
                        p: "4px 12px 4px 4px",
                        ":hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <Avatar
                        src={category.image}
                        alt={category.name}
                        sx={{ width: 40, height: 40, borderRadius: "50%" }}
                      />
                      <Typography
                        fontSize={14}
                        fontWeight={500}
                        color={"onSurface"}
                        whiteSpace={"nowrap"}
                      >
                        {category.name}
                      </Typography>
                    </Stack>
                  </Link>
                ))}
              </Stack>
            </Stack>
          </CarouselButtons>
        </Box>
      </Slide>
    </Stack>
  );
}

export default CategoryCarousel;
