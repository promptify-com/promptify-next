import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Types
interface Props {
  tab: "code" | "preview";
  setTab: (newValue: "code" | "preview") => void;
}

const AntArtifactTabs = ({ tab, setTab }: Props) => {
  const handleChangeTab = (event: React.SyntheticEvent, newValue: "code" | "preview") => {
    setTab(newValue);
  };

  return (
    <Tabs
      value={tab}
      onChange={handleChangeTab}
      sx={{
        minHeight: 30,
        height: 30,
        borderRadius: 4,
        alignItems: "center",
        background: theme => theme.palette.grey[200],
        "& .MuiTabs-indicator": { display: "none" },
      }}
    >
      <Tab
        label="code"
        value={"code"}
        sx={{ fontSize: 12 }}
      />
      <Tab
        label="preview"
        value={"preview"}
        sx={{ fontSize: 12 }}
      />
    </Tabs>
  );
};

export default AntArtifactTabs;
