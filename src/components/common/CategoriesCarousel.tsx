import Link from "next/link";
import { useRef } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Avatar from "@mui/material/Avatar";

import { theme } from "@/theme";
import useCarousel from "@/hooks/useCarousel";
import { useAppSelector } from "@/hooks/useStore";
import { CategoryCard } from "@/components/common/cards/CardCategory";
import ExploreCardCategory from "@/components/common/cards/ExploreCardCategory";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import type { Category } from "@/core/api/dto/templates";

interface CategoryCarouselProps {
  categories: Category[];
  onClick?: () => void;
  userScrolled?: boolean;
  autoPlay?: boolean;
  gap?: number;
  explore?: boolean;
  href?: string;
}

function CategoryCarousel({
  categories = [],
  onClick,
  userScrolled,
  autoPlay = false,
  gap = 5,
  explore,
  href,
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
        gap={1}
        mb={"32px"}
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
          {typeof href === "string" ? (
            <Link href={href}>
              <Button
                variant="outlined"
                sx={{ color: "#67677C" }}
              >
                See all
              </Button>
            </Link>
          ) : (
            <Button
              variant="outlined"
              sx={{ color: "#67677C" }}
              onClick={onClick}
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
      </Stack>
      <Stack
        ref={carouselRef}
        overflow={"hidden"}
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
            width: "100%",
            position: "fixed",
            top: { xs: theme.custom.headerHeight.xs, md: theme.custom.headerHeight.md },
            zIndex: 1000,
            maxWidth: {
              md: `${isPromptsFiltersSticky ? 540 : 880}px`,
              lg: `${isPromptsFiltersSticky ? 955 : 1120}px`,
              xl: "1120px",
            },
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
