import { Box, Grid, Typography } from "@mui/material";

import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { FetchLoading } from "@/components/FetchLoading";
import CardTemplate from "@/components/common/cards/CardTemplate";
import { Templates } from "@/core/api/dto/templates";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";

interface TemplatesSectionProps {
  templates: Templates[] | undefined;
  isLoading: boolean;
  filtred?: boolean;
  title?: string;
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  templates,
  isLoading,
  filtred,
  title,
}) => {
  return (
    <>
      <Box width={"100%"}>
        {!filtred && <Typography fontSize={19}>{title}</Typography>}
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Grid item key={index} sx={{ mb: 2 }}>
              <CardTemplatePlaceholder />
            </Grid>
          ))
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
                  <CardTemplate key={el.id} template={el} />
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
