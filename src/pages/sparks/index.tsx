import React from "react";
import { FetchLoading } from "@/components/FetchLoading";
import CardTemplate from "@/components/common/cards/CardTemplate";
import { useGetTemplatesExecutionsByMeQuery } from "@/core/api/prompts";
import { Layout } from "@/layout";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import { ArrowForwardIos, History } from "@mui/icons-material";
import { useRouter } from "next/router";

const Sparks = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const router = useRouter();

  const { data: templatesExecutions, isLoading: isTemplatesLoading } =
    useGetTemplatesExecutionsByMeQuery();

  const toggleExpand =
    (panel: string) => (e: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  let executionsCount = 0;
  const sortedTemplates = templatesExecutions?.map((template) => {
    const executions = [...template.executions].sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    executionsCount += template.executions.length;

    return {
      ...template,
      executions,
    };
  });

  return (
    <Layout>
      <Box mt={{ xs: 7, md: 0 }} padding={{ xs: "4px 0px", md: "0px 8px" }}>
        <Grid
          sx={{
            padding: { xs: "16px", md: "32px" },
          }}
        >
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
                {sortedTemplates && sortedTemplates.length > 0 ? (
                  sortedTemplates.map((template, i) => (
                    <Accordion
                      key={template.id}
                      expanded={expanded === `accordian${i}`}
                      onChange={toggleExpand(`accordian${i}`)}
                      TransitionProps={{ unmountOnExit: true }}
                      sx={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: "none",
                        bgcolor: "surface.2",
                        ":first-of-type": { borderRadius: "16px" },
                        ":before": { display: "none" },
                        "&.Mui-expanded": { m: 0 },
                      }}
                    >
                      <AccordionSummary
                        sx={{
                          flexDirection: "row-reverse",
                          gap: 2,
                          "&:hover": { bgcolor: "action.hover" },
                          ".MuiAccordionSummary-content, .MuiAccordionSummary-content.Mui-expanded":
                            {
                              m: 0,
                              gap: 2,
                              alignItems: "center",
                            },
                          ".MuiCard-root, .MuiCard-root:hover": {
                            bgcolor: "transparent",
                          },
                        }}
                        expandIcon={
                          <ArrowForwardIos
                            sx={{
                              fontSize: 10,
                              p: "8px",
                              transform: "rotate(90deg)",
                            }}
                          />
                        }
                      >
                        <Grid container alignItems={"center"}>
                          <Grid item xs={0.5}>
                            <Typography
                              fontSize={14}
                              fontWeight={500}
                              color={"onSurface"}
                            >
                              {template.executions.length}
                            </Typography>
                          </Grid>
                          <Grid item xs={11.5}>
                            <CardTemplate template={template} />
                          </Grid>
                        </Grid>
                      </AccordionSummary>
                      <Divider
                        sx={{
                          m: "0 8px 8px",
                          bgcolor: "surface.5",
                          opacity: 0.5,
                        }}
                      />
                      <AccordionDetails>
                        {template.executions.map((execution) => (
                          <Stack
                            key={execution.id}
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            gap={1}
                            sx={{
                              p: "8px 16px",
                              cursor: "pointer",
                              ":hover": { bgcolor: "action.hover" },
                            }}
                            onClick={() =>
                              router.push(
                                `prompt/${template.slug}?spark=${execution.id}`
                              )
                            }
                          >
                            <Typography
                              fontSize={14}
                              fontWeight={500}
                              color={"onSurface"}
                              letterSpacing={0.46}
                              dangerouslySetInnerHTML={{
                                __html:
                                  execution.title.length > 150
                                    ? `${execution.title?.slice(0, 150 - 1)}...`
                                    : execution.title,
                              }}
                            />
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              gap={1}
                            >
                              <Typography
                                fontSize={12}
                                fontWeight={400}
                                color={"onSurface"}
                                sx={{ opacity: 0.5 }}
                              >
                                {moment(execution.created_at).fromNow()}
                              </Typography>
                              <Stack
                                direction={"row"}
                                alignItems={"center"}
                                gap={0.5}
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
                    No sparks found
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
