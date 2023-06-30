import { Grid } from "@mui/material";
import React from "react";
import { ICollection } from "@/common/types/collection";
import CardTemplate from "../explorer/CardPrompte";
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
            <CardTemplate
              onFavoriteClick={() => router.push(`/prompt/${el.id}`)}
              key={idx}
              collection={el}
            />
          ))}
      </Grid>
    </Grid>
  );
};
