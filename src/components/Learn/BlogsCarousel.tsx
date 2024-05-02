import Link from "next/link";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useCarousel from "@/hooks/useCarousel";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import useBrowser from "@/hooks/useBrowser";
import { BLOG_URL } from "@/common/constants";
import { BlogPosts } from "./Constants";
import BlogPostCard from "@/components/common/cards/BlogPostCard";
import Grid from "@mui/material/Grid";
import { useAppSelector } from "../../hooks/useStore";

function BlogsCarousel() {
  const { isMobile } = useBrowser();
  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel();

  return (
    <Stack gap={3}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
        mb={"32px"}
        px={"16px"}
      >
        <Typography
          flex={1}
          fontSize={{ xs: 24, md: 32 }}
          fontWeight={400}
          color={"onSurface"}
          fontFamily={"Poppins"}
          lineHeight={"120%"}
          letterSpacing={"0.17px"}
          fontStyle={"normal"}
        >
          Blog
        </Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={1}
          sx={{ display: "flex" }}
        >
          <Link
            href={BLOG_URL}
            target="_blank"
          >
            <Button
              variant="outlined"
              sx={{ color: { xs: "onSurface", md: "secondary.light" }, p: "8px 16px" }}
            >
              All posts
            </Button>
          </Link>

          {!isMobile && (
            <CarouselButtons
              scrollPrev={scrollPrev}
              scrollNext={scrollNext}
              canScrollNext={true}
              canScrollPrev={true}
            />
          )}
        </Stack>
      </Stack>
      <Stack
        ref={carouselRef}
        overflow={"hidden"}
      >
        <Grid
          container
          flexWrap="nowrap"
        >
          {BlogPosts.map(post => (
            <Grid
              key={post.title}
              item
              xs={4}
              sx={{
                flex: "0 0 calc(33% - 32px)",
                p: "16px 16px 8px",
                borderRadius: "24px",
                ":hover": {
                  bgcolor: "surface.2",
                },
              }}
            >
              <BlogPostCard
                post={post}
                min
                noLabel
                sx={{
                  ".MuiCardContent-root": {
                    p: "8px 12px !important",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
}

export default BlogsCarousel;
