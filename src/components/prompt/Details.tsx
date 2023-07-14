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
import {
  ArrowForwardIos,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { savePathURL } from "@/common/utils";
import useToken from "@/hooks/useToken";
import {
  likeTemplate,
  removeTemplateLike,
} from "@/hooks/api/templates";
import { Subtitle } from "@/components/blocks";
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
  const token = useToken();
  const router = useRouter();
  const { palette } = useTheme();

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
    <Box sx={{ p: "16px" }}>
      <Box
        sx={{
          borderRadius: { xs: "24px 24px 0 0", md: "16px 16px 0 0" },
          overflow: "hidden",
        }}
      >
        <Box sx={{ py: "16px" }}>
          <Button
            sx={{ ...buttonStytle, borderColor: alpha(palette.primary.main, .3), flex: 1 }}
            startIcon={
              templateData.is_liked ? <Favorite /> : <FavoriteBorder />
            }
            variant={"outlined"}
            onClick={likeTemplateClicked}
          >
            {templateData.likes}
          </Button>
        </Box>
        <Box sx={{ py: "16px" }}>
          <Typography 
            sx={{ fontSize: 12, fontWeight: 400, color: "onSurface" }} 
            dangerouslySetInnerHTML={{ __html: templateData.description }} 
          />
        </Box>
        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          gap={1}
          sx={{ py: "16px" }}
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
                  "&:hover": { 
                    bgcolor: "action.hover"
                  },
                }}
              />
            ))
          ) : (
            <Typography fontSize={12} color={"onSurface"}>No tag assigned</Typography>
          )}
        </Stack>

        <Grid
          container
          direction={"column"}
          gap={3}
          sx={{
            p: { xs: "24px", md: "16px 0" },
            borderRadius: { xs: "24px 24px 0 0", md: 0 },
          }}
        >
          <Grid item>
            <Link href={"#"} style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  p: "8px",
                  bgcolor: "primary.main",
                  color: "onPrimary",
                  fontSize: { xs: 16, md: 12 },
                  fontWeight: 500,
                  borderRadius: "99px",
                  svg: { opacity: .6 },
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "onPrimary",
                    opacity: 0.95,
                    svg: { opacity: 1 }
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
                <ArrowForwardIos fontSize="small" />
              </Button>
            </Link>
          </Grid>

          <Grid item>
            <Box>
              <Subtitle sx={{ mb: "12px", color: "tertiary" }}>
                Template details
              </Subtitle>
              <Stack gap={1}>
                {templateData.last_run && (
                  <Typography sx={detailsStyle}>
                    Last run:{" "}
                    <span>{moment(templateData.last_run).fromNow()}</span>
                  </Typography>
                )}
                <Typography sx={detailsStyle}>
                  Updated:{" "}
                  <span>{moment(templateData.updated_at).format("D MMMM YYYY")}</span>
                </Typography>
                <Typography sx={detailsStyle}>
                  Created:{" "}
                  <span>{moment(templateData.created_at).format("D MMMM YYYY")}</span>
                </Typography>
                <Typography sx={detailsStyle}>
                  Views: <span>{templateData.views}</span>
                </Typography>
                <Typography sx={detailsStyle}>
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

const buttonStytle = {
  p: "6px 16px",
  bgcolor: "transparent",
  color: "primary.main",
  fontSize: 14,
  border: "1px solid",
  "&:hover": {
    bgcolor: "action.hover",
    color: "primary.main"
  }
};
const detailsStyle = {
  fontSize: 14,
  fontWeight: 400,
  color: "grey.600",
  span: {
    color: "common.black",
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};
