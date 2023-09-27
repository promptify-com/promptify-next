import { useRouter } from "next/router";
import { Box, Grid, List, ListSubheader, Typography } from "@mui/material";

import { FavoriteList } from "@/assets/icons/FavoriteList";
import { ICollectionById } from "@/common/types/collection";
import { CollectionItem } from "./CollectionItem";
import { ITemplate } from "@/common/types/template";
import { CollectionsEmptyBox } from "./CollectionsEmptyBox";
import ListItemPlaceholder from "@/components/placeholders/ListItemPlaceholder";
import LoadingOverlay from "@/components/design-system/LoadingOverlay";
import { useRouteChangeOverlay } from "@/hooks/useRouteChangeOverlay";
import { determineIsMobile } from "@/common/helpers/determineIsMobile";

interface SideBarCollectionsProps {
  sidebarOpen?: boolean;
  isValidUser: boolean | undefined;
  favCollection: ICollectionById | null;
  collectionLoading: boolean;
  isExplorePage?: boolean;
  isFilterShowing?: boolean;
}

export const Collections: React.FC<SideBarCollectionsProps> = ({
  sidebarOpen,
  isValidUser,
  favCollection,
  collectionLoading,

  isExplorePage,
  isFilterShowing,
}) => {
  const router = useRouter();

  const { showOverlay } = useRouteChangeOverlay({
    shouldShowOverlayCallback: url => {
      return url.startsWith("/prompt/");
    },
  });
  const IS_MOBILE = determineIsMobile();
  return (
    <Box>
      <ListSubheader sx={{ fontSize: "12px", display: sidebarOpen ? "block" : "none" }}>COLLECTION</ListSubheader>

      <Box>
        {!isValidUser ? (
          <CollectionsEmptyBox onExpand={sidebarOpen} />
        ) : (
          <Box sx={{ height: isExplorePage && isFilterShowing ? "50vh" : "auto" }}>
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
                  {!IS_MOBILE && showOverlay && <LoadingOverlay showOnDesktop />}

                  {favCollection?.prompt_templates.map((item: ITemplate) => (
                    <CollectionItem
                      key={item.id}
                      template={item}
                      expanded={sidebarOpen}
                      onClick={() => {
                        router.push(`/prompt/${item.slug}`);
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
