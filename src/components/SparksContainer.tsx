import { FC, useMemo, useState } from "react";
import { Box, Grid } from "@mui/material";
import { Execution, ExecutionTemplatePopupType, TemplateExecutionsDisplay } from "@/core/api/dto/templates";

import { SparksLayoutDesktop } from "./SparksLayoutDesktop";
import { SparksLayoutMobile } from "./SparksLayoutMobile";
import { RootState } from "@/core/store";
import { SparkPopup } from "./dialog/SparkPopup";
import { useExecutionFavoriteMutation } from "@/core/api/executions";
import SparkFilters from "./SparksFilters";

interface SparksContainerProps {
  templates: TemplateExecutionsDisplay[];
}

const SparksContainer: FC<SparksContainerProps> = ({ templates }) => {
  // const openPopup = useSelector((state: RootState) => state.executionsSlice.openPopup);
  // const activeExecution = useSelector((state: RootState) => state.executionsSlice.activeExecution);
  // const popupType = useSelector((state: RootState) => state.executionsSlice.popupType);

  const [openPopup, setOpenPopup] = useState(false);
  const [activeExecution, setActiveExecution] = useState<Execution | null>(null);
  const [popupType, setPopupType] = useState<ExecutionTemplatePopupType>("update");
  const [templateSortOption, setTemplateSortOption] = useState<"asc" | "desc">("asc");
  const [executionSortOption, setExecutionSortOption] = useState<"asc" | "desc">("asc");
  const [executionTimeSortOption, setExecutionTimeSortOption] = useState<"asc" | "desc">("asc");
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

  // Memoize the sorted templates based on sort direction
  const sortedTemplates = useMemo(() => {
    return templates.slice().sort((a, b) => {
      if (templateSortOption === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
  }, [templateSortOption, templates]);

  // Memoize the filtered templates based on sort, template selection, and name filter
  const filteredTemplates = useMemo(() => {
    if (selectedTemplate) {
      return sortedTemplates
        .map(template => ({
          ...template,
          executions: template.executions
            .filter(execution => execution.title.toLowerCase().includes(nameFilter.toLowerCase()))
            .sort(compareByExecutionTime) // Apply execution time sorting
            .sort(compareByExecutionTitle), // Apply execution title sorting
        }))
        .filter(template => template.title === selectedTemplate.title);
    } else {
      return sortedTemplates.map(template => ({
        ...template,
        executions: template.executions
          .filter(execution => execution.title.toLowerCase().includes(nameFilter.toLowerCase()))
          .sort(compareByExecutionTime) // Apply execution time sorting
          .sort(compareByExecutionTitle), // Apply execution title sorting
      }));
    }
  }, [selectedTemplate, sortedTemplates, nameFilter, executionSortOption, executionTimeSortOption]);
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
