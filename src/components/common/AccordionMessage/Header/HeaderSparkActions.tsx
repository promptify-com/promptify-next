import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import HighlightOff from "@mui/icons-material/HighlightOff";
import RemoveRedEyeOutlined from "@mui/icons-material/RemoveRedEyeOutlined";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import Star from "@mui/icons-material/Star";
import StarOutline from "@mui/icons-material/StarOutline";
import UnfoldLess from "@mui/icons-material/UnfoldLess";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import { setGeneratingStatus, setShowPromptsView } from "@/core/store/templatesSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { SparkSaveDeletePopup } from "@/components/dialog/SparkSaveDeletePopup";
import { SparkExportPopup } from "@/components/dialog/SparkExportPopup";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "@/core/api/executions";
import { setGeneratedExecution } from "@/core/store/executionsSlice";
import type { ExecutionTemplatePopupType, Templates } from "@/core/api/dto/templates";
import type { IMessage } from "@/components/Prompt/Types/chat";
import { initialState as initialExecutionsState } from "@/core/store/executionsSlice";
import { initialState as initialTemplatesState } from "@/core/store/templatesSlice";

interface Props {
  template: Templates;
  isExpanded: boolean;
  onCancel?: () => void;
  updateTitle: Dispatch<SetStateAction<string | undefined>>;
  openExecutionPopup: ExecutionTemplatePopupType;
  setOpenExecutionPopup: Dispatch<SetStateAction<ExecutionTemplatePopupType>>;
  messages?: IMessage[];
}

function HeaderSparkActions({
  template,
  isExpanded,
  onCancel,
  updateTitle,
  openExecutionPopup,
  setOpenExecutionPopup,
  messages = [],
}: Props) {
  const dispatch = useAppDispatch();

  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? initialTemplatesState.isGenerating);
  const selectedExecution = useAppSelector(
    state => state.executions?.selectedExecution ?? initialExecutionsState.selectedExecution,
  );
  const currentUser = useAppSelector(state => state.user.currentUser);
  const showPrompts = useAppSelector(
    state => state.templates?.showPromptsView ?? initialTemplatesState.showPromptsView,
  );

  const [openExportPopup, setOpenExportPopup] = useState(false);

  const activeExecution = useMemo(() => {
    if (selectedExecution) {
      return {
        ...selectedExecution,
        template: {
          ...selectedExecution.template,
          title: template.title,
          slug: template.slug,
          thumbnail: template.thumbnail,
        },
      };
    }
    return null;
  }, [selectedExecution]);

  const saveExecution = async () => {
    if (!!!selectedExecution) return;

    try {
      if (selectedExecution.is_favorite) {
        await deleteExecutionFavorite(selectedExecution.id);
      } else {
        await favoriteExecution(selectedExecution.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const abortConnection = () => {
    dispatch(setGeneratedExecution(null));
    dispatch(setGeneratingStatus(false));
    if (typeof onCancel !== "undefined") {
      onCancel();
    }
  };

  const isOwner = currentUser?.id === selectedExecution?.executed_by;

  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"8px"}
      >
        <>
          {isGenerating ? (
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{ mr: { xs: -1, md: 0 } }}
            >
              <Button
                onClick={e => {
                  e.stopPropagation();
                  abortConnection();
                }}
                endIcon={<HighlightOff />}
                sx={{
                  height: "22px",
                  p: { xs: "8px", md: "15px" },
                  color: "onSurface",
                  fontSize: { xs: 10, md: 15 },
                  fontWeight: 500,
                  ":hover": {
                    bgcolor: "action.hover",
                  },
                }}
                variant="text"
              >
                Cancel
              </Button>
            </Stack>
          ) : (
            <Stack
              direction={"row"}
              gap={"8px"}
              alignItems={"center"}
              mt={-1}
            >
              {isOwner && (
                <Box
                  borderRight={"2px solid #ECECF4"}
                  pr={1}
                  height={"30px"}
                >
                  <Tooltip
                    title={selectedExecution?.is_favorite ? "Remove from works" : "Add to works"}
                    arrow
                    PopperProps={commonPopperProps}
                  >
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        saveExecution();
                      }}
                      sx={{
                        border: "none",
                        ":hover": {
                          bgcolor: "surface.4",
                        },
                      }}
                    >
                      {selectedExecution?.is_favorite ? <Star /> : <StarOutline />}
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              <Box
                borderRight={"2px solid #ECECF4"}
                pr={1}
                height={"30px"}
              >
                <Tooltip
                  title={!showPrompts ? "Show Prompts" : "Hide Prompts"}
                  arrow
                  PopperProps={commonPopperProps}
                >
                  <IconButton
                    onClick={e => {
                      e.stopPropagation();
                      dispatch(setShowPromptsView(!showPrompts));
                    }}
                    sx={{
                      border: "none",
                      ":hover": {
                        bgcolor: "surface.4",
                      },
                    }}
                  >
                    {!showPrompts ? <RemoveRedEyeOutlined /> : <VisibilityOff />}
                  </IconButton>
                </Tooltip>
              </Box>

              <Box
                borderRight={"2px solid #ECECF4"}
                pr={1}
                height={"30px"}
              >
                <Tooltip
                  title="Share"
                  arrow
                  PopperProps={commonPopperProps}
                >
                  <IconButton
                    onClick={e => {
                      e.stopPropagation();
                      setOpenExportPopup(true);
                    }}
                    sx={{
                      border: "none",
                      ":hover": {
                        bgcolor: "surface.4",
                      },
                    }}
                  >
                    <ShareOutlined />
                  </IconButton>
                </Tooltip>
              </Box>

              {isOwner && (
                <Box
                  borderRight={"2px solid #ECECF4"}
                  pr={1}
                  height={"30px"}
                >
                  <Tooltip
                    title="Delete"
                    arrow
                    PopperProps={commonPopperProps}
                  >
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        setOpenExecutionPopup("delete");
                        // dispatch(setTmpMessages(messages.filter(message => message.type !== "spark")));
                      }}
                      sx={{
                        border: "none",
                        ":hover": {
                          color: "red",
                          bgcolor: "surface.4",
                        },
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Stack>
          )}
        </>
        <Stack>
          {isExpanded ? (
            <Tooltip
              title="Collapse"
              arrow
              placement="top"
              PopperProps={commonPopperProps}
            >
              <IconButton
                sx={{
                  border: "none",
                  ":hover": {
                    bgcolor: "surface.4",
                  },
                }}
              >
                <UnfoldLess fontSize="inherit" />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              variant="text"
              sx={{
                height: "34px",
                p: "15px",
                color: "onSurface",
                fontSize: 13,
                fontWeight: 500,
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              Expand
              <UnfoldLess
                sx={{
                  fontSize: 20,
                  ml: 1,
                }}
              />
            </Button>
          )}
        </Stack>
      </Stack>

      {(openExecutionPopup === "delete" || openExecutionPopup === "update") && (
        <SparkSaveDeletePopup
          type={openExecutionPopup}
          activeExecution={selectedExecution}
          onClose={() => setOpenExecutionPopup(null)}
          onUpdate={execution => updateTitle(execution.title)}
          messages={messages}
        />
      )}

      {openExportPopup && selectedExecution?.id && (
        <SparkExportPopup
          onClose={() => setOpenExportPopup(false)}
          activeExecution={activeExecution}
        />
      )}
    </>
  );
}

const commonPopperProps = {
  modifiers: [
    {
      name: "offset",
      options: {
        offset: [0, -5],
      },
    },
  ],
};

export default HeaderSparkActions;
