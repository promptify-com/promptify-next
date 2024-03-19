import useTimestampConverter from "@/hooks/useTimestampConverter";
import Card from "@mui/material/Card";
import { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import CloudOutlined from "@mui/icons-material/CloudOutlined";
import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined";
import MoreVert from "@mui/icons-material/MoreVert";
import { SparkExportPopup } from "@/components/dialog/SparkExportPopup";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "@/core/api/executions";
import { CloudOffOutlined } from "@mui/icons-material";
import { SparkSaveDeletePopup } from "@/components/dialog/SparkSaveDeletePopup";

interface Props {
  execution: ExecutionWithTemplate;
}

export default function CardDocument({ execution }: Props) {
  const { convertedTimestamp } = useTimestampConverter();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [exportPopup, setExportPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [isFavorite, setIsFavorite] = useState(execution.is_favorite);

  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

  const saveExecution = async () => {
    const status = isFavorite;
    setIsFavorite(!isFavorite);
    try {
      if (status) {
        await deleteExecutionFavorite(execution.id);
      } else {
        await favoriteExecution(execution.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const actionsOpened = Boolean(menuAnchor);

  return (
    <Card
      key={execution.id}
      component={Link}
      href={`/prompt/${execution.template.slug}?hash=${execution.hash}`}
      elevation={0}
      sx={{
        position: "relative",
        width: "368px",
        height: "315px",
        flexGrow: 1,
        p: "8px",
        borderRadius: "16px",
        textDecoration: "none",
        bgcolor: "surfaceContainerLowest",
        transition: "background-color 0.3s ease",
        ".actions-btn": {
          opacity: actionsOpened ? 1 : 0,
        },
        ":hover": {
          bgcolor: "surfaceContainerLow",
          ".actions-btn": {
            opacity: 1,
          },
        },
      }}
    >
      <Box
        sx={{
          p: "16px",
          borderRadius: "16px",
          bgcolor: "surfaceContainer",
        }}
      >
        <Stack
          alignItems={"flex-start"}
          gap={2}
          sx={{
            height: "150px",
            width: "calc(85% - 64px)",
            m: "auto",
            overflow: "hidden",
            bgcolor: "surfaceContainerLowest",
            p: "32px 32px 24px 32px",
            borderRadius: "4px",
          }}
        >
          <Typography
            fontSize={16}
            fontWeight={400}
            color={"onSurface"}
          >
            {execution.title}
          </Typography>
          <Typography
            fontSize={10}
            fontWeight={300}
            color={"onSurface"}
          >
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iusto iste exercitationem impedit, fugiat atque at
            blanditiis mollitia placeat eius expedita rem consequatur officiis itaque. Ducimus odit culpa porro vero,
            error excepturi dolores est aliquam sapiente minus voluptatibus natus dolorem amet eos! Id nulla, nesciunt
            consequatur adipisci deleniti numquam neque quasi.
          </Typography>
        </Stack>
      </Box>
      <Box p={"8px"}>
        <Typography
          fontSize={16}
          fontWeight={500}
          color={"onSurface"}
          sx={oneLineStyle}
        >
          {execution.title}
        </Typography>
        <Typography
          fontSize={14}
          fontWeight={400}
          color={"secondary.light"}
          sx={oneLineStyle}
        >
          {execution.template.title}
        </Typography>
        <Typography
          fontSize={12}
          fontWeight={400}
          color={"secondary.light"}
          sx={oneLineStyle}
        >
          {convertedTimestamp(execution.created_at)}
        </Typography>
      </Box>
      <IconButton
        onClick={e => {
          e.preventDefault();
          setMenuAnchor(e.currentTarget);
        }}
        className="actions-btn"
        sx={{
          position: "absolute",
          top: 16,
          right: 12,
          zIndex: 999,
          border: "none",
          transition: "opacity 0.3s ease",
          "&:hover": {
            bgcolor: "surface.2",
          },
        }}
      >
        <MoreVert sx={{ fontSize: "24px" }} />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={actionsOpened}
        onClose={() => setMenuAnchor(null)}
        onClick={e => e.preventDefault()}
        disableScrollLock
        sx={{
          ".MuiPaper-root": {
            width: "199px",
            borderRadius: "16px",
          },
          ".MuiList-root": {
            p: 0,
          },
        }}
      >
        <MenuItem
          onClick={e => setExportPopup(true)}
          sx={menuItemStyle}
        >
          <ShareOutlined /> Export
        </MenuItem>
        <MenuItem
          onClick={saveExecution}
          sx={menuItemStyle}
        >
          {isFavorite ? (
            <>
              <CloudOffOutlined /> Save as draft
            </>
          ) : (
            <>
              <CloudOutlined /> Save as document
            </>
          )}
        </MenuItem>
        <MenuItem
          onClick={e => setDeletePopup(true)}
          sx={menuItemStyle}
        >
          <DeleteForeverOutlined /> Delete
        </MenuItem>
        {exportPopup && (
          <SparkExportPopup
            onClose={() => setExportPopup(false)}
            activeExecution={execution}
          />
        )}
        {deletePopup && (
          <SparkSaveDeletePopup
            type={"delete"}
            activeExecution={execution}
            onClose={() => setDeletePopup(false)}
          />
        )}
      </Menu>
    </Card>
  );
}

const oneLineStyle = {
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
};
const menuItemStyle = {
  gap: 2,
  p: "8px 8px 8px 16px",
  fontSize: 14,
  fontWeight: 400,
  svg: {
    fontSize: 20,
  },
};
