import { SparkExportPopup } from "@/components/dialog/SparkExportPopup";
import { TemplatesExecutions } from "@/core/api/dto/templates";
import useBrowser from "@/hooks/useBrowser";
import { useAppSelector } from "@/hooks/useStore";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import Button from "@mui/material/Button";
import React, { useMemo, useState } from "react";

interface Props {
  execution?: TemplatesExecutions;
}

function ExportExecutionButton({ execution }: Props) {
  const [openExportPopup, setOpenExportPopup] = useState(false);
  const selectedTemplate = useAppSelector(state => state.chat.selectedTemplate);

  const { isMobile } = useBrowser();

  const activeExecution = useMemo(() => {
    if (execution && selectedTemplate) {
      return {
        ...execution,
        template: {
          ...execution.template,
          title: selectedTemplate.title,
          slug: selectedTemplate.slug,
          thumbnail: selectedTemplate.thumbnail,
        },
      };
    }
    return null;
  }, [execution]);
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
          activeExecution={activeExecution}
        />
      )}
    </>
  );
}

export default ExportExecutionButton;
