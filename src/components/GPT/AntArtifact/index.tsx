import React from "react";
import * as Materiel from "@mui/material";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import * as Recharts from "recharts";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live-runner";
import AntArtifactTabs from "@/components/GPT/AntArtifact/tabs";

// Types
interface Props {
  content: string;
}

// Scope libraries
const scope = { import: { react: React, recharts: Recharts, "@mui/material": Materiel } };

const AntArtifactComponent = ({ content }: Props) => {
  const startIndex = content.indexOf(">") + 1;
  const code = content.substring(startIndex).trim();
  const [tab, setTab] = React.useState("preview");

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 4, marginY: 2, pY: 2, maxWidth: "100%" }}
    >
      <Stack
        direction="row"
        sx={{ p: 1, alignItems: "center", justifyContent: "end" }}
      >
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
        {tab === "code" && <LiveEditor />}
        {tab === "preview" && <LivePreview Component={"div"} />}
        <LiveError />
      </LiveProvider>
    </Card>
  );
};

export default AntArtifactComponent;
