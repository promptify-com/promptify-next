import { useState } from "react";
import Button from "@mui/material/Button";
import ShareOutlined from "@mui/icons-material/ShareOutlined";

import useBrowser from "@/hooks/useBrowser";
import { SparkExportPopup } from "@/components/dialog/SparkExportPopup";
import type { TemplatesExecutions } from "@/core/api/dto/templates";

interface Props {
  execution?: TemplatesExecutions;
}

function ExportExecutionButton({ execution }: Props) {
  const { isMobile } = useBrowser();
  const [openExportPopup, setOpenExportPopup] = useState(false);

  return (
    <>
      <Button
        variant="text"
        startIcon={<ShareOutlined />}
        sx={{
          color: "onSurface",
          fontSize: { xs: 12, md: 16 },
          minWidth: { xs: "40px", md: "auto" },
          p: { xs: 1, md: "4px 20px" },
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
        onClick={() => setOpenExportPopup(true)}
      >
        {!isMobile && "Export"}
      </Button>

      {openExportPopup && execution?.id && (
        <SparkExportPopup
          onClose={() => setOpenExportPopup(false)}
          activeExecution={execution}
        />
      )}
    </>
  );
}

export default ExportExecutionButton;
