import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import CardTemplate from "@/components/common/cards/CardTemplate";
import { TemplateExecutionsDisplay, Templates } from "@/core/api/dto/templates";
import CardTemplateLast from "@/components/common/cards/CardTemplateLast";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";
import LatestTemplatePlaceholder from "@/components/placeholders/LatestTemplatePlaceholder";
import TemplatesInfiniteScroll from "@/components/TemplatesInfiniteScroll";
import { TemplatesFilter } from "./TemplatesFilter";
import { Close, FilterList } from "@mui/icons-material";
import { useState, forwardRef } from "react";
import { useAppSelector } from "@/hooks/useStore";
import ExploreCardTemplate from "@/components/common/cards/ExploreCardTemplate";

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
  bgColor?: string;
  explore?: boolean;
}

function TemplateHeader({ title, type }: Pick<TemplatesSectionProps, "title" | "type">) {
  const [openFilters, setOpenFilters] = useState(false);
  const filtersAllowed = !type || !["myLatestExecutions", "popularTemplates"].includes(type);

  return (
    <Box>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={1}
      >
        <Typography fontSize={19}>{title}</Typography>
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

function LatestTemplates({ templates }: Pick<TemplatesSectionProps, "templates">) {
  if (!templates?.length) {
    return null;
  }

  return (
    <Grid
      display={"flex"}
      flexWrap={{ xs: "nowrap", md: "wrap" }}
      sx={{
        gap: "1em",
        width: "100%",
        overflow: { xs: "auto", md: "initial" },
        WebkitOverflowScrolling: { xs: "touch", md: "initial" },
      }}
    >
      {templates.map((template: TemplateExecutionsDisplay | Templates) => (
        <Grid key={template.id}>
          <CardTemplateLast
            key={template.id}
            template={template as TemplateExecutionsDisplay}
          />
        </Grid>
      ))}
    </Grid>
  );
}

function PopularTemplates({ templates, bgColor }: Pick<TemplatesSectionProps, "templates" | "bgColor">) {
  const isPromptsFiltersSticky = useAppSelector(state => state.sidebar.isPromptsFiltersSticky);

  if (!templates?.length) {
    return null;
  }

  return (
    <Grid
      container
      spacing={1}
      alignItems={"flex-start"}
      sx={{
        overflow: { xs: "auto", md: "initial" },
        WebkitOverflowScrolling: { xs: "touch", md: "initial" },
      }}
    >
      {templates.map((template: TemplateExecutionsDisplay | Templates, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={isPromptsFiltersSticky ? 5 : 4}
          lg={3}
          key={`${template.id}_${index}`}
        >
          <ExploreCardTemplate
            template={template as Templates}
            bgColor={bgColor}
            vertical
            showTagsOnHover
          />
        </Grid>
      ))}
    </Grid>
  );
}

function TemplatePagination({
  isLoading,
  onNextPage,
  hasMore,
  isInfiniteScrolling,
  hasPrev,
  onPrevPage,
  templates = [],
}: Omit<TemplatesSectionProps, "filtered" | "type" | "templateLoading" | "title">) {
  if (!templates?.length && !isLoading && typeof onNextPage !== "function") {
    return null;
  }

  return (
    <Grid>
      <TemplatesInfiniteScroll
        loading={Boolean(isLoading)}
        onLoadMore={onNextPage!}
        hasMore={hasMore}
        isInfiniteScrolling={isInfiniteScrolling}
        hasPrev={hasPrev}
        onLoadLess={onPrevPage}
      >
        {templates.map((template: TemplateExecutionsDisplay | Templates) => {
          return (
            <Grid key={template.id}>
              <CardTemplate
                key={template.id}
                template={template as Templates}
              />
            </Grid>
          );
        })}
      </TemplatesInfiniteScroll>
    </Grid>
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
    bgColor = "surface.2",
    explore,
  },
  ref,
) {
  const isNotLoading = !isLoading && !templateLoading;
  const isLatestTemplates = type === "myLatestExecutions";
  const isPopularTemplates = type === "popularTemplates";

  if (isNotLoading && !templates?.length) {
    return null;
  }

  return (
    <Box
      width={"100%"}
      ref={ref}
    >
      {!filtered && (templateLoading || !!templates?.length) && (
        <TemplateHeader
          title={title}
          type={type}
        />
      )}

      {templateLoading ? (
        isLatestTemplates || isPopularTemplates ? (
          <Grid
            display={"flex"}
            flexDirection={"row"}
            gap={"16px"}
            alignItems={"flex-start"}
            alignContent={"flex-start"}
            alignSelf={"stretch"}
            flexWrap={{ xs: "nowrap", md: "wrap" }}
          >
            <LatestTemplatePlaceholder count={4} />
          </Grid>
        ) : (
          <CardTemplatePlaceholder count={5} />
        )
      ) : (
        <Grid
          display={"flex"}
          gap={"16px"}
          flexDirection={isLatestTemplates ? "row" : "column"}
          flexWrap={{ xs: "nowrap", md: "wrap" }}
          sx={{
            mt: "10px",
            gap: "1em",
            width: "100%",
            overflow: { xs: "auto", md: "initial" },
            WebkitOverflowScrolling: { xs: "touch", md: "initial" },
          }}
        >
          {isLatestTemplates ? (
            <LatestTemplates templates={templates} />
          ) : isPopularTemplates ? (
            <PopularTemplates
              templates={templates}
              bgColor={bgColor}
            />
          ) : explore ? (
            <PopularTemplates
              templates={templates}
              bgColor={bgColor}
            />
          ) : (
            <TemplatesInfiniteScroll
              loading={isLoading}
              onLoadMore={onNextPage}
              hasMore={hasMore}
              isInfiniteScrolling={isInfiniteScrolling}
              hasPrev={hasPrev}
              onLoadLess={onPrevPage}
            >
              {!!templates?.length &&
                templates.map((template: TemplateExecutionsDisplay | Templates) => {
                  return (
                    <Grid key={template.id}>
                      <CardTemplate
                        key={template.id}
                        template={template as Templates}
                      />
                    </Grid>
                  );
                })}
            </TemplatesInfiniteScroll>
          )}

          {type !== "myLatestExecutions" && !isLoading && !templates?.length && (
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
