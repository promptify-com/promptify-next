import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import useCarousel from "@/hooks/useCarousel";
import CardDocumentTemplate from "@/components/common/cards/CardDocumentTemplate";
import type { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import CardDocumentTemplatePlaceholder from "@/components/placeholders/CardDocumentTemplatePlaceholder";
import { useState } from "react";
import { Grid } from "@mui/material";
import { useAppSelector } from "@/hooks/useStore";

interface Props {
  templates: TemplateExecutionsDisplay[] | undefined;
  isLoading: boolean;
}

export default function TemplatesCarousel({ templates, isLoading }: Props) {
  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel();
  const [isCarousel, setIsCarousel] = useState(true);

  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);

  const sortedTemplates = templates?.slice().sort((tempA, tempB) => tempB.executions.length - tempA.executions.length);

  const isEmpty = !isLoading && !templates?.length;

  if (isEmpty) return;

  return (
    <Stack gap={3}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={1}
        p={"8px 16px"}
      >
        <Typography
          fontSize={32}
          fontWeight={400}
        >
          Top prompts
        </Typography>
        {isCarousel && (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Button
              onClick={e => setIsCarousel(false)}
              variant="outlined"
              sx={{ color: "#67677C", visibility: isLoading ? "hidden" : "visible" }}
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
            <CardDocumentTemplatePlaceholder count={5} />
          ) : (
            sortedTemplates?.map(template => (
              <Grid
                key={template.id}
                item
                xs={12}
                sm={6}
                md={isDocumentsFiltersSticky ? 8 : 6}
                lg={isDocumentsFiltersSticky ? 5 : 3}
                xl={2}
              >
                <CardDocumentTemplate template={template} />
              </Grid>
            ))
          )}
        </Grid>
      </Stack>
    </Stack>
  );
}
