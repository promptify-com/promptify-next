import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapsible from "./Collapsible";
import Divider from "@mui/material/Divider";
import type { Item } from "./Collapsible";
import { useState } from "react";

const contentTypeItems = [
  { name: "Text", value: "Text" },
  { name: "Image", value: "image" },
  { name: "Video", value: "video" },
  { name: "Audio", value: "audio" },
] as const satisfies Item[];
const engineItems = [
  { name: "Stability AI", value: 1 },
  { name: "GPT 4", value: 2 },
] as const satisfies Item[];
const tagItems = [
  { name: "Creative writing", value: "creative writing" },
  { name: "Storytelling", value: "storytelling" },
] as const satisfies Item[];

function MyFavorites() {
  const [checked, setChecked] = useState(false);

  return (
    <Stack
      sx={{
        bgcolor: "#EEEEE8",
        borderRadius: "8px",
        mb: "20px",
        mt: "20px",
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
        items={engineItems}
        key="engines"
      />
      <Collapsible
        title="Popular tags"
        items={tagItems}
        key="popularTags"
      />
    </>
  );
}

export default PromptsFilters;
