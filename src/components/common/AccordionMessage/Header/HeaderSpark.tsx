import { useEffect, useState } from "react";
import Edit from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import AvatarWithInitials from "@/components/Prompt/Common/AvatarWithInitials";
import { useAppSelector } from "@/hooks/useStore";
import useTruncate from "@/hooks/useTruncate";
import HeaderSparkActions from "@/components/common/AccordionMessage/Header/HeaderSparkActions";
import type { ExecutionTemplatePopupType, Templates } from "@/core/api/dto/templates";
import type { IMessage } from "@/components/Prompt/Types/chat";

interface Props {
  template: Templates;
  isExpanded: boolean;
  onCancel?: () => void;
  messages?: IMessage[];
}

function HeaderSpark({ template, isExpanded, onCancel, messages = [] }: Props) {
  const { truncate } = useTruncate();

  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);
  const selectedExecution = useAppSelector(state => state.executions?.selectedExecution ?? null);
  const currentUser = useAppSelector(state => state.user.currentUser);

  const [openExecutionPopup, setOpenExecutionPopup] = useState<ExecutionTemplatePopupType>(null);
  const [executionTitle, setExecutionTitle] = useState(selectedExecution?.title);

  useEffect(() => {
    setExecutionTitle(selectedExecution?.title);
  }, [selectedExecution]);

  const isOwner = currentUser?.id === selectedExecution?.executed_by;

  const allowRename = executionTitle && !isGenerating && isOwner;
  return (
    <Stack
      direction={{ xs: !isGenerating ? "column" : "row", md: "row" }}
      gap={"8px"}
      width={"100%"}
      alignItems={"center"}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"8px"}
        flex={1}
        width={"100%"}
      >
        <>
          {isGenerating ? (
            <CircularProgress
              size={42}
              sx={{
                color: "grey.400",
                borderRadius: "50%",
              }}
            />
          ) : (
            <AvatarWithInitials title={selectedExecution?.title ?? "Untitled"} />
          )}
        </>

        <Stack
          flex={1}
          direction={"column"}
          gap={"2px"}
        >
          <Typography
            fontSize={{ xs: "14px", md: "15px" }}
            lineHeight={"120%"}
            display={"flex"}
            flex={1}
            alignItems={"center"}
            justifyContent={{ xs: "space-between", md: "start" }}
            letterSpacing={"0.2px"}
          >
            <>
              {isGenerating ? "Generation in progress..." : truncate(executionTitle ?? "Untitled", { length: 80 })}
              {allowRename && (
                <Tooltip
                  arrow
                  title="Rename"
                  PopperProps={{
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, -5],
                        },
                      },
                    ],
                  }}
                >
                  <IconButton
                    onClick={e => {
                      e.stopPropagation();
                      setOpenExecutionPopup("update");
                    }}
                    sx={{
                      border: "none",
                      ml: { md: 1 },
                      ":hover": {
                        bgcolor: "surface.4",
                      },
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              )}
            </>
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 10, md: 12 },
              fontWeight: 400,
              lineHeight: "143%",
              letterSpacing: "0.17px",
              opacity: 0.7,
            }}
          >
            {isGenerating ? "About 360s Left" : ""}
          </Typography>
        </Stack>
      </Stack>
      <HeaderSparkActions
        template={template}
        isExpanded={isExpanded}
        onCancel={onCancel}
        openExecutionPopup={openExecutionPopup}
        setOpenExecutionPopup={setOpenExecutionPopup}
        updateTitle={setExecutionTitle}
        messages={messages}
      />
    </Stack>
  );
}

export default HeaderSpark;
