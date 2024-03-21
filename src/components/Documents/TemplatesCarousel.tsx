import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import useCarousel from "@/hooks/useCarousel";
import CardDocumentTemplate from "@/components/common/cards/CardDocumentTemplate";
import { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import CardDocumentTemplatePlaceholder from "@/components/placeholders/CardDocumentTemplatePlaceholder";
import TemplatesMenuSection from "./TemplatesMenu";
import { useState } from "react";

interface Props {
  templates: TemplateExecutionsDisplay[] | undefined;
  isLoading: boolean;
}

export default function TemplatesCarousel({ templates, isLoading }: Props) {
  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={1}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Button
            onClick={e => setAnchorEl(e.currentTarget)}
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
            sortedTemplates?.map(template => (
              <Box key={template.id}>
                <CardDocumentTemplate template={template} />
              </Box>
            ))
          )}
        </Stack>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        disableScrollLock
      >
        <TemplatesMenuSection templates={sortedTemplates || []} />
      </Menu>
    </Stack>
  );
}
