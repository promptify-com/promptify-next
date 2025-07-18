import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import useCarousel from "@/hooks/useCarousel";
import CardDocumentTemplate from "@/components/common/cards/CardDocumentTemplate";
import type { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import CardDocumentTemplatePlaceholder from "@/components/placeholders/CardDocumentTemplatePlaceholder";
import { useState } from "react";
import { Box, Grid } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setDocumentsTemplate } from "@/core/store/documentsSlice";
import useBrowser from "@/hooks/useBrowser";

interface Props {
  templates: TemplateExecutionsDisplay[] | undefined;
  isLoading: boolean;
}

export default function TemplatesCarousel({ templates, isLoading }: Props) {
  const dispatch = useAppDispatch();
  const { isMobile } = useBrowser();
  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel({ skipSnaps: true, slidesToScroll: 2 });
  const [isCarousel, setIsCarousel] = useState(true);

  const activeTemplate = useAppSelector(state => state.documents?.filter?.template ?? null);
  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);

  const handleSelectTemplate = (template: TemplateExecutionsDisplay) => {
    dispatch(setDocumentsTemplate(template.id === activeTemplate ? null : template.id));
  };

  const isEmpty = !isLoading && !templates?.length;
  const showCarousel = templates && templates?.length > 1;

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
          Latest Prompt Templates
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
          ) : isCarousel && templates && templates?.length > 4 ? (
            templates?.map((template, index) => (
              <Grid
                item
                key={template.id}
                display="flex"
                flexDirection="column"
              >
                {index % 2 === 0 && (
                  <>
                    <Grid
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
                      <CardDocumentTemplate
                        template={template}
                        onClick={e => {
                          e.preventDefault();
                          handleSelectTemplate(template);
                        }}
                      />
                    </Grid>
                    {templates[index + 1] && (
                      <>
                        <Grid
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
                          <CardDocumentTemplate
                            template={templates[index + 1]}
                            onClick={e => {
                              e.preventDefault();
                              handleSelectTemplate(templates[index + 1]);
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
            templates?.map(template => (
              <Grid
                key={template.id}
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
                <CardDocumentTemplate
                  template={template}
                  onClick={e => {
                    e.preventDefault();
                    handleSelectTemplate(template);
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
