import React from "react";
import { Box, Grid, Stack, Typography, Skeleton } from "@mui/material";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import SparksContainer from "@/components/SparksContainer";
import SparksTemplatePlaceholder from "@/components/placeholders/SparksTemplatePlaceholder";
import { useGetWorkflowsQuery } from "@/core/api/automations";
import CardWorkflow from "@/components/common/cards/CardWorkflow";
import LatestTemplatePlaceholder from "@/components/placeholders/LatestTemplatePlaceholder";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";

const Sparks = () => {
  const { data: workflows, isLoading } = useGetWorkflowsQuery();

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
            {isLoading ? (
              <>
                <Box
                  width={{ xs: "40%", md: "20%" }}
                  mb={1}
                >
                  <Skeleton
                    variant="text"
                    height={35}
                    width={"100%"}
                    animation="wave"
                  />
                </Box>

                <Box bgcolor={"surface.1"}>
                  <CardTemplatePlaceholder count={3} />
                </Box>
              </>
            ) : (
              <Stack gap={4}>
                <Typography
                  fontSize={"24px"}
                  fontWeight={500}
                  color={"onSurface"}
                  lineHeight={"34.32px"}
                  letterSpacing={"0.17"}
                >
                  Automations
                </Typography>
                <Stack gap={3}>
                  {workflows ? (
                    workflows.map(workflow => (
                      <CardWorkflow
                        key={workflow.id}
                        workflow={workflow}
                      />
                    ))
                  ) : (
                    <Typography
                      sx={{
                        color: "onSurface",
                        opacity: 0.5,
                        textAlign: "center",
                        mt: "50px",
                      }}
                    >
                      No works found
                    </Typography>
                  )}
                </Stack>
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
