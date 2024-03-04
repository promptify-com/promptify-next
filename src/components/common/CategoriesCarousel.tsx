import { useRef } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useCarousel from "@/hooks/useCarousel";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

import { CategoryCard } from "@/components/common/cards/CardCategory";
import type { Category } from "@/core/api/dto/templates";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Link from "next/link";

interface CategoryCarouselProps {
  categories: Category[];
  onClick: () => void;
  userScrolled?: boolean;
  autoPlay?: boolean;
  gap?: number;
}

function CategoryCarousel({ categories, onClick, userScrolled, autoPlay = false, gap = 5 }: CategoryCarouselProps) {
  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel(autoPlay);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observer = useIntersectionObserver(containerRef, {
    threshold: 0.5,
  });

  return (
    <Stack
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
        )}
      </Stack>
      {userScrolled ? (
        <Box
          sx={{
            position: "fixed",
            top: { md: 0, sm: " 58px" },
            margin: "0 auto",
            zIndex: 1000,
            maxWidth: {
              md: "875px",
              lg: "1010px",
            },
            width: "100%",
            bgcolor: "surface.1",
          }}
        >
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
                  <Link
                    key={category.id}
                    href={`/explore/${category.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Paper
                      sx={{
                        flex: "none",
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
                        width: "224px",
                        height: "48px",
                      }}
                    >
                      <Avatar
                        src={category.image}
                        alt={category.name}
                        sx={{ width: "50px", height: "50px" }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          flexGrow: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {category.name}
                      </Typography>
                    </Paper>
                  </Link>
                ))}
              </Stack>
            </Stack>
          </CarouselButtons>
        </Box>
      ) : (
        <Stack
          ref={carouselRef}
          overflow={"hidden"}
          m={{ xs: 0, md: "8px 16px" }}
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
      )}
    </Stack>
  );
}

export default CategoryCarousel;
