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
      {/* {availableTabs.includes("all") && (
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
      )}
      {availableTabs.includes("saved") && (
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
      )}
      {availableTabs.includes("drafts") && (
        <Tab
          value="drafts"
          label="Drafts"
          style={{
            minWidth: "40px",
          }}
          sx={{
            textTransform: "capitalize",
            opacity: availableTabs.includes("saved") && value !== "drafts" ? 0.6 : 1,
          }}
        />
      )} */}
    </Tabs>
  );
};

export default TabsSection;
