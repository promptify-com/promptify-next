import { useCallback, useRef } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TemplatesPaginatedList from "@/components/TemplatesPaginatedList";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";

import type { Templates } from "@/core/api/dto/templates";
import useBrowser from "@/hooks/useBrowser";

interface Props {
  loading: boolean;
  hasNext: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  templates: Templates[];
  templateLoading: boolean;
}

function PopularTemplates({ loading, hasNext, onNextPage, onPrevPage, templates, templateLoading }: Props) {
  const observer = useRef<IntersectionObserver | null>(null);
  const { isMobile } = useBrowser();

  const SCROLL_THRESHOLD = 24;

  const lastTemplateElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      if (templates.length >= SCROLL_THRESHOLD) return;

      const rowHeight = isMobile ? 145 : 80;
      const margin = `${2 * rowHeight}px`;

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasNext) {
            onNextPage();
          }
        },
        { rootMargin: margin },
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasNext, templates],
  );

  return (
    <Stack gap={3}>
      <Stack
        p={"8px 16px"}
        mb={"-24px"}
      >
        <Typography
          fontSize={{ xs: 28, md: 32 }}
          fontWeight={400}
          color={"#2A2A3C"}
        >
          Most popular templates:
        </Typography>
      </Stack>
      <TemplatesPaginatedList
        loading={loading}
        hasNext={hasNext}
        onNextPage={onNextPage}
        hasPrev={false}
        onPrevPage={onPrevPage}
        buttonText="Load more"
        variant="outlined"
      >
        <TemplatesSection
          templateLoading={templateLoading}
          templates={templates}
          type="popularTemplates"
          bgColor="surfaceContainerLow"
        />
        <div ref={lastTemplateElementRef}></div>
      </TemplatesPaginatedList>
    </Stack>
  );
}

export default PopularTemplates;
