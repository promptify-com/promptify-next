import { FC, useMemo, useState } from "react";
import { Box, Grid } from "@mui/material";
import {
  Execution,
  ExecutionTemplatePopupType,
  ExecutionWithTemplate,
  TemplateExecutionsDisplay,
  TemplatesExecutions,
} from "@/core/api/dto/templates";

import { SparksLayoutDesktop } from "./SparksLayoutDesktop";
import { SparksLayoutMobile } from "./SparksLayoutMobile";
import { SparkSaveDeletePopup } from "./dialog/SparkSaveDeletePopup";
import { useExecutionFavoriteMutation } from "@/core/api/executions";
import SparkFilters, { TabValueType } from "./SparksFilters";
import { SparkExportPopup } from "./dialog/SparkExportPopup";

interface SparksContainerProps {
  templates: TemplateExecutionsDisplay[];
}
export type CurrentSortType = "executionTitle" | "executionTime" | "executionTemplate" | "executionFavorite";

type SortDirectionState = {
  [key in CurrentSortType]: "asc" | "desc";
};

type SortStateWithCurrentType = SortDirectionState & {
  currentType: CurrentSortType;
};

const SparksContainer: FC<SparksContainerProps> = ({ templates }) => {
  const [popup, setPopup] = useState<ExecutionTemplatePopupType>(null);
  const [activeExecution, setActiveExecution] = useState<TemplatesExecutions | null>(null);

  const [currentTab, setCurrentTab] = useState<TabValueType>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateExecutionsDisplay | null>(null);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [favoriteExecution] = useExecutionFavoriteMutation();

  const handleSaveExecution = (executionId: number) => {
    favoriteExecution(executionId);
  };

  const [sortDirectionState, setSortDirectionState] = useState<SortStateWithCurrentType>({
    executionTitle: "desc",
    executionTemplate: "desc",
    executionTime: "desc",
    executionFavorite: "desc",
    currentType: "executionTime",
  });

  const toggleSortDirection = (sortType: CurrentSortType) => {
    const newDirection = sortDirectionState[sortType] === "asc" ? "desc" : "asc";
    setSortDirectionState(prevState => ({
      ...prevState,
      currentType: sortType,
      [sortType]: newDirection,
    }));
  };

  const handleTemplateSelect = (selectedTemplate: TemplateExecutionsDisplay | null) => {
    setSelectedTemplate(selectedTemplate);
  };

  const handleNameFilter = (filterValue: string) => {
    setNameFilter(filterValue);
  };

  const filterAndSortExecutions = (
    executions: ExecutionWithTemplate[],
    selectedTemplate: TemplateExecutionsDisplay | null,
  ) => {
    const sortedExecutions = [...executions];
    const type = sortDirectionState.currentType;

    sortedExecutions.sort((a: ExecutionWithTemplate, b: ExecutionWithTemplate) => {
      if (type === "executionTitle") {
        const titleComparison = a.title.localeCompare(b.title);
        return sortDirectionState[type] === "asc" ? titleComparison : -titleComparison;
      } else if (type === "executionTime") {
        const aTimestamp = new Date(a.created_at).getTime();
        const bTimestamp = new Date(b.created_at).getTime();
        const timeComparison = aTimestamp - bTimestamp;
        return sortDirectionState[type] === "asc" ? timeComparison : -timeComparison;
      } else if (type === "executionTemplate") {
        const templateComparison = a.template.title.localeCompare(b.template.title);
        return sortDirectionState[type] === "asc" ? templateComparison : -templateComparison;
      } else {
        // Handle the "executionFavorite" case
        const favoriteComparison = a.is_favorite === b.is_favorite ? 0 : a.is_favorite ? -1 : 1;
        return sortDirectionState[type] === "asc" ? favoriteComparison : -favoriteComparison;
      }
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

    const filteredAndSortedExecutions = filterAndSortExecutions(allExecutions, selectedTemplate).filter(execution =>
      execution.title.toLowerCase().includes(nameFilter.toLowerCase()),
    );
    return filteredAndSortedExecutions;
  }, [nameFilter, selectedTemplate, templates, sortDirectionState]);

  const draftsExecutions = executions.filter(execution => !execution.is_favorite);
  const savedExecutions = executions.filter(execution => execution.is_favorite);

  const hasDrafts = draftsExecutions.length > 0;
  const hasSaved = savedExecutions.length > 0;

  const availableTabs = useMemo(() => {
    const tabs: TabValueType[] = ["all"];
    if (hasSaved) tabs.push("saved");
    if (hasDrafts) tabs.push("drafts");

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
        onSortTemplateToggle={() => toggleSortDirection("executionTemplate")}
        onSortExecutionToggle={() => toggleSortDirection("executionTitle")}
        onSortTimeToggle={() => toggleSortDirection("executionTime")}
        onSortFavoriteToggle={() => toggleSortDirection("executionFavorite")}
        sortTemplateDirection={sortDirectionState.executionTemplate}
        sortExecutionDirection={sortDirectionState.executionTitle}
        sortFavoriteDirection={sortDirectionState.executionFavorite}
        sortTimeDirection={sortDirectionState.executionTime}
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
                onOpenExport={() => {
                  setPopup("export");
                  setActiveExecution(execution);
                }}
                onOpenEdit={() => {
                  setPopup("update");
                  setActiveExecution(execution);
                }}
                onOpenDelete={() => {
                  setPopup("delete");
                  setActiveExecution(execution);
                }}
              />
              <SparksLayoutMobile
                onExecutionSaved={() => handleSaveExecution(execution.id)}
                template={execution.template}
                execution={execution}
                onOpenEdit={() => {
                  setPopup("update");
                  setActiveExecution(execution);
                }}
                onOpenExport={() => {
                  setPopup("export");
                  setActiveExecution(execution);
                }}
                onOpenDelete={() => {
                  setPopup("delete");
                  setActiveExecution(execution);
                }}
              />
            </Box>
          ))}
        </Box>
      </Grid>
      {popup === "delete" ||
        (popup === "update" && (
          <SparkSaveDeletePopup
            type={popup}
            activeExecution={activeExecution}
            onClose={() => setPopup(null)}
          />
        ))}

      {popup === "export" && (
        <SparkExportPopup
          onClose={() => setPopup(null)}
          activeExecution={activeExecution}
        />
      )}
    </Grid>
  );
};

export default SparksContainer;
