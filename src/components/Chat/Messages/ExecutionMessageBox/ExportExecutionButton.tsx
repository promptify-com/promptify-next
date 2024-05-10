import { SparkExportPopup } from "@/components/dialog/SparkExportPopup";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import useBrowser from "@/hooks/useBrowser";
import { useAppSelector } from "@/hooks/useStore";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import Button from "@mui/material/Button";
import { useMemo, useState } from "react";

interface Props {
  template: Templates;
  execution?: TemplatesExecutions;
}

function ExportExecutionButton({ execution, template }: Props) {
  const [openExportPopup, setOpenExportPopup] = useState(false);

  const { isMobile } = useBrowser();

  const activeExecution = useMemo(() => {
    if (execution) {
      return {
        ...execution,
        template: {
          ...execution.template,
          title: template?.title,
          slug: template?.slug,
          thumbnail: template?.thumbnail,
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
