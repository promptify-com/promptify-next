import React from "react";
import * as Materiel from "@mui/material";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as Recharts from "recharts";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live-runner";
import AntArtifactTabs from "@/components/GPT/AntArtifact/tabs";
import CopyButton from "./copyButton";

interface Props {
  content: string;
  title?: string;
}

const scope = { import: { react: React, recharts: Recharts, "@mui/material": Materiel } };

const AntArtifactComponent = ({ content, title }: Props) => {
  const startIndex = content.indexOf(">") + 1;
  const code = content.substring(startIndex).trim();
  const [tab, setTab] = React.useState("preview");

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 4, marginY: 2, pY: 2, maxWidth: "100%", position: "relative" }}
    >
      <Stack
        direction="row"
        sx={{ p: 1, alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={600}
        >
          {title}
        </Typography>
        <AntArtifactTabs
          setTab={setTab}
          tab={tab}
        />
      </Stack>
      <LiveProvider
        code={code}
        scope={scope}
        language={"javascript"}
      >
        {tab === "code" && (
          <LiveEditor
            style={{ margin: "auto" }}
            disabled
          />
        )}
        {tab === "preview" && <LivePreview Component={"div"} />}
        <Stack
          direction="row"
          sx={{ p: 1, alignItems: "center", justifyContent: "space-between" }}
        >
          <LiveError />
          <Box sx={{ flexGrow: 1 }} />
          <CopyButton code={code} />
        </Stack>
      </LiveProvider>
    </Card>
  );
};

export default AntArtifactComponent;
