import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
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
import { Subtitle } from "@/components/blocks";
import moment from "moment";
import { useRouter } from "next/router";
import { useGetCurrentUser } from "@/hooks/api/user";
import FavoriteButton from "@/components/common/buttons/FavoriteButton";
import {
  useAddToCollectionMutation,
  useRemoveFromCollectionMutation
} from '@/core/api/prompts';

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
  const [user] = useGetCurrentUser([token]);
  const router = useRouter();
  const [addToCollection] = useAddToCollectionMutation();
  const [removeFromCollection] = useRemoveFromCollectionMutation();

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
          await addToCollection({
            collectionId: user.favorite_collection_id,
            templateId: templateData.id
          });
        } else {
          await removeFromCollection({
            collectionId: user.favorite_collection_id,
            templateId: templateData.id,
          });
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
      <Box>
        <Box sx={{ py: { md: "16px" } }}>
          <FavoriteButton 
            isFavorite={templateData.is_favorite}
            onClick={favorTemplate}
          />
        </Box>
        <Divider sx={{
            display: { md: "none" },
            my: "16px",
            borderColor: "surface.3",
          }}  
        />
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
          sx={{ py: "16px" }}
        >
          <Grid item>
            <Button
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                p: "8px",
                bgcolor: "primary.main",
                color: "onPrimary",
                fontSize: 12,
                fontWeight: 500,
                borderRadius: "99px",
                svg: { opacity: .6 },
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "onPrimary",
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
                    width: 32,
                    height: 32,
                    fontSize: 16,
                    padding: "1px",
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
                    <>
                      {templateData.created_by.first_name
                        .charAt(0)
                        .toUpperCase() +
                        templateData.created_by.first_name.slice(1)}{" "}
                      {templateData.created_by.last_name
                        .charAt(0)
                        .toUpperCase() +
                        templateData.created_by.last_name.slice(1)}
                    </>
                  ) : (
                    <>
                      {templateData.created_by.username
                        .charAt(0)
                        .toUpperCase() +
                        templateData.created_by.username.slice(1)}
                    </>
                  )}
                </Box>
              </Stack>
              <ArrowForwardIos fontSize="small" />
            </Button>
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
