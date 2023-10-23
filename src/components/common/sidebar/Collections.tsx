import { Box, Grid, List, ListSubheader, Typography } from "@mui/material";
import { FavoriteList } from "@/assets/icons/FavoriteList";
import { ICollectionById } from "@/common/types/collection";
import { CollectionItem } from "./CollectionItem";
import { ITemplate } from "@/common/types/template";
import { CollectionsEmptyBox } from "./CollectionsEmptyBox";
import ListItemPlaceholder from "@/components/placeholders/ListItemPlaceholder";
import LoadingOverlay from "@/components/design-system/LoadingOverlay";
import { useRouteChangeOverlay } from "@/hooks/useRouteChangeOverlay";
import { isDesktopViewPort } from "@/common/helpers";
import { redirectToPath } from "@/common/helpers";

interface SideBarCollectionsProps {
  sidebarOpen?: boolean;
  isValidUser: boolean | undefined;
  favCollection: ICollectionById | null;
  collectionLoading: boolean;
}

export const Collections: React.FC<SideBarCollectionsProps> = ({
  sidebarOpen,
  isValidUser,
  favCollection,
  collectionLoading,
}) => {
  const { showOverlay } = useRouteChangeOverlay({
    shouldShowOverlayCallback: url => {
      return url.startsWith("/prompt/");
    },
  });
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
              {collectionLoading ? (
                <ListItemPlaceholder />
              ) : (
                <>
                  {isDesktopView && showOverlay && <LoadingOverlay showOnDesktop />}

                  {favCollection?.prompt_templates.map((item: ITemplate) => (
                    <CollectionItem
                      key={item.id}
                      template={item}
                      expanded={sidebarOpen}
                      onClick={() => {
                        redirectToPath(`/prompt/${item.slug}`);
                      }}
                    />
                  ))}
                </>
              )}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};
