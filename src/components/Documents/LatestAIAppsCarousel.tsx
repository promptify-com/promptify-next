import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import useCarousel from "@/hooks/useCarousel";
import CardDocumentTemplatePlaceholder from "@/components/placeholders/CardDocumentTemplatePlaceholder";
import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useAppSelector } from "@/hooks/useStore";
import useBrowser from "@/hooks/useBrowser";
import { AIApps } from "../Automation/types";
import CardAIAppsTemplate from "../common/cards/CardAIAppsTemplate";

interface Props {
  gpts?: AIApps[];
  isLoading: boolean;
  setActiveAIApp: (item: AIApps | null) => void;
}

export default function LatestAIAppsCarousel({ gpts, isLoading, setActiveAIApp }: Props) {
  const { isMobile } = useBrowser();
  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel({ skipSnaps: true, slidesToScroll: 2 });
  const [isCarousel, setIsCarousel] = useState(true);

  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);

  const isEmpty = !isLoading && !gpts?.length;
  const showCarousel = gpts && gpts?.length > 1;

  if (isEmpty) return;
  return (
    <Stack
      gap={3}
      py={{ xs: "24px", md: 0 }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={1}
        p={"8px 16px"}
      >
        <Typography
          fontSize={{ xs: 24, md: 32 }}
          fontWeight={400}
        >
          Latest AI Apps
        </Typography>
        {isCarousel && showCarousel && (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={1}
          >
            <Button
              onClick={e => setIsCarousel(false)}
              variant="outlined"
              sx={{ color: "onSurface", visibility: isLoading ? "hidden" : "visible" }}
            >
              See all
            </Button>
            {!isMobile && (
              <CarouselButtons
                scrollPrev={scrollPrev}
                scrollNext={scrollNext}
                canScrollNext={true}
                canScrollPrev={true}
              />
            )}
          </Stack>
        )}
      </Stack>
      <Stack
        ref={isCarousel ? carouselRef : null}
        overflow={"hidden"}
      >
        <Grid
          container
          gap={isLoading ? 3 : 0}
          rowGap={2}
          flexWrap={isCarousel ? "nowrap" : "wrap"}
          {...(!isCarousel && {
            sx: {
              transform: "none !important",
            },
          })}
        >
          {isLoading ? (
            <Box
              display="flex"
              flexDirection="column"
            >
              <Box display="flex">
                <CardDocumentTemplatePlaceholder
                  count={4}
                  sx={{
                    width: { xs: 212, md: 278 },
                    height: { xs: 219, md: 278 },
                    p: "16px 16px 8px",
                  }}
                />
              </Box>
              <Box display="flex">
                <CardDocumentTemplatePlaceholder
                  count={4}
                  sx={{
                    width: { xs: 212, md: 278 },
                    height: { xs: 219, md: 278 },
                    p: "16px 16px 8px",
                  }}
                />
              </Box>
            </Box>
          ) : isCarousel && gpts && gpts?.length > 4 ? (
            gpts?.map((gpt, index) => (
              <Grid
                item
                display="flex"
                flexDirection="column"
              >
                {index % 2 === 0 && (
                  <>
                    <Grid
                      key={gpt.id}
                      item
                      xs={6}
                      sm={4}
                      md={isDocumentsFiltersSticky ? 8 : 6}
                      lg={isDocumentsFiltersSticky ? 4 : 3}
                      xl={3}
                      sx={{
                        flex: 0,
                      }}
                    >
                      <CardAIAppsTemplate
                        gpt={gpt}
                        onClick={e => {
                          e.preventDefault();
                          setActiveAIApp(gpt);
                        }}
                      />
                    </Grid>
                    {gpts[index + 1] && (
                      <>
                        <Grid
                          key={gpts[index + 1].id}
                          item
                          xs={6}
                          sm={4}
                          md={isDocumentsFiltersSticky ? 8 : 6}
                          lg={isDocumentsFiltersSticky ? 4 : 3}
                          xl={3}
                          sx={{
                            flex: 0,
                          }}
                        >
                          <CardAIAppsTemplate
                            gpt={gpts[index + 1]}
                            onClick={e => {
                              e.preventDefault();
                              setActiveAIApp(gpts[index + 1]);
                            }}
                          />
                        </Grid>
                      </>
                    )}
                  </>
                )}
              </Grid>
            ))
          ) : (
            gpts?.map(gpt => (
              <Grid
                key={gpt.id}
                item
                xs={6}
                sm={4}
                md={isDocumentsFiltersSticky ? 8 : 6}
                lg={isDocumentsFiltersSticky ? 4 : 3}
                xl={3}
                sx={{
                  flex: 0,
                }}
              >
                <CardAIAppsTemplate
                  gpt={gpt}
                  onClick={e => {
                    e.preventDefault();
                    setActiveAIApp(gpt);
                  }}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Stack>
    </Stack>
  );
}
