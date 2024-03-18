import { Box, Button, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import CarouselButtons from "@/components/common/buttons/CarouselButtons";
import useCarousel from "@/hooks/useCarousel";
import Link from "next/link";
import { useGetTemplatesExecutionsByMeQuery } from "@/core/api/executions";
import CardDocumentTemplate from "@/components/common/cards/CardDocumentTemplate";

export default function TemplatesCarousel() {
  const { containerRef: carouselRef, scrollNext, scrollPrev } = useCarousel();
  const { data: executedTemplates, isLoading: isExecutedTemplatesLoading } =
    useGetTemplatesExecutionsByMeQuery(undefined);

  const isEmpty = !isExecutedTemplatesLoading && !executedTemplates?.length;

  if (isEmpty) return;

  return (
    <Box>
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
        m={"8px 16px"}
      >
        <Stack direction={"row"}>
          {executedTemplates?.map(template => (
            <Box key={template.id}>
              <CardDocumentTemplate template={template} />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
