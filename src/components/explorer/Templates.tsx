import { Box, Grid, Typography } from "@mui/material";
import React from "react";

import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { ICollection } from "@/common/types/collection";
import { FetchLoading } from "@/components/FetchLoading";
import { Tag } from "@/core/api/dto/templates";
import { useGetTemplatesByKeyWordAndTagQuery } from "@/core/api/explorer";
import CardTemplate from "../common/cards/CardTemplate";
import CardCollection from "@/components/common/cards/CardCollection";
import { useRouter } from "next/router";

interface Props {
  selectedTag: Tag[];
  keyWord: string;
  collections: ICollection[];
  isLoadingCollection: boolean;
}

export const CustomTemplates: React.FC<Props> = ({
  selectedTag,
  keyWord,
  collections,
  isLoadingCollection,
}) => {
  const router = useRouter();

  const queryString = selectedTag
    .map((tag) => `tag=${encodeURIComponent(tag.name)}`)
    .join("&");
  const { data: templates, isFetching } = useGetTemplatesByKeyWordAndTagQuery(
    { keyword: keyWord, tag: queryString },
    { refetchOnMountOrArgChange: true }
  );

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "grey.100" }}>
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
        {!keyWord && !queryString && (
          <Grid
            sx={{
              maxWidth: "1160px",
              width: "100%",
            }}
          >
            <Grid
              sx={{
                justifyContent: "flex-start",
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
                    marginBottom: "1em",
                  }}
                >
                  Top Collections
                </Typography>
              </Grid>
            </Grid>
            {isLoadingCollection ? (
              <FetchLoading />
            ) : (
              <Grid
                sx={{
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    gap: "1em",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
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
                  }}
                >
                  {!!collections && collections.length > 0 ? (
                    collections.map((el, idx) => (
                      <CardCollection
                        onFavoriteClick={() =>
                          router.push(`/collection/${el.id}`)
                        }
                        key={idx}
                        collection={el}
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
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        )}

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
                    lengthTemplate={templates.length}
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
