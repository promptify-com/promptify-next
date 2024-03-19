import { Box, Button, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import useCarousel from "@/hooks/useCarousel";
import Link from "next/link";
import CardDocumentTemplate from "@/components/common/cards/CardDocumentTemplate";
import { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import CardDocumentTemplatePlaceholder from "@/components/placeholders/CardDocumentTemplatePlaceholder";

interface Props {
  templates: TemplateExecutionsDisplay[] | undefined;
  isLoading: boolean;
}

export default function TemplatesCarousel({ templates, isLoading }: Props) {
  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel();

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
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={1}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Button
            LinkComponent={Link}
            href="/explore"
            variant="outlined"
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
      >
        <Stack
          direction={"row"}
          gap={isLoading ? 3 : 0}
        >
          {isLoading ? (
            <CardDocumentTemplatePlaceholder count={5} />
          ) : (
            templates?.map(template => (
              <Box key={template.id}>
                <CardDocumentTemplate template={template} />
              </Box>
            ))
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
