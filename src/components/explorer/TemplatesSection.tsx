import { Box, Grid, Typography } from "@mui/material";

import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { FetchLoading } from "@/components/FetchLoading";
import CardTemplate from "@/components/common/cards/CardTemplate";
import { TemplateExecutionsDisplay, Templates, TemplatesWithPagination } from "@/core/api/dto/templates";
import CardTemplateLast from "../common/cards/CardTemplateLast";
import TemplatesPaginatedList from "../TemplatesPaginatedList";

interface TemplatesSectionProps {
  templates: Templates[] | TemplateExecutionsDisplay[] | undefined;
  isLoading: boolean;
  filtred?: boolean;
  title?: string;
  isLatestTemplates?: boolean;
  hasNext?: boolean;
  hasPrev?: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  templates,
  isLoading,
  filtred,
  title,
  isLatestTemplates = false,
  hasNext = false,
  hasPrev = false,
  onNextPage = () => {},
  onPrevPage = () => {},
}) => {
  return (
    <>
      <Box width={"100%"}>
        {!filtred && <Typography fontSize={19}>{title}</Typography>}
        {isLoading ? (
          <Box
            minHeight={"40vh"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <FetchLoading />
          </Box>
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
                {!isLoading &&
                  !!templates &&
                  templates.length > 0 &&
                  templates.map((template: TemplateExecutionsDisplay | Templates) => (
                    <Grid key={template.id}>
                      <CardTemplateLast
                        key={template.id}
                        template={template as TemplateExecutionsDisplay}
                      />
                    </Grid>
                  ))}
              </Grid>
            ) : (
              <Grid>
                <TemplatesPaginatedList
                  hasNext={hasNext}
                  hasPrev={hasPrev}
                  onPrevPage={onPrevPage}
                  onNextPage={onNextPage}
                >
                  {!isLoading &&
                    !!templates &&
                    templates.length > 0 &&
                    templates.map((template: TemplateExecutionsDisplay | Templates) => (
                      <Grid key={template.id}>
                        <CardTemplate
                          key={template.id}
                          template={template as Templates}
                        />
                      </Grid>
                    ))}
                </TemplatesPaginatedList>
              </Grid>
            )}

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
    </>
  );
};
