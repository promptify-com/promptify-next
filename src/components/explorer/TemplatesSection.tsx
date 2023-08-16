import { Box, Grid, Typography } from "@mui/material";

import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { FetchLoading } from "@/components/FetchLoading";
import CardTemplate from "@/components/common/cards/CardTemplate";
import { Templates } from "@/core/api/dto/templates";
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
            flexDirection={"column"}
            sx={{
              mt: "10px",
              gap: "1em",
              width: "100%",
            }}
          >
            {!isLoading &&
              !!templates &&
              templates.length > 0 &&
              templates.map((el: any) => (
                <Grid key={el.id} item xs={12}>
                  {isLatestTemplates ? (
                    <CardTemplateLast key={el.id} template={el} />
                  ) : (
                    <CardTemplate key={el.id} template={el} />
                  )}
                </Grid>
              ))}

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
