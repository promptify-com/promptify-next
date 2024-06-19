import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Layout } from "@/layout";
import CardWorkflow from "@/components/Automation/CardWorkflow";
import { AUTOMATION_DESCRIPTION } from "@/common/constants";
import type { ITemplateWorkflow } from "@/components/Automation/types";
import { authClient } from "@/common/axios";
import { useGetWorkflowsQuery } from "@/core/api/workflows";
import { useSearchParams } from "next/navigation";
import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";

interface Props {
  workflows: ITemplateWorkflow[];
  query: { enable: string };
}

export default function Automation({ workflows = [] }: Props) {
  const [workflowsData, setWorkflowsData] = useState<Props["workflows"]>(workflows);
  const searchParams = useSearchParams();
  const { data, isLoading } = useGetWorkflowsQuery(searchParams.get("enable") === "true", {
    skip: !!workflows.length,
  });

  useEffect(() => {
    if (!!data?.length) {
      setWorkflowsData(data);
    }
  }, [data]);

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
              <Typography variant="body1">{AUTOMATION_DESCRIPTION}</Typography>
            </Box>

            <Stack gap={3}>
              {!!workflowsData.length ? (
                workflowsData.map(workflow => (
                  <CardWorkflow
                    key={workflow.id}
                    workflow={workflow}
                  />
                ))
              ) : isLoading && !workflowsData.length ? (
                <Box bgcolor={"surface.1"}>
                  <CardTemplatePlaceholder count={5} />
                </Box>
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
}

export async function getServerSideProps({ query }: Props) {
  try {
    const enable = query.enable === "true";
    const res = await authClient.get(`/api/n8n/workflows/${enable ? "?enabled=true" : ""}`);
    const workflows: ITemplateWorkflow[] = res.data;

    return {
      props: {
        title: "GPTs",
        description: AUTOMATION_DESCRIPTION,
        workflows,
      },
    };
  } catch (error) {
    return {
      props: {
        title: "GPTs",
        description: AUTOMATION_DESCRIPTION,
        workflows: [],
      },
    };
  }
}
