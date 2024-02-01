import React from "react";
import { Box, Grid, Stack, Typography, Skeleton } from "@mui/material";
import { Layout } from "@/layout";
import { useGetWorkflowsQuery } from "@/core/api/workflows";
import CardWorkflow from "@/components/Automation/CardWorkflow";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";

const Automation = () => {
  const { data: workflows, isLoading } = useGetWorkflowsQuery();

  return (
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
              <Box>
                <Typography
                  fontSize={"24px"}
                  fontWeight={500}
                  color={"onSurface"}
                  lineHeight={"34.32px"}
                  letterSpacing={"0.17"}
                >
                  GPTs
                </Typography>
                <Typography variant="body1">
                  Discover advanced Generative AI that combine sophisticated prompt templates, set of instructions,
                  extra knowledge, and any combination of skills.
                </Typography>
              </Box>

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
                    No automation found
                  </Typography>
                )}
              </Stack>
            </Stack>
          )}
        </Grid>
      </Box>
    </Layout>
  );
};

export function getServerSideProps() {
  return {
    props: {
      title: "Promptify | Boost Your Creativity With Automation",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}

export default Automation;
