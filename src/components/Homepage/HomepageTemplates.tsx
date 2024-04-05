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
  if (!templates.length) {
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

      {templatesLoading ? (
        <Grid
          container
          gap={2}
          justifyContent={{ xs: "center", md: "flex-start" }}
        >
          <CardTemplatePlaceholder count={5} />
        </Grid>
      ) : (
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

          <>
            {templates?.map(template => (
              <Grid
                key={template.id}
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
        </Grid>
      )}
    </Stack>
  );
}

export default HomepageTemplates;
