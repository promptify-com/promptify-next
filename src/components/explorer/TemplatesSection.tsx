import { useState, forwardRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import FilterList from "@mui/icons-material/FilterList";
import Close from "@mui/icons-material/Close";
import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import CardTemplate from "@/components/common/cards/CardTemplate";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { TemplatesFilter } from "@/components/explorer/TemplatesFilter";
import type { TemplateExecutionsDisplay, Templates } from "@/core/api/dto/templates";

interface TemplatesSectionProps {
  templates: Templates[] | TemplateExecutionsDisplay[] | undefined;
  isLoading?: boolean;
  templateLoading?: boolean;
  filtered?: boolean;
  title?: string;
  onNextPage?: () => void;
  type?: string;
  hasMore?: boolean;
  isInfiniteScrolling?: boolean;
  hasPrev?: boolean;
  onPrevPage?: () => void;
}

function TemplateHeader({ title, type }: Pick<TemplatesSectionProps, "title" | "type">) {
  const [openFilters, setOpenFilters] = useState(false);
  const filtersAllowed = !type || !["popularTemplates"].includes(type);

  return (
    <Box>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={1}
        p={{ xs: "8px 0px", md: "8px 16px" }}
      >
        <Typography
          fontSize={{ xs: 19, md: 32 }}
          fontWeight={400}
          color={"onSurface"}
        >
          {title}
        </Typography>
        {filtersAllowed && (
          <IconButton
            onClick={e => setOpenFilters(!openFilters)}
            size="small"
            sx={{
              ml: "auto",
              ":hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            {openFilters ? <Close /> : <FilterList />}
          </IconButton>
        )}
      </Stack>
      {openFilters && <TemplatesFilter />}
    </Box>
  );
}

export const TemplatesSection = forwardRef<HTMLDivElement, TemplatesSectionProps>(function TemplatesSectionInner(
  {
    templates,
    isLoading = false,
    filtered,
    title,
    onNextPage = () => {},
    type,
    hasMore,
    templateLoading,
    isInfiniteScrolling = true,
    hasPrev,
    onPrevPage = () => {},
  },
  ref,
) {
  const isNotLoading = !isLoading && !templateLoading;

  if (isNotLoading && !templates?.length) {
    return null;
  }

  return (
    <Box ref={ref}>
      {!filtered && (templateLoading || !!templates?.length) && (
        <TemplateHeader
          title={title}
          type={type}
        />
      )}

      {!isNotLoading ? (
        <CardTemplatePlaceholder count={8} />
      ) : (
        <Grid
          display={"flex"}
          gap={"16px"}
          flexDirection={"column"}
          flexWrap={{ xs: "nowrap", md: "wrap" }}
          sx={{
            gap: "1em",
            width: "100%",
            overflow: { xs: "auto", md: "initial" },
            WebkitOverflowScrolling: { xs: "touch", md: "initial" },
          }}
        >
          <InfiniteScrollContainer
            loading={isLoading}
            onLoadMore={onNextPage}
            hasMore={hasMore}
            isInfiniteScrolling={isInfiniteScrolling}
            hasPrev={hasPrev}
            onLoadLess={onPrevPage}
          >
            <Grid
              container
              spacing={1}
            >
              {!!templates?.length &&
                templates.map((template: TemplateExecutionsDisplay | Templates) => {
                  return (
                    <Grid
                      key={template.id}
                      item
                      xs={6}
                      sm={6}
                      md={5}
                      lg={3}
                    >
                      <CardTemplate
                        key={template.id}
                        template={template as Templates}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </InfiniteScrollContainer>

          {!isLoading && !templates?.length && (
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <NotFoundIcon />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
});
