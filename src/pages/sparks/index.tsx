import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { FetchLoading } from "@/components/FetchLoading";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import SparksContainer from "@/components/SparksContainer";
import { useGetTemplatesExecutionsByMeQuery } from "@/core/api/executions";

const Sparks = () => {
  const { data: executedTemplates, isLoading: isExecutedTemplatesLoading } = useGetTemplatesExecutionsByMeQuery();

  return (
    <Protected>
      <Layout>
        <Box
          mt={{ xs: 7, md: 0 }}
          padding={{ xs: "4px 0px", md: "0px 8px" }}
        >
          <Grid
            sx={{
              padding: { xs: "16px", md: "32px" },
            }}
          >
            {isExecutedTemplatesLoading ? (
              <Box>
                <FetchLoading />
              </Box>
            ) : (
              <Stack gap={2}>
                <Typography
                  fontSize={"24px"}
                  fontWeight={500}
                  color={"onSurface"}
                  lineHeight={"34.32px"}
                  letterSpacing={"0.17"}
                >
                  My Sparks
                </Typography>
                {executedTemplates?.length ? (
                  <SparksContainer templates={executedTemplates} />
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
