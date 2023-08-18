import { FC, useState } from "react";
import { Box, ClickAwayListener, Grid, Grow, Paper, Popper, TextField } from "@mui/material";
import { Execution, TemplateExecutionsDisplay } from "@/core/api/dto/templates";

import { SparksLayoutDesktop } from "./SparksLayoutDesktop";
import { SparksLayoutMobile } from "./SparksLayoutMobile";
import { useDispatch, useSelector } from "react-redux";
import { setActiveExecution, setAnchorElement, setOpenRenameDropdow } from "@/core/store/executionsSlice";
import { RootState } from "@/core/store";

interface SparksContainerProps {
  templates: TemplateExecutionsDisplay[];
}

const SparksContainer: FC<SparksContainerProps> = ({ templates }) => {
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
                template={template}
                execution={execution}
              />
              {/* MOBILE VIEW  */}
              <SparksLayoutMobile
                template={template}
                execution={execution}
              />
            </Box>
          ))}
        </Box>
      ))}

      {/* <DropdownDeleteExecution /> */}
    </Grid>
  );
};

export default SparksContainer;
