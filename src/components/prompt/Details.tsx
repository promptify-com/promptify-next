import React, { useState } from "react";
import { Box, Button, Chip, Divider, Stack, Typography, alpha, useTheme } from "@mui/material";
import { Templates } from "@/core/api/dto/templates";
import { savePathURL } from "@/common/utils";
import useToken from "@/hooks/useToken";
import { Subtitle } from "@/components/blocks";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import FavoriteButton from "@/components/common/buttons/FavoriteButton";
import { useAddToCollectionMutation, useRemoveFromCollectionMutation } from "@/core/api/collections";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FavoriteMobileButton from "@/components/common/buttons/FavoriteMobileButton";
import { RootState } from "@/core/store";

interface DetailsProps {
  templateData: Templates;
  updateTemplateData: (data: Templates) => void;
  setMobileTab?: (value: number) => void;
  setActiveTab?: (value: number) => void;
  mobile?: boolean;
}

export const Details: React.FC<DetailsProps> = ({
  templateData,
  updateTemplateData,
  setMobileTab,
  setActiveTab,
  mobile,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const token = useToken();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const router = useRouter();
  const [addToCollection] = useAddToCollectionMutation();
  const [removeFromCollection] = useRemoveFromCollectionMutation();
  const { palette } = useTheme();

  const favorTemplate = async () => {
    if (!token) {
      savePathURL(window.location.pathname);
      return router.push("/signin");
    }

    if (!isFetching) {
      setIsFetching(true);

      updateTemplateData({
        ...templateData,
        is_favorite: !templateData.is_favorite,
      });

      try {
        if (!currentUser?.favorite_collection_id) {
          throw new Error("user's 'favorite_collection_id' field does not exist!");
        }

        if (!templateData.is_favorite) {
          await addToCollection({
            collectionId: currentUser.favorite_collection_id,
            templateId: templateData.id,
          });
        } else {
          await removeFromCollection({
            collectionId: currentUser.favorite_collection_id,
            templateId: templateData.id,
          });
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    }
  };

  return (
    <Box sx={{ bgcolor: "surface.1", p: "16px" }}>
      <Box>
        <Stack
          direction={"row"}
          sx={{ pb: { xs: "16px", md: 0 } }}
        >
          {mobile && (
            <>
              <FavoriteMobileButton
                isFavorite={templateData.is_favorite}
                onClick={favorTemplate}
                likes={templateData.favorites_count}
              />
              <Button
                variant="outlined"
                endIcon={<ExitToAppIcon />}
                onClick={() => {
                  if (setMobileTab && setActiveTab) {
                    setMobileTab(1);
                    setActiveTab(1);
                  }
                }}
                sx={{
                  p: "8px 16px",
                  bgcolor: palette.primary.main,
                  color: "onPrimary",
                  fontSize: 14,
                  borderColor: alpha(palette.primary.main, 0.3),
                  "&:hover": {
                    bgcolor: "action.hover",
                    color: palette.primary.main,
                    borderColor: alpha(palette.primary.main, 0.8),
                  },
                  ml: "10px",
                }}
              >
                Create Now!
              </Button>
            </>
          )}
        </Stack>
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
          sx={{ pb: "25px" }}
        >
          {templateData.tags.length > 0 ? (
            templateData.tags.map(tag => (
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
                    bgcolor: "action.hover",
                  },
                }}
              />
            ))
          ) : (
            <Typography
              fontSize={12}
              color={"onSurface"}
            >
              No tag assigned
            </Typography>
          )}
        </Stack>
        <Box>
          <Subtitle sx={{ mb: "12px", color: "tertiary" }}>Metrics Overview</Subtitle>
          <Stack gap={1}>
            {templateData.last_run && (
              <Typography sx={detailsStyle}>
                Last run: <span>{moment(templateData.last_run).fromNow()}</span>
              </Typography>
            )}
            <Typography sx={detailsStyle}>
              Updated: <span>{moment(templateData.updated_at).format("D MMMM YYYY")}</span>
            </Typography>
            <Typography sx={detailsStyle}>
              Created: <span>{moment(templateData.created_at).format("D MMMM YYYY")}</span>
            </Typography>
            <Typography sx={detailsStyle}>
              Views: <span>{templateData.views}</span>
            </Typography>
            <Typography sx={detailsStyle}>
              Runs: <span>{templateData.executions_count}</span>
            </Typography>
          </Stack>
        </Box>
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
  justifyContent: "space-between",
};
