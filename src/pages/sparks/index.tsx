import { FetchLoading } from "@/components/FetchLoading";
import { useGetTemplatesExecutionsByMeQuery } from "@/core/api/prompts";
import { Layout } from "@/layout";
import { Box, Stack, Typography } from "@mui/material";

const Sparks = () => {
  const { 
    data: templatesExecutions, 
    isLoading: isTemplatesLoading 
  } = useGetTemplatesExecutionsByMeQuery();

  const executionsCount = templatesExecutions?.reduce((acc, curr) => {
    return acc + curr.executions.length;
  }, 0)

  console.log(templatesExecutions);

  return (
    <Layout>
      {isTemplatesLoading ? (
        <Box>
          <FetchLoading />
        </Box>
      ) : (
        <Stack>
          <Typography fontSize={18} fontWeight={500} color={"onSurface"}>
            My Sparks ({executionsCount})
          </Typography>
        </Stack>
      )}
    </Layout>
  );
};

export async function getServerSideProps({ params }: any) {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    }
  }
}

export default Sparks;