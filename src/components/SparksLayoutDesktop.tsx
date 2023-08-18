import { FC } from "react";
import DraftSpark from "@/assets/icons/DraftSpark";
import SavedSpark from "@/assets/icons/SavedSpark";
import { Execution, TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import useTruncate from "@/hooks/useTruncate";
import { ArrowDropDown, CloudQueueRounded, DeleteRounded, Edit } from "@mui/icons-material";
import { CardMedia, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import BaseButton from "./base/BaseButton";

interface SparksLayoutDesktopProps {
  execution: Execution;
  template: TemplateExecutionsDisplay;
}

export const SparksLayoutDesktop: FC<SparksLayoutDesktopProps> = ({ execution, template }) => {
  const { truncate } = useTruncate();
  const { convertedTimestamp } = useTimestampConverter();
  return (
    <Grid
      container
      display={{ xs: "none", md: "flex" }}
      bgcolor={"surface.1"}
      alignItems={"center"}
      position={"relative"}
      className="sparkContainer"
    >
      <Grid
        item
        sx={{ width: "49px" }}
        padding={"16px 8px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {execution.is_favorite ? <SavedSpark /> : <DraftSpark />}
      </Grid>
      <Grid
        item
        md={2}
        lg={3}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography
          fontSize={13}
          fontWeight={500}
          color={"onSurface"}
          lineHeight={"18.59px"}
          letterSpacing={"0.17px"}
        >
          {truncate(execution.title, { length: 40 })}
        </Typography>
        <Tooltip title="Rename">
          <IconButton
            sx={{
              border: "none",
              "&:hover": {
                bgcolor: "surface.2",
              },
            }}
          >
            <Edit
              className="cellHovered"
              sx={{ opacity: 0.25, fontSize: "16px" }}
            />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid
        item
        md={4}
        padding={"16px"}
        display={"flex"}
        gap={1}
        alignItems={"center"}
      >
        <CardMedia
          sx={{
            zIndex: 1,
            borderRadius: "8px",
            width: { xs: "41px", sm: "41px" },
            height: { xs: "73px", sm: "31px" },
            objectFit: "cover",
          }}
          component="img"
          image={template.thumbnail}
          alt={template.title}
        />
        <Typography
          fontSize={13}
          fontWeight={500}
          color={"onSurface"}
          lineHeight={"18.59px"}
          letterSpacing={"0.17px"}
        >
          {truncate(template.title, { length: 40 })}
        </Typography>
      </Grid>

      <Grid
        item
        xs={2}
        padding={{ lg: "16px" }}
        display={"flex"}
        gap={1}
        alignItems={"center"}
      >
        <Typography
          fontSize={12}
          fontWeight={400}
          color={"onSurface"}
          lineHeight={"17.16px"}
          letterSpacing={"0.17px"}
          sx={{ opacity: 0.5 }}
        >
          {convertedTimestamp(execution.created_at)}
        </Typography>
      </Grid>
      <Grid
        item
        xs={2}
        padding={{ lg: "16px" }}
        display={"flex"}
        gap={1}
        alignItems={"center"}
      >
        <BaseButton
          variant="text"
          color="primary"
          className="cellHovered"
          sx={{ opacity: 0.25 }}
        >
          Export <ArrowDropDown sx={{ ml: 1 }} />
        </BaseButton>
      </Grid>

      <Grid
        item
        xs={2}
        padding={"16px"}
        position={"absolute"}
        right={0}
        display={"flex"}
        justifyContent={"end"}
        alignItems={"center"}
      >
        {!execution.is_favorite && (
          <Tooltip title="Save">
            <IconButton
              sx={{
                border: "none",
                "&:hover": {
                  bgcolor: "surface.2",
                },
              }}
            >
              <CloudQueueRounded
                className="cellHovered"
                sx={{ opacity: 0.25, fontSize: "18px" }}
              />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Delete">
          <IconButton
            sx={{
              border: "none",
              "&:hover": {
                bgcolor: "surface.2",
              },
            }}
          >
            <DeleteRounded
              className="cellHovered"
              sx={{ opacity: 0.25, fontSize: "16px" }}
            />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};
