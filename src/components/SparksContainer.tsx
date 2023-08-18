import { FC } from "react";
import { Box, Grid } from "@mui/material";
import { TemplateExecutionsDisplay } from "@/core/api/dto/templates";

import { SparksLayoutDesktop } from "./SparksLayoutDesktop";
import { SparksLayoutMobile } from "./SparksLayoutMobile";
import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { SparkPopup } from "./dialog/SparkPopup";
import { useDeleteExecutionMutation } from "@/core/api/executions";

interface SparksContainerProps {
  templates: TemplateExecutionsDisplay[];
}

const SparksContainer: FC<SparksContainerProps> = ({ templates }) => {
  const openPopup = useSelector((state: RootState) => state.executionsSlice.openPopup);
  const activeExecution = useSelector((state: RootState) => state.executionsSlice.activeExecution);
  const popupType = useSelector((state: RootState) => state.executionsSlice.popupType);

  const [favoriteExecution] = useDeleteExecutionMutation();

  const handleSaveExecution = (executionId: number) => {
    favoriteExecution(executionId);
  };

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      borderRadius={"8px"}
      overflow={"hidden"}
      gap={{ xs: "16px", md: "0px" }}
    >
      {templates.map(template => (
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
              />
              {/* MOBILE VIEW  */}
              <SparksLayoutMobile
                onExecutionSaved={() => handleSaveExecution(execution.id)}
                template={template}
                execution={execution}
              />
            </Box>
          ))}
        </Box>
      ))}
      <SparkPopup
        open={openPopup}
        type={popupType}
        activeExecution={activeExecution}
      />
    </Grid>
  );
};

export default SparksContainer;
