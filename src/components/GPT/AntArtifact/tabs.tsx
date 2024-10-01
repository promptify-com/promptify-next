import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Types
interface Props {
  tab: string;
  setTab: (newValue: string) => void;
}

const AntArtifactTabs = ({ tab, setTab }: Props) => {

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <Tabs
      value={tab}
      onChange={handleChangeTab}
    >
      <Tab
        label="code"
        value={"code"}
      />
      <Tab
        label="preview"
        value={"preview"}
      />
    </Tabs>
  );
};

export default AntArtifactTabs;
