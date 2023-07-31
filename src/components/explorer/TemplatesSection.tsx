import { Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { FetchLoading } from "@/components/FetchLoading";
import CardTemplate from "@/components/common/cards/CardTemplate";
import { Templates } from "@/core/api/dto/templates";

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
  const router = useRouter();

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
