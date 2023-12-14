import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import CardTemplate from "@/components/common/cards/CardTemplate";
import { TemplateExecutionsDisplay, Templates } from "@/core/api/dto/templates";
import CardTemplateLast from "../common/cards/CardTemplateLast";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";
import LatestTemplatePlaceholder from "@/components/placeholders/LatestTemplatePlaceholder";
import TemplatesInfiniteScroll from "../TemplatesInfiniteScroll";
import { TemplatesFilter } from "./TemplatesFilter";
import { Close, FilterList } from "@mui/icons-material";
import { useState } from "react";

interface TemplatesSectionProps {
  templates: Templates[] | TemplateExecutionsDisplay[] | undefined;
  isLoading: boolean;
  filtred?: boolean;
  title?: string;
  isLatestTemplates?: boolean;
  onNextPage?: () => void;
  type?: string;
  hasMore?: boolean;
  templateLoading?: boolean;
  isInfiniteScrolling?: boolean;
  hasPrev?: boolean;
  onPrevPage?: () => void;
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  templates,
  isLoading,
  filtred,
  title,
  isLatestTemplates = false,
  onNextPage = () => {},
  type,
  hasMore,
  templateLoading,
  isInfiniteScrolling = true,
  hasPrev,
  onPrevPage = () => {},
}) => {
  const [openFilters, setOpenFilters] = useState(false);

  if (!isLoading && !templates?.length) {
    return null;
  }

  const filtersAllowed = type !== "myLatestExecutions";

  return (
    <Box width={"100%"}>
      {!filtred && (templateLoading || !!templates?.length) && (
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
      )}

      {templateLoading ? (
        isLatestTemplates ? (
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
            !!templates?.length && (
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
            )
          ) : (
            <Grid>
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
            </Grid>
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
};
