import { FC } from "react";
import { SparksLayoutProps } from "@/core/api/dto/templates";
import { CloudQueueRounded, DeleteRounded, Edit, GetAppRounded } from "@mui/icons-material";
import { CardMedia, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import useTruncate from "@/hooks/useTruncate";
import DraftSpark from "@/assets/icons/DraftSpark";
import SavedSpark from "@/assets/icons/SavedSpark";
import { useRouter } from "next/router";
import ShareIcon from "@/assets/icons/ShareIcon";
import { redirectToPath } from "@/common/helpers";

export const SparksLayoutDesktop: FC<SparksLayoutProps> = ({
  execution,
  template,
  onExecutionSaved,
  onOpenEdit,
  onOpenDelete,
  onOpenExport,
}) => {
  const router = useRouter();
  const { truncate } = useTruncate();
  const { convertedTimestamp } = useTimestampConverter();

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onOpenEdit();
  };

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
        onClick={() => {
          redirectToPath(`/prompt/${template.slug}`, { spark: `${execution.id}` });
        }}
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
            onClick={handleEditClick}
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
        onClick={() => {
          redirectToPath(`prompt/${template.slug}`);
        }}
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
      ></Grid>

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
              onClick={() => onExecutionSaved()}
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
            onClick={onOpenDelete}
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
        <Tooltip title="Export / Share">
          <IconButton
            onClick={onOpenExport}
            sx={{
              border: "none",
              "&:hover": {
                bgcolor: "surface.2",
              },
            }}
          >
            <ShareIcon
              className="cellHovered"
              opacity={0.2}
            />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};
