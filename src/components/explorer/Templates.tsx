import { Box, Grid, Typography } from "@mui/material";
import React from "react";

import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { FetchLoading } from "@/components/FetchLoading";
import { Tag } from "@/core/api/dto/templates";
import { useGetTemplatesByKeyWordAndTagQuery } from "@/core/api/explorer";
import CardTemplate from "../common/cards/CardTemplate";
import { useRouter } from "next/router";

interface Props {
  selectedTag: Tag[];
  keyWord: string;
}

export const CustomTemplates: React.FC<Props> = ({ selectedTag, keyWord }) => {
  const router = useRouter();

  const queryString = selectedTag
    .map((tag) => `tag=${encodeURIComponent(tag.name)}`)
    .join("&");
  const { data: templates, isFetching } = useGetTemplatesByKeyWordAndTagQuery(
    { keyword: keyWord, tag: queryString },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "surface.3" }}>
      <Grid
        sx={{
          padding: "1em",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2em",
        }}
      >
        <Grid
          sx={{
            maxWidth: "1160px",
            width: "100%",
          }}
        >
          <Grid
            sx={{
              justifyContent: "flex-start",
              marginBottom: "1em",
            }}
          >
            <Grid>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "24px",
                  lineHeight: "133.4%",
                  color: "#1B1B1E",
                }}
              >
                Best Templates
              </Typography>
            </Grid>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              gap: "1em",
              flexWrap: "wrap",
              width: "100%",
              boxSizing: "border-box",
              WebkitFlexDirection: "row",
              msFlexDirection: "row",
              flexDirection: "row",
              WebkitBoxFlexWrap: "wrap",
              WebkitFlexWrap: "wrap",
              msFlexWrap: "wrap",
              WebkitBoxPack: "start",
              msFlexPack: "start",
              WebkitJustifyContent: "flex-start",
              justifyContent: "space-between",
            }}
          >
            {!isFetching ? (
              !!templates && templates.length > 0 ? (
                templates.map((el, idx) => (
                  <CardTemplate
                    onFavoriteClick={() => router.push(`/prompt/${el.slug}`)}
                    key={idx}
                    template={el}
                  />
                ))
              ) : (
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <NotFoundIcon />
                </Grid>
              )
            ) : (
              <FetchLoading />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
