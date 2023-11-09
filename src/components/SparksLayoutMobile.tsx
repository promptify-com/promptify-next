import { FC, useState } from "react";
import {
  Box,
  CardMedia,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Cloud, Delete, Edit, MoreVert } from "@mui/icons-material";
import DraftSpark from "@/assets/icons/DraftSpark";
import SavedSpark from "@/assets/icons/SavedSpark";
import useTimestampConverter from "@/hooks/useTimestampConverter";
import useTruncate from "@/hooks/useTruncate";
import { SparksLayoutProps } from "@/core/api/dto/templates";
import ShareIcon from "@/assets/icons/ShareIcon";
import { redirectToPath } from "@/common/helpers";

export const SparksLayoutMobile: FC<SparksLayoutProps> = ({
  execution,
  template,
  onExecutionSaved,
  onOpenDelete,
  onOpenEdit,
  onOpenExport,
}) => {
  const { truncate } = useTruncate();
  const { convertedTimestamp } = useTimestampConverter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToTemplate = () => {
    redirectToPath(`/prompt/${template.slug}`, { spark: execution.id });
  };

  return (
    <Grid
      my={"10px"}
      container
      display={{ xs: "flex", md: "none" }}
      gap={"16px"}
      bgcolor={"surface.1"}
      justifyContent={"space-between"}
      sx={{
        cursor: "pointer",
      }}
    >
      <Grid
        onClick={navigateToTemplate}
        item
        display={"flex"}
        gap={1}
        alignItems={"center"}
        position={"relative"}
        overflow={"hidden"}
      >
        <CardMedia
          sx={{
            zIndex: 1,
            borderRadius: "16px",
            width: "90px",
            height: "68px",
            objectFit: "cover",
          }}
          component="img"
          image={template.thumbnail}
          alt={template.title}
        />
        <Box
          position={"absolute"}
          bottom={"-0.5px"}
          left={"-0.5px"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"24px"}
          padding={"8px"}
          borderRadius={"16px"}
          height={"24px"}
          bgcolor={"surface.1"}
          sx={{
            zIndex: 3,
          }}
        >
          {execution.is_favorite ? <SavedSpark size="24" /> : <DraftSpark size="24" />}
        </Box>
      </Grid>
      <Grid
        onClick={navigateToTemplate}
        item
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        gap={"4px"}
      >
        <Typography
          fontSize={16}
          fontWeight={500}
          color={"onSurface"}
          lineHeight={"22.88px"}
          letterSpacing={"0.17px"}
        >
          {truncate(execution.title, { length: 40 })}
        </Typography>
        <Typography
          fontSize={12}
          fontWeight={500}
          color={"onSurface"}
          lineHeight={"16.8px"}
          letterSpacing={"0.15px"}
        >
          {truncate(template.title, { length: 40 })}
        </Typography>
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
        position={"absolute"}
        right={1}
      >
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            border: "none",
            "&:hover": {
              bgcolor: "surface.2",
            },
          }}
        >
          <MoreVert sx={{ fontSize: "16px" }} />
        </IconButton>
      </Grid>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            onOpenEdit();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Edit sx={{ fontSize: "18px" }} />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>

        {!execution.is_favorite && (
          <MenuItem
            onClick={() => {
              onExecutionSaved();
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <Cloud sx={{ fontSize: "18px" }} />
            </ListItemIcon>
            <ListItemText>Save</ListItemText>
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            onOpenDelete();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Delete sx={{ fontSize: "18px" }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onOpenExport();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <ShareIcon />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
      </Menu>
    </Grid>
  );
};
