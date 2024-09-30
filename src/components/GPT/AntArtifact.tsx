import React from "react";
import * as Recharts from "recharts";
import * as Materiel from "@mui/material";
import { LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live-runner";

// Types
interface Props {
  content: string;
}

// Scope libraries
const scope = { import: { react: React, recharts: Recharts, "@mui/material": Materiel } };

const AntArtifactComponent = ({ content }: Props) => {
  const startIndex = content.indexOf(">") + 1;
  const trimmedContent = content.substring(startIndex).trim();

  return (
    <div style={{ backgroundColor: "#e0f7fa", padding: "10px", borderRadius: "5px" }}>
      <h4>Artifact Content:</h4>
      <LiveProvider
        code={trimmedContent}
        scope={scope}
      >
        <LiveEditor />
        <LivePreview />
        <LiveError />
      </LiveProvider>
    </div>
  );
};

export default AntArtifactComponent;
