import { Grid, Typography } from "@mui/material";
import React from "react";
import { ICollection } from "@/common/types/collection";
import { FetchLoading } from "@/components/FetchLoading";
import CollectionCard from "@/components/common/cards/CardCollection";
import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { useRouter } from "next/router";

interface Props {
  collections: ICollection[];
  isLoadingCollection: boolean;
  title: string;
}

const Collections: React.FC<Props> = ({
  isLoadingCollection,
  collections,
  title,
}) => {
  const router = useRouter();

  return (
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
            {title}
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
              // width: { xs: '100%', sm: '95%' },
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
                <CollectionCard
                  onFavoriteClick={() => router.push(`/collection/${el.id}`)}
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
  );
};

export default Collections;
