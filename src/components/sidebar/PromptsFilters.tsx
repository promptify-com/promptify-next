import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapsible from "./Collapsible";
import Divider from "@mui/material/Divider";
import type { Item } from "./Collapsible";
import { useState } from "react";
import { useGetTagsPopularQuery } from "@/core/api/tags";
import { useGetEnginesQuery } from "@/core/api/engines";

const contentTypeItems = [
  { name: "Text", id: 1 },
  { name: "Image", id: 2 },
  { name: "Video", id: 3 },
  { name: "Audio", id: 4 },
] as const satisfies Item[];

function MyFavorites() {
  const [checked, setChecked] = useState(false);

  return (
    <Stack
      sx={{
        bgcolor: "#EEEEE8",
        borderRadius: "16px",
        mb: "20px",
        mt: "20px",
        p: "8px 8px 8px 16px",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Typography width={"50%"}>My favorites:</Typography>
      <FormControlLabel
        control={<Switch color="primary" />}
        label={""}
        checked={checked}
        name="my_favorites"
        value={""}
        onChange={(_, _checked) => setChecked(_checked)}
        sx={{
          width: "50%",
          justifyContent: "flex-end",
        }}
      />
    </Stack>
  );
}

function PromptsFilters() {
  const { data: tags } = useGetTagsPopularQuery();
  const { data: engines } = useGetEnginesQuery();
  console.log({ tags, engines });
  return (
    <>
      <MyFavorites />
      <Collapsible
        title="Content type"
        items={contentTypeItems}
        key="contentType"
      />
      <Collapsible
        title="Engines"
        items={engines}
        key="engines"
      />
      <Collapsible
        title="Popular tags"
        items={tags}
        key="popularTags"
      />
    </>
  );
}

export default PromptsFilters;
