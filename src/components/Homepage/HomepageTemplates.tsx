import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AdsBox from "@/components/Homepage/GuestUserLayout/AdsBox";
import CardTemplate from "@/components/common/cards/CardTemplate";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";
import type { Templates } from "@/core/api/dto/templates";

interface Props {
  title: string;
  templates: Templates[];
  templatesLoading: boolean;
  showAdsBox?: boolean;
}

function HomepageTemplates({ title, templates, templatesLoading, showAdsBox }: Props) {
  if (!templates.length && !templatesLoading) {
    return null;
  }
  return (
    <Stack gap={"32px"}>
      <Typography
        fontSize={{ xs: 24, md: 32 }}
        fontWeight={400}
        lineHeight={"38.8px"}
        letterSpacing={"0.17px"}
        color={"onSurface"}
      >
        {title}
      </Typography>

      <Grid
        container
        ml={{ md: -2 }}
        spacing={1}
      >
        {showAdsBox && (
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            lg={6}
            xl={4}
            mb={{ xs: 2, md: 0 }}
          >
            <AdsBox />
          </Grid>
        )}

        {templatesLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Grid
              key={idx}
              item
              xs={6}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              sx={{
                minWidth: { xs: "50%", md: "210px" },
                height: { xs: "calc(100% - 16px)", md: "calc(100% - 24px)" },
                p: { xs: "0 0 8px 0", md: "24px 16px 8px!important" },
                ".MuiGrid-item": {
                  maxWidth: "100%",
                  p: "0 !important",
                },
              }}
            >
              <CardTemplatePlaceholder
                count={1}
                transparent
                description
              />
            </Grid>
          ))
        ) : (
          <>
            {templates?.map((template, index) => (
              <Grid
                key={index}
                item
                xs={6}
                sm={6}
                md={4}
                lg={3}
                xl={2}
              >
                <CardTemplate template={template} />
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Stack>
  );
}

export default HomepageTemplates;
