import { FC, useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Execution, ExecutionTemplatePopupType, TemplateExecutionsDisplay } from "@/core/api/dto/templates";

import { SparksLayoutDesktop } from "./SparksLayoutDesktop";
import { SparksLayoutMobile } from "./SparksLayoutMobile";
import { SparkPopup } from "./dialog/SparkPopup";
import { useExecutionFavoriteMutation } from "@/core/api/executions";
import SparkFilters, { TabValueType } from "./SparksFilters";

interface SparksContainerProps {
  templates: TemplateExecutionsDisplay[];
}

export interface ExecutionTemplate {
  title: string;
  thumbnail: string;
  slug: string;
}

export type CurrentSortType = "executionTitle" | "executionTime" | "executionTemplate" | "saved" | "drafts";
interface ExecutionWithTemplate extends Execution {
  template: ExecutionTemplate;
}

const SparksContainer: FC<SparksContainerProps> = ({ templates }) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [activeExecution, setActiveExecution] = useState<Execution | null>(null);
  const [popupType, setPopupType] = useState<ExecutionTemplatePopupType>("update");
  const [templateSortOption, setTemplateSortOption] = useState<"asc" | "desc">("desc");
  const [executionSortOption, setExecutionSortOption] = useState<"asc" | "desc">("desc");
  const [executionTimeSortOption, setExecutionTimeSortOption] = useState<"asc" | "desc">("desc");
  const [executionFavoriteSortOption, setExecutionFavoriteSortOption] = useState<"saved" | "drafts">("saved");

  const [currentTab, setCurrentTab] = useState<TabValueType>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateExecutionsDisplay | null>(null);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [currentSortType, setCurrentSortType] = useState<CurrentSortType>("executionTitle");

  const [favoriteExecution] = useExecutionFavoriteMutation();

  const handleSaveExecution = (executionId: number) => {
    favoriteExecution(executionId);
  };

  const toggleSortDirection = () => {
    setTemplateSortOption(templateSortOption === "asc" ? "desc" : "asc");
    setCurrentSortType("executionTemplate");
  };

  const handleExecutionSortDirection = () => {
    setExecutionSortOption(executionSortOption === "asc" ? "desc" : "asc");
    setCurrentSortType("executionTitle");
  };

  const handleTimeSortDirection = () => {
    setExecutionTimeSortOption(executionTimeSortOption === "asc" ? "desc" : "asc");
    setCurrentSortType("executionTime");
  };

  const handleExecutionFavoriteSort = (value: "saved" | "drafts") => {
    setExecutionFavoriteSortOption(value);
    setCurrentSortType(value);
  };

  const handleTemplateSelect = (selectedTemplate: TemplateExecutionsDisplay | null) => {
    setSelectedTemplate(selectedTemplate);
  };

  const handleNameFilter = (filterValue: string) => {
    setNameFilter(filterValue);
  };

  const filterAndSortExecutions = (
    executions: ExecutionWithTemplate[],
    sortBy: CurrentSortType,
    sortDirection: "asc" | "desc",
    selectedTemplate: TemplateExecutionsDisplay | null,
  ) => {
    const sortedExecutions = [...executions];

    sortedExecutions.sort((a: ExecutionWithTemplate, b: ExecutionWithTemplate) => {
      if (sortBy === "executionTitle") {
        const titleComparison = a.title.localeCompare(b.title);
        return sortDirection === "asc" ? titleComparison : -titleComparison;
      } else if (sortBy === "executionTime") {
        const aTimestamp = new Date(a.created_at).getTime();
        const bTimestamp = new Date(b.created_at).getTime();
        const timeComparison = aTimestamp - bTimestamp;
        return sortDirection === "asc" ? timeComparison : -timeComparison;
      } else if (sortBy === "executionTemplate") {
        const templateComparison = a.template.title.localeCompare(b.template.title);
        return sortDirection === "asc" ? templateComparison : -templateComparison;
      } else if (sortBy === "saved") {
        // Handle the "saved" case
        return a.is_favorite === b.is_favorite ? 0 : a.is_favorite ? -1 : 1;
      } else if (sortBy === "drafts") {
        // Handle the "drafts" case
        return a.is_favorite === b.is_favorite ? 0 : a.is_favorite ? 1 : -1;
      }
      return 0; // Default case
    });

    if (selectedTemplate) {
      return sortedExecutions.filter(execution => execution.template.slug === selectedTemplate.slug);
    }

    return sortedExecutions;
  };

  // filtereing executions regadless currentTab
  const executions = useMemo(() => {
    // Calculate all executions from templates and add template information
    const allExecutions: ExecutionWithTemplate[] = [];
    templates.forEach(template => {
      const templateInfo = {
        title: template.title,
        thumbnail: template.thumbnail,
        slug: template.slug,
      };
      const executionsWithTemplate = template.executions.map((execution: Execution) => ({
        ...execution,
        template: templateInfo,
      }));
      allExecutions.push(...executionsWithTemplate);
    });

    let selectedSortOption: "asc" | "desc" = "asc"; // Default value
    if (currentSortType === "executionTitle") {
      selectedSortOption = executionSortOption;
    } else if (currentSortType === "executionTemplate") {
      selectedSortOption = templateSortOption;
    } else if (currentSortType === "executionTime") {
      selectedSortOption = executionTimeSortOption;
    }

    const filteredAndSortedExecutions = filterAndSortExecutions(
      allExecutions,
      currentSortType,
      selectedSortOption,
      selectedTemplate,
    ).filter(execution => execution.title.toLowerCase().includes(nameFilter.toLowerCase()));
    return filteredAndSortedExecutions;
  }, [
    nameFilter,
    currentSortType,
    executionSortOption,
    templateSortOption,
    executionFavoriteSortOption,
    selectedTemplate,
    executionTimeSortOption,
    templates,
  ]);

  const draftsExecutions = executions.filter(execution => !execution.is_favorite);
  const savedExecutions = executions.filter(execution => execution.is_favorite);

  const hasDrafts = draftsExecutions.length > 0;
  const hasSaved = savedExecutions.length > 0;

  const availableTabs = useMemo(() => {
    const tabs: TabValueType[] = ["all"];
    if (hasDrafts) tabs.push("drafts");
    if (hasSaved) tabs.push("saved");

    return tabs;
  }, [hasDrafts, hasSaved]);

  // Apply tab-based filtering to executions
  const filteredExecutions = useMemo(() => {
    if (currentTab === "saved") {
      return savedExecutions;
    } else if (currentTab === "drafts") {
      return draftsExecutions;
    } else {
      return executions;
    }
  }, [currentTab, draftsExecutions, savedExecutions, executions]);

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
        onSortFavoriteToggle={handleExecutionFavoriteSort}
        sortTemplateDirection={templateSortOption}
        sortExecutionDirection={executionSortOption}
        sortFavoriteDirection={executionFavoriteSortOption}
        sortTimeDirection={executionTimeSortOption}
        onNameFilter={handleNameFilter}
        nameFilter={nameFilter}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        availableTabs={availableTabs}
      />
      <Grid
        display={"flex"}
        flexDirection={"column"}
        borderRadius={"8px"}
        overflow={"hidden"}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
        >
          {filteredExecutions.map(execution => (
            <Box key={execution.id}>
              <SparksLayoutDesktop
                onExecutionSaved={() => handleSaveExecution(execution.id)}
                template={execution.template}
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
              <SparksLayoutMobile
                onExecutionSaved={() => handleSaveExecution(execution.id)}
                template={execution.template}
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
