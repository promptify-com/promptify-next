import React from "react";
import { Tab, Tabs } from "@mui/material";
import { TabValueType } from "../SparksFilters";

interface TabsSectionProps {
  value: TabValueType;
  onChange: (event: React.SyntheticEvent, newValue: TabValueType) => void;
  availableTabs: TabValueType[];
}

const TabsSection: React.FC<TabsSectionProps> = ({ value, onChange, availableTabs }) => {
  return (
    <Tabs
      value={value}
      onChange={(event, newValue) => onChange(event, newValue)}
    >
      {availableTabs.map((tab, idx) => (
        <Tab
          key={idx}
          value={tab}
          label={tab}
          style={{
            minWidth: "40px",
          }}
          sx={{
            textTransform: "capitalize",
            opacity: tab === "drafts" && availableTabs.includes("saved") && value !== "drafts" ? 0.6 : 1,
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabsSection;
