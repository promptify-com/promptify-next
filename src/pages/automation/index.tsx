import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Layout } from "@/layout";
import CardWorkflow from "@/components/Automation/CardWorkflow";
import { SEO_DESCRIPTION } from "@/common/constants";
import { IWorkflow } from "@/components/Automation/types";
import { authClient } from "@/common/axios";

interface Props {
  workflows: IWorkflow[];
}

const Automation = ({ workflows }: Props) => {
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
                Discover advanced Generative AI that combine sophisticated prompt templates, set of instructions, extra
                knowledge, and any combination of skills.
              </Typography>
            </Box>

            <Stack gap={3}>
              {workflows.length > 0 ? (
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
        </Grid>
      </Box>
    </Layout>
  );
};

export async function getServerSideProps() {
  try {
    const res = await authClient.get(`/api/n8n/workflows`);
    const workflows: IWorkflow[] = res.data;

    return {
      props: {
        title: "GPTs",
        description: SEO_DESCRIPTION,
        workflows,
      },
    };
  } catch (error) {
    return {
      props: {
        title: "GPTs",
        description: SEO_DESCRIPTION,
        workflows: [],
      },
    };
  }
}

export default Automation;
