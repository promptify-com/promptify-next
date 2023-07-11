import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Templates } from "@/core/api/dto/templates";
import { ArrowForwardIos, Favorite, FavoriteBorder } from "@mui/icons-material";
import { savePathURL } from "@/common/utils";
import useToken from "@/hooks/useToken";

import { likeTemplate, removeTemplateLike } from "@/hooks/api/templates";
import { Subtitle } from "@/components/blocks";
import moment from "moment";
import { useRouter } from "next/router";
import Link from "next/link";

interface DetailsProps {
  templateData: any;
  updateTemplateData: (data: Templates) => void;
  template: Templates;
  setTemplate: (template: Templates) => void;
}

export const Details = ({
  template,
  setTemplate,
  templateData,
  updateTemplateData,
}: DetailsProps) => {
  const [isFetching, setIsFetching] = useState(false);

  const token = useToken();
  const router = useRouter();
  const { palette } = useTheme();

  const getLanguage = (shortLang: string): string => {
    return (
      new Intl.DisplayNames(["en"], { type: "language" }).of(shortLang) || ""
    );
  };

  const likeTemplateClicked = async () => {
    if (!token) {
      savePathURL(window.location.pathname);
      return router.push("/signin");
    }

    if (!isFetching) {
      setIsFetching(true);

      // Toggle the like button temporarily for smoother UX and permanently after processing likeTemplate() & removeTemplateLike()
      updateTemplateData({ ...template, is_liked: !template.is_liked });

      try {
        let likes = template.likes;

        if (!template.is_liked) {
          await likeTemplate(template.id);
          likes++;
        } else {
          await removeTemplateLike(template.id);
          likes > 0 && likes--;
        }

        updateTemplateData({
          ...template,
          is_liked: !template.is_liked,
          likes: likes,
        });
      } catch (err: any) {
        // API response for an already liked template
        if (err.response.data?.status === "success")
          updateTemplateData({ ...template, is_liked: !template.is_liked });
      } finally {
        setIsFetching(false);
      }
    }
  };

  return (
    <Box sx={{ mr: { md: "20px" } }}>
      <Box
        sx={{
          backgroundImage: {
            xs: `url(${template.thumbnail || "http://placehold.it/240x150"})`,
            md: "none",
          },
          backgroundSize: "cover",
          borderRadius: { xs: "24px 24px 0 0", md: "16px 16px 0 0" },
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backdropFilter: "blur(32px)",
          }}
        >
          <Box
            sx={{
              backgroundImage: {
                md: `url(${
                  template.thumbnail || "http://placehold.it/240x150"
                })`,
              },
              backgroundSize: "cover",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "286px",
                backgroundImage: `url(${
                  template.thumbnail || "http://placehold.it/240x150"
                })`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                position: "relative",
                borderRadius: { xs: "24px", md: "0" },
              }}
            >
              <Button
                startIcon={
                  template.is_liked ? <Favorite /> : <FavoriteBorder />
                }
                variant={"contained"}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  position: "absolute",
                  right: "8px",
                  top: "8px",
                  p: "2px 13px",
                  fontSize: 14,
                  fontWeight: "500",
                  bgcolor: "surface.1",
                  color: "onSurface",
                  border: "none",
                  borderRadius: "999px",
                  opacity: 0.9,
                  "&:hover": {
                    opacity: 1,
                    bgcolor: "surface.1",
                    color: "onSurface",
                  },
                  "& .MuiButton-startIcon": { color: "primary.main" },
                }}
                onClick={likeTemplateClicked}
              >
                {template.likes}
              </Button>
            </Box>
            <Box
              sx={{
                backdropFilter: { md: "blur(32px)" },
                color: "onPrimary",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: "30px",
                  pt: "15px",
                }}
              >
                <Box sx={{ fontSize: { xs: 22, md: 16 }, fontWeight: 600 }}>
                  {template.title}
                </Box>
                <Box sx={{ width: "75px" }}>
                  <Button
                    sx={{
                      display: { md: "none" },

                      flex: 1.5,
                      bgcolor: `${alpha(palette.surface[1], 0.3)}`,
                      color: "onPrimary",
                      fontSize: 14,
                      border: "none",
                      "&:hover": {
                        bgcolor: `${alpha(palette.surface[1], 0.3)}`,
                        color: "onPrimary",
                        border: "none",
                      },
                    }}
                    startIcon={
                      template.is_liked ? <Favorite /> : <FavoriteBorder />
                    }
                    variant={"outlined"}
                    onClick={likeTemplateClicked}
                  >
                    {template.likes}
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  fontSize: { xs: 14, md: 14 },
                  fontWeight: 500,
                  mt: "20px",
                  mb: "15px",
                  paddingX: "30px",
                }}
              >
                COLLECTION:
              </Box>

              {templateData?.prompt_templates?.map(
                (promptTemplate: Templates, id: number) => {
                  return (
                    <Box
                      key={id}
                      sx={{
                        fontSize: { xs: 16, md: 14 },
                        fontWeight: 400,
                        paddingY: "10px",
                        paddingX: "30px",
                        bgcolor:
                          promptTemplate.id === template.id
                            ? alpha(palette.surface[5], 0.3)
                            : "transparent",
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => {
                        setTemplate(promptTemplate);
                      }}
                    >{`${id + 1}. ${promptTemplate.title}`}</Box>
                  );
                }
              )}
            </Box>
          </Box>
          <Grid
            container
            direction={"column"}
            gap={3}
            sx={{
              bgcolor: "surface.1",
              p: { xs: "24px", md: "16px 0" },
              borderRadius: { xs: "24px 24px 0 0", md: 0 },
              mt: "25px",
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
                  {template.category.parent && (
                    <Button
                      variant={"outlined"}
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
                            category: JSON.stringify(template.category.parent),
                          },
                        })
                      }
                    >
                      {template.category.parent.name}
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
                          category: template.category.parent
                            ? JSON.stringify(template.category.parent)
                            : JSON.stringify(template.category),
                          subcategory: JSON.stringify(template.category),
                        },
                      })
                    }
                  >
                    {template.category.name}
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
                  {template.tags.length > 0 ? (
                    template.tags.map((tag: any) => (
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
                  {getLanguage(template.language)}
                </Typography>
              </Box>
            </Grid>

            <Grid item>
              <Box>
                <Subtitle sx={{ mb: "12px", color: "tertiary" }}>
                  Template details
                </Subtitle>
                <Stack spacing={1}>
                  {template.last_run && (
                    <Typography sx={{ ...detailsTitle }}>
                      Last run:{" "}
                      <span>{moment(template.last_run).fromNow()}</span>
                    </Typography>
                  )}
                  <Typography sx={{ ...detailsTitle }}>
                    Updated:{" "}
                    <span>
                      {moment(template.updated_at).format("D MMMM YYYY")}
                    </span>
                  </Typography>
                  <Typography sx={{ ...detailsTitle }}>
                    Created:{" "}
                    <span>
                      {moment(template.created_at).format("D MMMM YYYY")}
                    </span>
                  </Typography>
                  <Typography sx={{ ...detailsTitle }}>
                    Views: <span>{template.views}</span>
                  </Typography>
                  <Typography sx={{ ...detailsTitle }}>
                    Runs: <span>{template.executions_count}</span>
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
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
