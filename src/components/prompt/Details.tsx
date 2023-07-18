import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Templates } from "@/core/api/dto/templates";
import {
  ArrowForwardIos,
} from "@mui/icons-material";
import { savePathURL } from "@/common/utils";
import useToken from "@/hooks/useToken";
import {
  addToCollection,
  removeFromCollection
} from "@/hooks/api/templates";
import { Subtitle } from "@/components/blocks";
import moment from "moment";
import { useRouter } from "next/router";
import Link from "next/link";
import { useGetCurrentUser } from "@/hooks/api/user";
import FavoriteButton from "@/components/common/buttons/FavoriteButton";

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
  const [user, error, userIsLoading] = useGetCurrentUser([token]);
  const router = useRouter();

  const favorTemplate = async () => {
    if (!token) {
      savePathURL(window.location.pathname);
      return router.push("/signin");
    }

    if (!isFetching) {
      setIsFetching(true);

      updateTemplateData({ ...templateData, is_favorite: !templateData.is_favorite });

      try {

        if (!templateData.is_favorite) {
          await addToCollection(user.favorite_collection_id, templateData.id);
        } else {
          await removeFromCollection(user.favorite_collection_id, templateData.id);
        }
      } catch (err: any) {
        console.error(err)
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
          <FavoriteButton 
            isFavorite={templateData.is_favorite}
            onClick={favorTemplate}
          />
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
