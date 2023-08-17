import React, { useState } from "react";
import moment from "moment";
import Link from "next/link";
import { ArrowForwardIos, Delete, Edit, History } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Spark, TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import CardTemplate from "./common/cards/CardTemplate";
import SparkForm from "./prompt/SparkForm";
import { DeleteDialog } from "./dialog/DeleteDialog";
import { useDeleteSparkMutation } from "@/core/api/sparks";

interface SparksSectionProps {
  templates: TemplateExecutionsDisplay[];
}

const SparksSection: React.FC<SparksSectionProps> = ({ templates }) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [sparkFormOpen, setSparkFormOpen] = useState(false);
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState<boolean>(false);
  const [deleteSpark, { isLoading }] = useDeleteSparkMutation();

  const [activeSpark, setActiveSpark] = useState<Spark | undefined>();
  const toggleExpand = (panel: string) => (e: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  function truncateTitle(title: string) {
    return title && title.length > 150 ? `${title.slice(0, 150 - 1)}...` : title;
  }
  return (
    <Stack gap={1}>
      {templates.map(template => (
        <Accordion
          key={template.id}
          expanded={expanded === `accordian${template.id}`}
          onChange={toggleExpand(`accordian${template.id}`)}
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
              ".MuiAccordionSummary-content, .MuiAccordionSummary-content.Mui-expanded": {
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
            <Grid
              container
              alignItems={"center"}
            >
              <Grid
                item
                xs={0.5}
              >
                <Typography
                  fontSize={14}
                  fontWeight={500}
                  color={"onSurface"}
                >
                  {template.sparks?.length ?? 0}
                </Typography>
              </Grid>
              <Grid
                item
                xs={11.5}
              >
                <CardTemplate
                  template={template}
                  noRedirect
                />
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
            {template.sparks?.map(spark => (
              <Box
                key={spark.id}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Link
                  href={{
                    pathname: `prompt/${template.slug}`,
                    query: { spark: spark.id },
                  }}
                  style={{
                    textDecoration: "none",
                    flex: 1,
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    gap={1}
                    sx={{
                      p: "8px 16px",
                      cursor: "pointer",
                      ":hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Typography
                      fontSize={14}
                      fontWeight={500}
                      color={"onSurface"}
                      letterSpacing={0.46}
                      dangerouslySetInnerHTML={{
                        __html: truncateTitle(spark.initial_title),
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
                        {spark.current_version ? moment(spark.current_version.created_at).fromNow() : "-"}
                      </Typography>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        gap={1}
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "onSurface",
                          p: "0 6px",
                        }}
                      >
                        <Grid
                          display={"flex"}
                          alignItems={"center"}
                          gap={0.5}
                        >
                          <History sx={{ fontSize: 18 }} />
                          {spark.versions.length}
                        </Grid>
                      </Stack>
                    </Stack>
                  </Stack>
                </Link>
                <Grid
                  display={"flex"}
                  alignItems={"center"}
                  gap={1}
                >
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: "surface.2",
                        border: "none",
                        color: "onSurface",
                        "&:hover": {
                          bgcolor: "surface.3",
                          color: "onSurface",
                        },
                      }}
                      onClick={() => {
                        //@ts-ignore: spark object passed to setActiveSpark does not matches the Spark type
                        setActiveSpark(spark);
                        setSparkFormOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => {
                        //@ts-ignore: spark object passed to setActiveSpark does not matches the Spark type
                        setActiveSpark(spark);
                        setDialogDeleteOpen(true);
                      }}
                      sx={{
                        bgcolor: "surface.2",
                        border: "none",
                        color: "onSurface",
                        "&:hover": {
                          bgcolor: "surface.3",
                          color: "#ef4444",
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Box>
            ))}
            <SparkForm
              type="edit"
              isOpen={sparkFormOpen}
              close={() => setSparkFormOpen(false)}
              activeSpark={activeSpark}
              templateId={template?.id}
            />
            {activeSpark !== undefined && (
              <DeleteDialog
                open={dialogDeleteOpen}
                dialogTitle="Delete Spark"
                dialogContentText={`Are you sure you want to delete ${
                  truncateTitle(activeSpark?.initial_title) || "this"
                } Spark?`}
                onClose={() => setDialogDeleteOpen(false)}
                onSubmit={() => {
                  deleteSpark(activeSpark.id);
                  setDialogDeleteOpen(false);
                }}
                onSubmitLoading={isLoading}
              />
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
};

export default SparksSection;
