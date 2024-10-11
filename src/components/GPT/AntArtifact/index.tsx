import React, { useEffect } from "react";
import * as Materiel from "@mui/material";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as Recharts from "recharts";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live-runner";
import { useAppSelector } from "@/hooks/useStore";
import CopyButton from "./CopyButton";
import AntArtifactTabs from "./Tabs";

interface Props {
  content: string;
  title?: string;
}

const scope = { import: { react: React, recharts: Recharts, "@mui/material": Materiel } };

const AntArtifactComponent = ({ content, title }: Props) => {
  const startIndex = content.indexOf(">") + 1;
  const code = content.substring(startIndex).trim();
  const [tab, setTab] = React.useState<"code" | "preview">("preview");
  const GPTgeneratingStatus = useAppSelector(state => state.chat?.gptGenerationStatus);

  useEffect(() => {
    if (GPTgeneratingStatus === "streaming") {
      setTab("code");
    }
  }, [GPTgeneratingStatus]);
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        marginY: 2,
        pY: 2,
        maxWidth: tab === "code" ? { xs: 400, sm: 600, md: 360, lg: 600, xl: 900 } : "auto"
      }}
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
        {tab === "preview" && (
          <Stack sx={{ p: 2 }}>
            <LivePreview Component={"div"} />
          </Stack>
        )}
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
