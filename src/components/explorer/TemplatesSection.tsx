import { Box, Grid, Typography } from "@mui/material";

import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { FetchLoading } from "@/components/FetchLoading";
import CardTemplate from "@/components/common/cards/CardTemplate";
import { TemplateExecutionsDisplay, Templates } from "@/core/api/dto/templates";
import CardTemplateLast from "../common/cards/CardTemplateLast";

interface TemplatesSectionProps {
  templates: Templates[] | undefined;
  isLoading: boolean;
  filtred?: boolean;
  title?: string;
  isLatestTemplates?: boolean;
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  templates,
  isLoading,
  filtred,
  title,
  isLatestTemplates = false,
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
            container
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
            {!isLoading &&
              !!templates &&
              templates.length > 0 &&
              templates.map(
                (template: TemplateExecutionsDisplay | Templates) => (
                  <Grid key={template.id}>
                    {isLatestTemplates ? (
                      <CardTemplateLast
                        key={template.id}
                        template={template as TemplateExecutionsDisplay}
                      />
                    ) : (
                      <CardTemplate
                        key={template.id}
                        template={template as Templates}
                      />
                    )}
                  </Grid>
                )
              )}

            {!isLoading && (!templates || templates.length === 0) && (
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
