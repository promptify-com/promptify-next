import { Grid } from "@mui/material";
import React from "react";
import { ICollection } from "@/common/types/collection";
import CardCollection from "@/components/common/cards/CardCollection";
import { useRouter } from "next/router";

interface Props {
  templates: ICollection[];
}

export const CustomDetailCardTemplates: React.FC<Props> = ({ templates }) => {
  const router = useRouter();
  return (
    <Grid
      sx={{
        justifyContent: "flex-start",
        marginTop: "1em",
        display: "flex",
        paddingLeft: "3.5em",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          gap: "1em",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {!!templates &&
          templates.length > 0 &&
          templates.map((el, idx) => (
            <CardCollection
              onFavoriteClick={() => router.push(`/prompt/${el.slug}`)}
              key={idx}
              collection={el}
            />
          ))}
      </Grid>
    </Grid>
  );
};
