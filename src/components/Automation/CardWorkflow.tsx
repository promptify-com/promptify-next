import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import Link from "next/link";
import Image from "@/components/design-system/Image";
import useTruncate from "@/hooks/useTruncate";
import { theme } from "@/theme";
import { getNodeNames } from "@/components/Automation/helpers";
import type { IWorkflow } from "@/components/Automation/types";
import { useEffect, useState } from "react";

type CardWorkflowProps = {
  workflow: IWorkflow;
};

function CardWorkflow({ workflow }: CardWorkflowProps) {
  const { truncate } = useTruncate();
  const [nodes, setNodes] = useState<string[]>([]);

  useEffect(() => {
    const loadNodes = async () => {
      const _nodes = await getNodeNames(workflow.data.nodes ?? []);

      if (!_nodes.length) {
        return;
      }

      setNodes(_nodes);
    };

    loadNodes();
  }, []);

  return (
    <Link
      href={`/automation/${workflow.id}`}
      style={{ textDecoration: "none" }}
    >
      <Card
        sx={{
          borderRadius: "16px",
          p: "8px",
          bgcolor: "surface.2",
          cursor: "pointer",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
        elevation={0}
      >
        <Grid
          display={"flex"}
          flexDirection={{ xs: "column", md: "row" }}
          alignItems={{ xs: "start", md: "center" }}
          justifyContent={"space-between"}
        >
          <Grid
            display={"flex"}
            flexDirection={"row"}
            width={{ xs: "100%", md: "auto" }}
            justifyContent={"space-between"}
            gap={{ xs: "16px", md: 0 }}
            alignItems={"center"}
          >
            <Grid
              display={"flex"}
              alignItems={"center"}
              gap={"16px"}
            >
              <Grid>
                <CardMedia
                  sx={{
                    zIndex: 1,
                    borderRadius: "16px",
                    width: { xs: "98px", sm: "72px" },
                    height: { xs: "73px", sm: "54px" },
                  }}
                >
                  <Image
                    src={workflow.image ?? require("@/assets/images/default-thumbnail.jpg")}
                    alt={workflow.name}
                    style={{ borderRadius: "16%", objectFit: "cover", width: "100%", height: "100%" }}
                  />
                </CardMedia>
              </Grid>
              <Grid
                gap={0.5}
                display={"flex"}
                flexDirection={"column"}
              >
                <Typography
                  fontSize={14}
                  fontWeight={500}
                >
                  {workflow.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: "16.8px",
                    letterSpacing: "0.15px",
                    color: "onSurface",
                  }}
                >
                  {truncate(workflow.description || "", { length: 70 })}
                </Typography>
              </Grid>
            </Grid>
            <Box display={{ md: "none" }}>
              <Image
                src={workflow?.created_by?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                alt={workflow?.created_by?.first_name?.slice(0, 1) ?? "P"}
                width={32}
                height={32}
                style={{
                  backgroundColor: theme.palette.surface[5],
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Grid>
          <Stack
            direction={"row"}
            alignItems={{ xs: "end", md: "center" }}
            width={{ xs: "100%", md: "auto" }}
            marginTop={{ xs: "10px", md: "0px" }}
            justifyContent={"space-between"}
            gap={3}
          >
            <Grid
              sx={{
                display: "flex",
                gap: "4px",
              }}
            >
              {nodes.map(node => (
                <Chip
                  key={node}
                  clickable
                  size="small"
                  label={node}
                  sx={{
                    fontSize: { xs: 11, md: 13 },
                    fontWeight: 400,
                    bgcolor: "surface.5",
                    color: "onSurface",
                    textTransform: "capitalize",
                  }}
                />
              ))}
            </Grid>
            <Grid
              sx={{
                display: "flex",
                gap: "0.4em",
              }}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={0.5}
                sx={{
                  display: "flex",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "onSurface",
                }}
              >
                <ArrowBackIosRoundedIcon sx={{ fontSize: 14 }} />
                {0}
              </Stack>
            </Grid>
            <Box display={{ xs: "none", md: "flex" }}>
              <Image
                src={workflow.created_by.avatar ?? require("@/assets/images/default-avatar.jpg")}
                alt={workflow.created_by.first_name?.slice(0, 1) ?? "P"}
                width={32}
                height={32}
                style={{
                  backgroundColor: theme.palette.surface[5],
                  borderRadius: "50%",
                }}
              />
            </Box>
          </Stack>
        </Grid>
      </Card>
    </Link>
  );
}

export default CardWorkflow;
