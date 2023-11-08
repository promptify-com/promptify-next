import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import { FavoriteList } from "@/assets/icons/FavoriteList";
import { CollectionsEmptyBox } from "./CollectionsEmptyBox";
import LoadingOverlay from "@/components/design-system/LoadingOverlay";
import { useRouteChangeOverlay } from "@/hooks/useRouteChangeOverlay";
import { isDesktopViewPort } from "@/common/helpers";
import { useAppSelector } from "@/hooks/useStore";
import { isValidUserFn } from "@/core/store/userSlice";
import lazy from "next/dynamic";

const CollectionsListLazy = lazy(() => import("./CollectionsList"));

interface SideBarCollectionsProps {
  sidebarOpen?: boolean;
}

export const Collections: React.FC<SideBarCollectionsProps> = ({ sidebarOpen }) => {
  const { showOverlay } = useRouteChangeOverlay({
    shouldShowOverlayCallback: url => {
      return url.startsWith("/prompt/");
    },
  });
  const isValidUser = useAppSelector(isValidUserFn);
  const isDesktopView = isDesktopViewPort();

  return (
    <Box>
      <ListSubheader sx={{ fontSize: "12px", display: sidebarOpen ? "block" : "none" }}>COLLECTION</ListSubheader>

      <Box>
        {!isValidUser ? (
          <CollectionsEmptyBox onExpand={sidebarOpen} />
        ) : (
          <Box>
            <Grid
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              sx={{
                mt: sidebarOpen ? 0 : 1,
                mx: "5px",
                pl: 3,
              }}
            >
              <Grid
                display={"flex"}
                alignItems={"center"}
              >
                <FavoriteList />
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    lineHeight: "22.4px",
                    display: sidebarOpen ? "block" : "none",
                  }}
                >
                  My Favorites
                </Typography>
              </Grid>
            </Grid>
            <List
              className="sidebar-list"
              sx={{
                height: "300px",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
            >
              {isDesktopView && showOverlay && <LoadingOverlay showOnDesktop />}
              <CollectionsListLazy sidebarOpen={sidebarOpen} />
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};
