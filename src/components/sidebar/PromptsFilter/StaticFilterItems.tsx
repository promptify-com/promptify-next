import { setMyFavoritesChecked } from "@/core/store/filtersSlice";
import { isValidUserFn } from "@/core/store/userSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { AutoAwesomeMosaicOutlined, FavoriteBorderOutlined } from "@mui/icons-material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import React from "react";

function StaticFilterItems() {
  const dispatch = useAppDispatch();
  const isValidUser = useAppSelector(isValidUserFn);
  const isFavourite = useAppSelector(state => state.filters.isFavourite);

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
        sx={{
          borderRadius: "16px",
          bgcolor: "surfaceContainer",
          padding: "16px 24px",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <ListItemIcon>
          <AutoAwesomeMosaicOutlined />
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
            bgcolor: isFavourite ? "surfaceContainer" : "transparent",
          }}
          onClick={() => dispatch(setMyFavoritesChecked(!isFavourite))}
        >
          <ListItemIcon>
            <FavoriteBorderOutlined />
          </ListItemIcon>
          My favourites
        </ListItemButton>
      )}
    </List>
  );
}

export default StaticFilterItems;
