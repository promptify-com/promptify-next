import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import LoadingOverlay from "@/components/design-system/LoadingOverlay";
import { useRouteChangeOverlay } from "@/hooks/useRouteChangeOverlay";
import lazy from "next/dynamic";
import { theme } from "@/theme";
import ClearRounded from "@mui/icons-material/ClearRounded";

const CollectionsListLazy = lazy(() => import("./CollectionsList"));

interface props {
  onClose: () => void;
}

export default function CollectionsDesktop({ onClose }: props) {
  const { showOverlay } = useRouteChangeOverlay({
    shouldShowOverlayCallback: url => {
      return url.startsWith("/prompt/");
    },
  });

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open
      onClose={onClose}
      sx={{
        width: theme.custom.favoritesListWidth,
        "& .MuiDrawer-paper": {
          bgcolor: "surface.4",
        },
      }}
    >
      <Box
        width={theme.custom.favoritesListWidth}
        height={"100vh"}
      >
        <Typography
          sx={{
            fontSize: "16px",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            color: "onSurface",
            justifyContent: "space-between",
            fontWeight: 500,
          }}
        >
          Favorites
          <ClearRounded
            sx={{ fontSize: "26px", color: "onSurface", cursor: "pointer" }}
            onClick={onClose}
          />
        </Typography>
        <List
          className="sidebar-list"
          sx={{
            height: "100%",
            overflowY: "scroll",
            overflowX: "hidden",
            padding: "0 16px",
          }}
        >
          {showOverlay && <LoadingOverlay showOnDesktop />}
          <CollectionsListLazy
            sidebarOpen
            listItemsCount={13}
          />
        </List>
      </Box>
    </Drawer>
  );
}
