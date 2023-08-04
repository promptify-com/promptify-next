import { FavoriteList } from "@/assets/icons/FavoriteList";
import { ICollectionById } from "@/common/types/collection";
import { Box, Grid, List, ListSubheader, Typography } from "@mui/material";
import { CollectionItem } from "./CollectionItem";
import { ITemplate } from "@/common/types/template";
import { FetchLoading } from "@/components/FetchLoading";
import { useRouter } from "next/router";
import { CollectionsEmptyBox } from "./CollectionsEmptyBox";

interface SideBarCollectionsProps {
  sidebarOpen?: boolean;
  isValidUser: boolean | undefined;
  favCollection: ICollectionById | null;
  collectionLoading: boolean;
  userLoading?: boolean;
}

export const Collections: React.FC<SideBarCollectionsProps> = ({
  sidebarOpen,
  isValidUser,
  favCollection,
  collectionLoading,
  userLoading,
}) => {
  const router = useRouter();
  const navigateTo = (slug: string) => {
    router.push(`/prompt/${slug}`);
  };
  return (
    <Box>
      <ListSubheader
        sx={{ fontSize: "12px", display: sidebarOpen ? "block" : "none" }}
      >
        COLLECTION
      </ListSubheader>

      {userLoading ? (
        <FetchLoading />
      ) : (
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
                <Grid display={"flex"} alignItems={"center"}>
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
                  <FetchLoading />
                ) : (
                  favCollection?.prompt_templates.map((item: ITemplate) => (
                    <CollectionItem
                      key={item.id}
                      template={item}
                      expanded={sidebarOpen}
                      onClick={() => navigateTo(item.slug)}
                    />
                  ))
                )}
              </List>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
