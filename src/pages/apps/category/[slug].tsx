import { useRouter } from "next/router";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Layout } from "@/layout";
import { useGetWorkflowByCategoryQuery } from "@/core/api/workflows";
import { useEffect, useState } from "react";
import { ITemplateWorkflow } from "@/components/Automation/types";
import WorkflowCard from "@/components/GPTs/WorkflowCard";
import Grid from "@mui/material/Grid";
import CategoryCardPlaceholder from "@/components/GPTs/CategoryCardPlaceholder";

export default function Category() {
  const [workflows, setWorkflows] = useState<ITemplateWorkflow[]>([]);

  const { data: workflowsByCategory, isLoading: isLoadingWorkflowsByCategory } = useGetWorkflowByCategoryQuery();

  const router = useRouter();
  const { slug } = router.query;

  const slugString = Array.isArray(slug) ? slug.join("-") : slug;
  const categoryName = slugString?.split("-").join(" ");

  useEffect(() => {
    if (workflowsByCategory && categoryName) {
      const tempWorkflows = workflowsByCategory?.find(
        workflow => workflow.name.toLowerCase() === categoryName.toLowerCase(),
      );

      setWorkflows(tempWorkflows?.templates ?? []);
    }
  }, [categoryName, workflowsByCategory]);

  const goBack = () => {
    router.push("/apps");
  };

  return (
    <Layout>
      <Box
        mt={{ xs: 7, md: -2 }}
        sx={{
          maxWidth: "1072px",
          mx: "auto",
          p: { xs: "16px", md: "32px 72px" },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          py={"16px"}
        >
          <Button
            onClick={goBack}
            variant="text"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "onSurface",
              p: "8px",
              fontSize: 16,
              fontWeight: 400,
              opacity: 0.3,
              transition: "opacity 0.3s ease-in-out",
              willChange: "opacity",
            }}
          >
            All AI apps
            <KeyboardArrowLeft />
          </Button>

          <Typography
            sx={{
              color: "onSurface",
              fontSize: 16,
              fontWeight: 400,
              p: "8px",
              textTransform: "capitalize",
            }}
          >
            {categoryName}
          </Typography>
        </Stack>

        <Grid
          container
          spacing={1}
        >
          {isLoadingWorkflowsByCategory ? (
            <Grid item>
              <CategoryCardPlaceholder />
            </Grid>
          ) : (
            workflows?.map(workflow => (
              <Grid
                item
                key={workflow.id}
                mt={4}
              >
                <WorkflowCard
                  templateWorkflow={workflow}
                  lastExecuted={null}
                  category={categoryName}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Layout>
  );
}
