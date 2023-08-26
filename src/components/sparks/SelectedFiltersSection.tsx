import React from "react";
import { Chip, Avatar, Grid } from "@mui/material";
import { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import SavedSpark from "@/assets/icons/SavedSpark";
import DraftSpark from "@/assets/icons/DraftSpark";

interface SelectedFiltersSectionProps {
  selectedTemplate: TemplateExecutionsDisplay | null;
  nameFilter: string;
  currentTab: string;
  onTemplateClear: () => void;
  onSearchClear: () => void;
  onTabClear: () => void;
}

const SelectedFiltersSection: React.FC<SelectedFiltersSectionProps> = ({
  selectedTemplate,
  nameFilter,
  currentTab,
  onTemplateClear,
  onSearchClear,
  onTabClear,
}) => {
  return (
    <Grid
      display="flex"
      gap="8px"
      alignItems={"flex-start"}
      alignContent={"flex-start"}
      alignSelf={"stretch"}
      flexWrap={{ xs: "nowrap", md: "wrap" }}
      sx={{
        overflow: { xs: "auto", md: "initial" },
        WebkitOverflowScrolling: { xs: "touch", md: "initial" },
      }}
    >
      {selectedTemplate && (
        <Chip
          avatar={
            <Avatar
              alt={selectedTemplate.title}
              src={selectedTemplate.thumbnail}
            />
          }
          label={selectedTemplate.title}
          onDelete={onTemplateClear}
          sx={{
            bgcolor: { xs: "surface.5", md: "surface.1" },
            fontWeight: 400,
            fontSize: 13,
            lineHeight: "18px",
            letterSpacing: "0.16px",
          }}
        />
      )}
      {nameFilter !== "" && (
        <Chip
          label={nameFilter}
          onDelete={onSearchClear}
          sx={{
            bgcolor: { xs: "surface.5", md: "surface.1" },
            fontWeight: 400,
            fontSize: 13,
            lineHeight: "18px",
            letterSpacing: "0.16px",
          }}
        />
      )}
      {currentTab !== "all" && (
        <Chip
          label={`${currentTab === "saved" ? "Saved" : "Drafts"} Sparks`}
          icon={currentTab === "saved" ? <SavedSpark /> : <DraftSpark />}
          onDelete={onTabClear}
          sx={{
            bgcolor: { xs: "surface.5", md: "surface.1" },
            fontWeight: 400,
            pl: "10px",
            fontSize: 13,
            lineHeight: "18px",
            letterSpacing: "0.16px",
          }}
        />
      )}
    </Grid>
  );
};

export default SelectedFiltersSection;
