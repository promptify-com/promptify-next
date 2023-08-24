import { Box, Grid, Typography } from "@mui/material";

import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import CardTemplate from "@/components/common/cards/CardTemplate";
import { TemplateExecutionsDisplay, Templates } from "@/core/api/dto/templates";
import CardTemplateLast from "../common/cards/CardTemplateLast";

import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";
import LatestTemplatePlaceholder from "@/components/placeholders/LatestTemplatePlaceholder";

interface TemplatesSectionProps {
  templates: Templates[] | TemplateExecutionsDisplay[] | undefined;
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
  console.log(isLatestTemplates);
  return (
    <>
      <Box width={"100%"}>
        {!filtred && <Typography fontSize={19}>{title}</Typography>}

        {isLoading ? (
          isLatestTemplates ?
          <Grid
            display={"flex"}
            flexDirection={"row"}
            gap={"16px"}
            alignItems={"flex-start"}
            alignContent={"flex-start"}
            alignSelf={"stretch"}
            flexWrap={{ xs: "nowrap", md: "wrap" }}
          >
            <LatestTemplatePlaceholder count={4}/>
          </Grid>
           : <CardTemplatePlaceholder count={6} />  
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
              templates.map((template: TemplateExecutionsDisplay | Templates) => (
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
              ))}

            {!isLoading && !(templates && templates.length) && (
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
