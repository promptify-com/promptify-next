import React from "react";
import moment from "moment";
import { Box, Grid, Stack, Typography } from "@mui/material";

import { FetchLoading } from "@/components/FetchLoading";
import { Layout } from "@/layout";
import { useGetSparksByMeQuery } from "@/core/api/sparks";
import Protected from "@/components/Protected";

import SparksSection from "@/components/SparksSection";
import { TemplateExecutionsDisplay } from "@/core/api/dto/templates";

const Sparks = () => {
  const { data: sparksByTemplate, isLoading: isSparksByTemplateLoading } =
    useGetSparksByMeQuery();

  let sparksCount = 0;
  const sortedTemplates = sparksByTemplate?.map((template) => {
    // Sort the sparks inside each template by current_version.created_at
    const sortedSparks = [...template.sparks].sort((a, b) =>
      moment(b.current_version?.created_at).diff(
        moment(a.current_version?.created_at)
      )
    );
    sparksCount += template.sparks.length;

    return {
      ...template,
      sparks: sortedSparks,
    };
  });

  return (
    <Protected>
      <Layout>
        <Box mt={{ xs: 7, md: 0 }} padding={{ xs: "4px 0px", md: "0px 8px" }}>
          <Grid
            sx={{
              padding: { xs: "16px", md: "32px" },
            }}
          >
            {isSparksByTemplateLoading ? (
              <Box>
                <FetchLoading />
              </Box>
            ) : (
              <Stack gap={2}>
                <Typography fontSize={18} fontWeight={500} color={"onSurface"}>
                  My Sparks ({sparksCount})
                </Typography>
                {sortedTemplates?.length ? (
                  <SparksSection
                    templates={sortedTemplates as TemplateExecutionsDisplay[]}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: "onSurface",
                      opacity: 0.5,
                      textAlign: "center",
                      mt: "50px",
                    }}
                  >
                    No sparks found
                  </Typography>
                )}
              </Stack>
            )}
          </Grid>
        </Box>
      </Layout>
    </Protected>
  );
};

export async function getServerSideProps({ params }: any) {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}

export default Sparks;
