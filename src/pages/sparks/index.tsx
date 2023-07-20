import React from "react";
import { FetchLoading } from "@/components/FetchLoading";
import CardTemplate from "@/components/common/cards/CardTemplate";
import { useGetTemplatesExecutionsByMeQuery } from "@/core/api/prompts";
import { Layout } from "@/layout";
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from "@mui/material";
import moment from "moment";
import { ArrowForwardIos, History } from "@mui/icons-material";

const Sparks = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const { 
    data: templatesExecutions, 
    isLoading: isTemplatesLoading 
  } = useGetTemplatesExecutionsByMeQuery();

  const toggleExpand = (panel: string) => (e: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
  };

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
        <Stack gap={2}>
          <Typography fontSize={18} fontWeight={500} color={"onSurface"}>
            My Sparks ({executionsCount})
          </Typography>
          <Stack gap={1}>
            {templatesExecutions?.map((template, i) => (
              <Accordion expanded={expanded === `accordian${i}`} onChange={toggleExpand(`accordian${i}`)}
                sx={{
                  borderRadius: "16px", 
                  overflow: "hidden",
                  boxShadow: "none",
                  ":first-of-type": { borderRadius: "16px" },
                  ":before": { display: "none" },
                  "&.Mui-expanded": { m: 0 }
                }}>
                <AccordionSummary sx={{ 
                    px: "8px", 
                    bgcolor: "surface.1",
                    flexDirection: "row-reverse",
                    gap: 2,
                    "&:hover": { bgcolor: "action.hover" },
                    ".MuiAccordionSummary-content, .MuiAccordionSummary-content.Mui-expanded": { 
                      m: 0,
                      gap: 2,
                      alignItems: "center",
                    },
                    ".MuiCard-root:hover": { bgcolor: "transparent" },
                  }}

                  expandIcon={<ArrowForwardIos sx={{ fontSize: 12, p: "8px", transform: 'rotate(90deg)' }} />}
                >
                  <Typography fontSize={14} fontWeight={500} color={"onSurface"}>
                    {template.executions.length}
                  </Typography>
                  <CardTemplate template={template} />
                </AccordionSummary>
                <AccordionDetails>
                  {template.executions.map((execution) => (
                    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} gap={1}
                      sx={{ p: "8px 16px" }}
                    >
                      <Typography fontSize={14} fontWeight={500} color={"onSurface"} letterSpacing={.46}
                        dangerouslySetInnerHTML={{ __html: 
                          execution.title.length > 150
                            ? `${execution.title?.slice(0, 150 - 1)}...`
                            : execution.title 
                        }} 
                      />
                      <Stack direction={"row"} alignItems={"center"} gap={1}>
                        <Typography fontSize={12} fontWeight={400} color={"onSurface"} sx={{ opacity: .5 }}>
                          {moment(execution.created_at).fromNow()}
                        </Typography>
                        <Stack direction={"row"} alignItems={"center"} gap={.5}
                          sx={{ 
                            fontSize: 13, 
                            fontWeight: 500, 
                            color: "onSurface", 
                            p: "0 6px",
                          }}
                        >
                          <History sx={{ fontSize: 18 }} />
                          {template.likes}
                        </Stack>
                      </Stack>
                    </Stack>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
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