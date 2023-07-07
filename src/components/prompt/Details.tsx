import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Templates } from "@/core/api/dto/templates";
import {
  ArrowForwardIos,
  Bookmark,
  BookmarkAddOutlined,
  BookmarkAdded,
  Favorite,
  FavoriteBorder,
  PlaylistAdd,
} from "@mui/icons-material";
import { savePathURL } from "@/common/utils";
import useToken from "@/hooks/useToken";
import {
  addToCollection,
  likeTemplate,
  removeTemplateLike,
} from "@/hooks/api/templates";
import { useCollections } from "@/hooks/api/collections";
import { Subtitle } from "@/components/blocks";
import ChatGPTIcon from "@/assets/icons/chatGPT.svg";
import moment from "moment";
import { useRouter } from "next/router";
import Link from "next/link";

interface DetailsProps {
  templateData: Templates;
  updateTemplateData: (data: Templates) => void;
}

export const Details: React.FC<DetailsProps> = ({
  templateData,
  updateTemplateData,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [collectionsAnchor, setCollectionsAnchor] =
    useState<HTMLElement | null>(null);
  const [collections] = useCollections();
  const token = useToken();
  const router = useRouter();
  const { palette } = useTheme();

  const getLanguage = (shortLang: string): string => {
    return (
      new Intl.DisplayNames(["en"], { type: "language" }).of(shortLang) || ""
    );
  };

  const chooseCollection = (collectionId: number) => {
    addToCollection(collectionId, templateData.id);
    setCollectionsAnchor(null);
  };

  const likeTemplateClicked = async () => {
    if (!token) {
      savePathURL(window.location.pathname);
      return router.push("/signin");
    }

    if (!isFetching) {
      setIsFetching(true);

      // Toggle the like button temporarily for smoother UX and permanently after processing likeTemplate() & removeTemplateLike()
      updateTemplateData({ ...templateData, is_liked: !templateData.is_liked });

      try {
        let likes = templateData.likes;

        if (!templateData.is_liked) {
          await likeTemplate(templateData.id);
          likes++;
        } else {
          await removeTemplateLike(templateData.id);
          likes > 0 && likes--;
        }

        updateTemplateData({
          ...templateData,
          is_liked: !templateData.is_liked,
          likes: likes,
        });
      } catch (err: any) {
        // API response for an already liked template
        if (err.response.data?.status === "success")
          updateTemplateData({
            ...templateData,
            is_liked: !templateData.is_liked,
          });
      } finally {
        setIsFetching(false);
      }
    }
  };

  return (
    <Box sx={{ mr: { md: "20px" } }}>
      <Box
        sx={{
          borderRadius: { xs: "24px 24px 0 0", md: "16px 16px 0 0" },
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: "16px 24px" }}>
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <Button
              sx={{
                flex: 1.5,
                p: "6px 16px",
                bgcolor: "transparent",
                color: "primary.main",
                fontSize: 14,
                border: "1px solid",
                borderColor: alpha(palette.primary.main, .3),
                "&:hover": {
                  bgcolor: "action.hover",
                  color: "primary.main"
                },
              }}
              startIcon={
                templateData.is_liked ? <BookmarkAdded /> : <BookmarkAddOutlined />
              }
              variant={"outlined"}
              onClick={likeTemplateClicked}
            >
              Save
            </Button>
            <Button
              sx={{
                flex: 3,
                p: "6px 16px",
                bgcolor: "transparent",
                color: "primary.main",
                fontSize: 14,
                border: "1px solid",
                borderColor: alpha(palette.primary.main, .3),
                "&:hover": {
                  bgcolor: "action.hover",
                  color: "primary.main"
                },
              }}
              startIcon={<PlaylistAdd />}
              variant={"outlined"}
              onClick={(e) => setCollectionsAnchor(e.currentTarget)}
            >
              Collection
            </Button>
            <Popper
              open={Boolean(collectionsAnchor)}
              anchorEl={collectionsAnchor}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom"
                        ? "center top"
                        : "center bottom",
                  }}
                >
                  <Paper
                    sx={{
                      bgcolor: "surface.1",
                      border: "1px solid #E3E3E3",
                      borderRadius: "10px",
                    }}
                    elevation={0}
                  >
                    <ClickAwayListener
                      onClickAway={() => setCollectionsAnchor(null)}
                    >
                      <MenuList
                        sx={{ paddingRight: "3rem", width: "100%" }}
                      >
                        {collections.map((collection) => (
                          <MenuItem
                            key={collection.id}
                            sx={{ borderTop: "1px solid #E3E3E3" }}
                            onClick={() => chooseCollection(collection.id)}
                          >
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                ml: "1rem",
                                color: "onSurface",
                              }}
                            >
                              {collection.name}
                            </Typography>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <Button
              sx={{
                flex: 1.5,
                p: "6px 16px",
                bgcolor: "transparent",
                color: "primary.main",
                fontSize: 14,
                border: "1px solid",
                borderColor: alpha(palette.primary.main, .3),
                "&:hover": {
                  bgcolor: "action.hover",
                  color: "primary.main"
                },
              }}
              startIcon={
                templateData.is_liked ? <Favorite /> : <FavoriteBorder />
              }
              variant={"outlined"}
              onClick={likeTemplateClicked}
            >
              {templateData.likes}
            </Button>
          </Stack>
        </Box>
        <Box sx={{ p: "16px 24px" }}>
          <Typography 
            sx={{ fontSize: 12, fontWeight: 400, color: "onSurface" }} 
            dangerouslySetInnerHTML={{ __html: templateData.description }} 
          />
        </Box>

        <Grid
          container
          direction={"column"}
          gap={3}
          sx={{
            bgcolor: "surface.1",
            p: { xs: "24px", md: "16px 0" },
            borderRadius: { xs: "24px 24px 0 0", md: 0 },
          }}
        >
          <Grid item>
            {templateData?.created_by ? (
              <Link href={"#"} style={{ textDecoration: "none" }}>
                <Button
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    p: { xs: "16px", md: "8px 8px 8px 16px" },
                    bgcolor: "primary.main",
                    color: "onPrimary",
                    fontSize: { xs: 16, md: 12 },
                    fontWeight: 500,
                    borderRadius: { xs: "24px", md: "16px" },
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "onPrimary",
                      opacity: 0.95,
                      svg: { opacity: 1 },
                    },
                  }}
                >
                  <Stack
                    flex={1}
                    direction={"row"}
                    alignItems={"center"}
                    spacing={1}
                  >
                    <Box
                      sx={{
                        bgcolor: "common.black",
                        color: "common.white",
                        borderRadius: "50%",
                        width: { xs: "48px", md: "32px" },
                        height: { xs: "48px", md: "32px" },
                        padding: "1px",
                        fontFamily: "Poppins",
                        fontStyle: "normal",
                        fontWeight: 500,
                        fontSize: { xs: 20, md: 16 },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {templateData?.created_by?.first_name &&
                      templateData?.created_by?.last_name
                        ? `${templateData?.created_by?.first_name[0]?.toUpperCase()}${templateData?.created_by?.last_name[0]?.toUpperCase()}`
                        : templateData?.created_by?.username[0]?.toUpperCase()}
                    </Box>
                    <Box>
                      by{" "}
                      {templateData?.created_by?.first_name &&
                      templateData?.created_by?.last_name ? (
                        <React.Fragment>
                          {templateData.created_by.first_name
                            .charAt(0)
                            .toUpperCase() +
                            templateData.created_by.first_name.slice(1)}{" "}
                          {templateData.created_by.last_name
                            .charAt(0)
                            .toUpperCase() +
                            templateData.created_by.last_name.slice(1)}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          {templateData.created_by.username
                            .charAt(0)
                            .toUpperCase() +
                            templateData.created_by.username.slice(1)}
                        </React.Fragment>
                      )}
                    </Box>
                  </Stack>
                  <ArrowForwardIos fontSize="small" sx={{ opacity: 0.6 }} />
                </Button>
              </Link>
            ) : (
              <Button
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  p: { xs: "16px", md: "8px 8px 8px 16px" },
                  bgcolor: "primary.main",
                  color: "onPrimary",
                  fontSize: { xs: 16, md: 12 },
                  fontWeight: 500,
                  borderRadius: { xs: "24px", md: "16px" },
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "onPrimary",
                    opacity: 0.95,
                    svg: { opacity: 1 },
                  },
                }}
              >
                <Stack
                  flex={1}
                  direction={"row"}
                  alignItems={"center"}
                  spacing={1}
                >
                  <Box
                    sx={{
                      bgcolor: "common.black",
                      color: "common.white",
                      borderRadius: "50%",
                      width: { xs: "48px", md: "32px" },
                      height: { xs: "48px", md: "32px" },
                      padding: "1px",
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontWeight: 500,
                      fontSize: { xs: 20, md: 16 },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    PU
                  </Box>
                  <Box>by Promptify User</Box>
                </Stack>
              </Button>
            )}
          </Grid>

          <Grid item>
            <Box>
              <Subtitle sx={{ mb: "12px", color: "tertiary" }}>
                SubCategory
              </Subtitle>
              <Stack spacing={1}>
                {templateData.category.parent && (
                  <Button
                    variant={"outlined"}
                    // startIcon={<ChatGPTIcon />}
                    sx={{
                      bgcolor: alpha(palette.primary.main, 0.1),
                      color: "onSurface",
                      borderRadius: "999px",
                      borderColor: "transparent",
                      svg: {
                        fill: palette.common.black,
                      },
                      "&:hover": {
                        bgcolor: "surface",
                        color: "onSurface",
                        borderColor: alpha(palette.primary.main, 0.1),
                      },
                    }}
                    onClick={() =>
                      router.push({
                        pathname: `/explorer/details`,
                        query: {
                          category: JSON.stringify(
                            templateData.category.parent
                          ),
                        },
                      })
                    }
                  >
                    {templateData.category.parent.name}
                  </Button>
                )}
                <Button
                  variant={"outlined"}
                  sx={{
                    bgcolor: alpha(palette.primary.main, 0.1),
                    color: "onSurface",
                    borderRadius: "999px",
                    borderColor: "transparent",
                    "&:hover": {
                      bgcolor: "surface",
                      color: "onSurface",
                      borderColor: alpha(palette.primary.main, 0.1),
                    },
                  }}
                  onClick={() =>
                    router.push({
                      pathname: `/explorer/details`,
                      query: {
                        category: templateData.category.parent
                          ? JSON.stringify(templateData.category.parent)
                          : JSON.stringify(templateData.category),
                        subcategory: JSON.stringify(templateData.category),
                      },
                    })
                  }
                >
                  {templateData.category.name}
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid item>
            <Box>
              <Subtitle sx={{ mb: "12px", color: "tertiary" }}>Tags</Subtitle>
              <Stack
                direction={"row"}
                flexWrap={"wrap"}
                spacing={1}
                useFlexGap
              >
                {templateData.tags.length > 0 ? (
                  templateData.tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      onClick={() =>
                        router.push({
                          pathname: `/`,
                          query: {
                            tag: JSON.stringify({
                              id: tag.id,
                              name: tag.name,
                            }),
                          },
                        })
                      }
                      variant={"filled"}
                      label={tag.name}
                      sx={{
                        fontSize: 13,
                        fontWeight: 400,
                        bgcolor: "surface.3",
                        color: "onSurface",
                      }}
                    />
                  ))
                ) : (
                  <Typography fontSize={12} color={"onSurface"}>
                    No tag assigned
                  </Typography>
                )}
              </Stack>
            </Box>
          </Grid>

          <Grid item>
            <Box>
              <Subtitle sx={{ mb: "12px", color: "tertiary" }}>
                Language
              </Subtitle>
              <Typography
                sx={{ fontSize: 14, fontWeight: 400, color: "onSurface" }}
              >
                {getLanguage(templateData.language)}
              </Typography>
            </Box>
          </Grid>

          <Grid item>
            <Box>
              <Subtitle sx={{ mb: "12px", color: "tertiary" }}>
                Template details
              </Subtitle>
              <Stack spacing={1}>
                {templateData.last_run && (
                  <Typography sx={{ ...detailsTitle }}>
                    Last run:{" "}
                    <span>{moment(templateData.last_run).fromNow()}</span>
                  </Typography>
                )}
                <Typography sx={{ ...detailsTitle }}>
                  Updated:{" "}
                  <span>
                    {moment(templateData.updated_at).format("D MMMM YYYY")}
                  </span>
                </Typography>
                <Typography sx={{ ...detailsTitle }}>
                  Created:{" "}
                  <span>
                    {moment(templateData.created_at).format("D MMMM YYYY")}
                  </span>
                </Typography>
                <Typography sx={{ ...detailsTitle }}>
                  Views: <span>{templateData.views}</span>
                </Typography>
                <Typography sx={{ ...detailsTitle }}>
                  Runs: <span>{templateData.executions_count}</span>
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const detailsTitle = {
  fontSize: 14,
  fontWeight: 400,
  color: "grey.600",
  span: {
    color: "common.black",
  },
};
