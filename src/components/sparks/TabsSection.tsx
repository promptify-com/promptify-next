import React from "react";
import { Tab, Tabs } from "@mui/material";

interface TabsSectionProps {
  value: string;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
}

const TabsSection: React.FC<TabsSectionProps> = ({ value, onChange }) => {
  return (
    <Tabs
      value={value}
      onChange={(event, newValue) => onChange(event, newValue)}
    >
      <Tab
        value="all"
        label="All"
        style={{
          minWidth: "40px",
        }}
        sx={{
          textTransform: "capitalize",
        }}
      />
      <Tab
        value="saved"
        label="Saved"
        style={{
          minWidth: "40px",
        }}
        sx={{
          textTransform: "capitalize",
        }}
      />
      <Tab
        value="drafts"
        label="Drafts"
        style={{
          minWidth: "40px",
        }}
        sx={{
          textTransform: "capitalize",
          opacity: value !== "drafts" ? 0.6 : 1,
        }}
      />
    </Tabs>
  );
};

export default TabsSection;
