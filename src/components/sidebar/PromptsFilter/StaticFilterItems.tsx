import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";
import { isValidUserFn } from "@/core/store/userSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Browse from "@/components/sidebar/PromptsFilter/Icons/Browse";
import usePromptsFilter from "@/components/explorer/Hooks/usePromptsFilter";

function StaticFilterItems() {
  const dispatch = useAppDispatch();
  const isValidUser = useAppSelector(isValidUserFn);
  const { filters, handleCheckIsFavorite } = usePromptsFilter();

  const isFavorite = filters.isFavorite;

  return (
    <List
      disablePadding
      sx={{
        mb: "20px",
        mt: "20px",
        mx: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <ListItemButton
        onClick={() => handleCheckIsFavorite(false)}
        sx={{
          borderRadius: "16px",
          bgcolor: !isFavorite ? "surfaceContainerHighest" : "transparent",
          padding: "16px 24px",
          flexDirection: "row",
          alignItems: "center",
          fontSize: "14px",
          lineHeight: "16.8px",
          letterSpacing: "0.17px",
          fontWeight: 500,
        }}
      >
        <ListItemIcon sx={{ mr: -1.5 }}>
          <Browse />
        </ListItemIcon>
        Browse
      </ListItemButton>
      {isValidUser && (
        <ListItemButton
          sx={{
            borderRadius: "16px",
            padding: "16px 24px",
            flexDirection: "row",
            alignItems: "center",
            bgcolor: isFavorite ? "surfaceContainerHighest" : "transparent",
            fontSize: "14px",
            lineHeight: "16.8px",
            letterSpacing: "0.17px",
            fontWeight: 500,
          }}
          onClick={() => handleCheckIsFavorite(!isFavorite)}
        >
          <ListItemIcon sx={{ mr: -1.5 }}>
            <FavoriteBorderOutlined />
          </ListItemIcon>
          My favourites
        </ListItemButton>
      )}
    </List>
  );
}

export default StaticFilterItems;
