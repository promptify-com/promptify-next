import { FC, useMemo, useState } from "react";
import { Box, Grid } from "@mui/material";
import { Execution, ExecutionTemplatePopupType, TemplateExecutionsDisplay } from "@/core/api/dto/templates";

import { SparksLayoutDesktop } from "./SparksLayoutDesktop";
import { SparksLayoutMobile } from "./SparksLayoutMobile";
import { SparkPopup } from "./dialog/SparkPopup";
import { useExecutionFavoriteMutation } from "@/core/api/executions";
import SparkFilters from "./SparksFilters";

interface SparksContainerProps {
  templates: TemplateExecutionsDisplay[];
}

const SparksContainer: FC<SparksContainerProps> = ({ templates }) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [activeExecution, setActiveExecution] = useState<Execution | null>(null);
  const [popupType, setPopupType] = useState<ExecutionTemplatePopupType>("update");
  const [templateSortOption, setTemplateSortOption] = useState<"asc" | "desc">("desc");
  const [executionSortOption, setExecutionSortOption] = useState<"asc" | "desc">("desc");
  const [executionTimeSortOption, setExecutionTimeSortOption] = useState<"asc" | "desc">("desc");
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateExecutionsDisplay | null>(null);
  const [nameFilter, setNameFilter] = useState<string>("");

  const [favoriteExecution] = useExecutionFavoriteMutation();

  const handleSaveExecution = (executionId: number) => {
    favoriteExecution(executionId);
  };

  const toggleSortDirection = () => {
    setTemplateSortOption(templateSortOption === "asc" ? "desc" : "asc");
  };

  const compareByExecutionTime = (a: Execution, b: Execution) => {
    const aTimestamp = new Date(a.created_at).getTime();
    const bTimestamp = new Date(b.created_at).getTime();

    if (executionTimeSortOption === "asc") {
      return aTimestamp - bTimestamp;
    } else {
      return bTimestamp - aTimestamp;
    }
  };

  const compareByExecutionTitle = (a: Execution, b: Execution) => {
    if (executionSortOption === "asc") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  };

  const handleExecutionSortDirection = () => {
    setExecutionSortOption(executionSortOption === "asc" ? "desc" : "asc");
  };

  const handleTimeSortDirection = () => {
    setExecutionTimeSortOption(executionTimeSortOption === "asc" ? "desc" : "asc");
  };

  const handleTemplateSelect = (selectedTemplate: TemplateExecutionsDisplay | null) => {
    setSelectedTemplate(selectedTemplate);
  };

  const handleNameFilter = (filterValue: string) => {
    setNameFilter(filterValue);
  };

  // This function filters and sorts executions based on given criteria
  const filterAndSortExecutions = (executions: Execution[], filterPredicate: (execution: Execution) => boolean) => {
    // Filter the executions based on the provided filterPredicate
    // Then sort them first by execution time and then by execution title
    return executions.filter(filterPredicate).sort(compareByExecutionTime).sort(compareByExecutionTitle);
  };

  // Use the useMemo hook to efficiently calculate filtered templates
  const filteredTemplates = useMemo(() => {
    // Define a filterPredicate based on the current tab value
    const filterPredicate =
      currentTab === "saved"
        ? (execution: Execution) => execution.is_favorite
        : currentTab === "drafts"
        ? (execution: Execution) => !execution.is_favorite
        : () => true; // For the "all" tab, no additional filtering is needed

    // Map through the templates and apply filtering and sorting to their executions
    const sortedAndFilteredTemplates = templates.map(template => ({
      ...template,
      executions: filterAndSortExecutions(
        template.executions,
        (execution: Execution) =>
          execution.title.toLowerCase().includes(nameFilter.toLowerCase()) && filterPredicate(execution),
      ),
    }));

    // If a specific template is selected, filter the templates to match the selected template's title
    // Otherwise, return all the sorted and filtered templates
    if (selectedTemplate) {
      return sortedAndFilteredTemplates.filter(template => template.title === selectedTemplate.title);
    } else {
      return sortedAndFilteredTemplates;
    }
  }, [currentTab, templates, selectedTemplate, nameFilter, executionSortOption, executionTimeSortOption]);
  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"16px"}
    >
      <SparkFilters
        templates={templates}
        onTemplateSelect={handleTemplateSelect}
        selectedTemplate={selectedTemplate}
        onSortTemplateToggle={toggleSortDirection}
        onSortExecutionToggle={handleExecutionSortDirection}
        onSortTimeToggle={handleTimeSortDirection}
        sortTemplateDirection={templateSortOption}
        sortExecutionDirection={executionSortOption}
        sortTimeDirection={executionTimeSortOption}
        onNameFilter={handleNameFilter}
        nameFilter={nameFilter}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      <Grid
        display={"flex"}
        flexDirection={"column"}
        borderRadius={"8px"}
        overflow={"hidden"}
        gap={{ xs: "16px", md: "0px" }}
      >
        {filteredTemplates.map(template => (
          <Box
            key={template.id}
            display={"flex"}
            flexDirection={"column"}
            gap={{ xs: "16px", md: "0px" }}
          >
            {template.executions.map(execution => (
              <Box key={execution.id}>
                {/* // DESKTOP VIEW */}
                <SparksLayoutDesktop
                  onExecutionSaved={() => handleSaveExecution(execution.id)}
                  template={template}
                  execution={execution}
                  onOpenEdit={() => {
                    setPopupType("update");
                    setActiveExecution(execution);
                    setOpenPopup(true);
                  }}
                  onOpenDelete={() => {
                    setPopupType("delete");
                    setActiveExecution(execution);
                    setOpenPopup(true);
                  }}
                />
                {/* MOBILE VIEW  */}
                <SparksLayoutMobile
                  onExecutionSaved={() => handleSaveExecution(execution.id)}
                  template={template}
                  execution={execution}
                  onOpenEdit={() => {
                    setPopupType("update");
                    setActiveExecution(execution);
                    setOpenPopup(true);
                  }}
                  onOpenDelete={() => {
                    setPopupType("delete");
                    setActiveExecution(execution);
                    setOpenPopup(true);
                  }}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Grid>
      <SparkPopup
        type={popupType}
        open={openPopup}
        activeExecution={activeExecution}
        onClose={() => setOpenPopup(false)}
      />
    </Grid>
  );
};

export default SparksContainer;
