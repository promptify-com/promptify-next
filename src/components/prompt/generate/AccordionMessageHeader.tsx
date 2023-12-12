import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Add from "@mui/icons-material/Add";
import HighlightOff from "@mui/icons-material/HighlightOff";
import UnfoldLess from "@mui/icons-material/UnfoldLess";
import AvatarWithInitials from "../../design-system/AvatarWithInitials";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import {
  DeleteOutline,
  Edit,
  RemoveRedEyeOutlined,
  ShareOutlined,
  Star,
  StarOutline,
  VisibilityOff,
} from "@mui/icons-material";
import Close from "@mui/icons-material/Close";

import { ExecutionTemplatePopupType, Templates } from "@/core/api/dto/templates";
import { useDeleteExecutionFavoriteMutation, useExecutionFavoriteMutation } from "@/core/api/executions";
import { SparkSaveDeletePopup } from "@/components/dialog/SparkSaveDeletePopup";
import { SparkExportPopup } from "@/components/dialog/SparkExportPopup";
import { setAccordionChatMode, setGeneratingStatus, setShowPromptsView } from "@/core/store/templatesSlice";
import { setGeneratedExecution } from "@/core/store/executionsSlice";
import useTruncate from "@/hooks/useTruncate";
import { theme } from "@/theme";
import { AccordionChatMode } from "@/common/types/chat";
import { setAnswers } from "@/core/store/chatSlice";

interface Props {
  template: Templates;
  mode: AccordionChatMode;
  isExpanded: boolean;
  onCancel: () => void;
}

function AccordionMessageHeader({ template, mode, isExpanded, onCancel }: Props) {
  const isGenerating = useAppSelector(state => state.template.isGenerating);
  const dispatch = useAppDispatch();
  const { truncate } = useTruncate();

  const [favoriteExecution] = useExecutionFavoriteMutation();
  const [deleteExecutionFavorite] = useDeleteExecutionFavoriteMutation();

  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const showPrompts = useAppSelector(state => state.template.showPromptsView);
  const answers = useAppSelector(state => state.chat.answers);

  const [executionPopup, setExecutionPopup] = useState<ExecutionTemplatePopupType>(null);
  const [executionTitle, setExecutionTitle] = useState(selectedExecution?.title);

  const [openExportPopup, setOpenExportpopup] = useState(false);

  useEffect(() => {
    setExecutionTitle(selectedExecution?.title);
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
    onCancel();
    dispatch(setGeneratedExecution(null));
    dispatch(setGeneratingStatus(false));
    dispatch(setAccordionChatMode("input"));
  };

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

  const isExecutionMode = mode === "execution" || mode === "generated_execution";

  return (
    <>
      <AccordionSummary
        sx={{
          bgcolor: "surface.2",
          p: { xs: "0px 8px", md: "0px 16px" },
          borderRadius: "0px 16px 16px 16px",
        }}
      >
        <Stack
          direction={{ xs: isExecutionMode && !isGenerating ? "column" : "row", md: "row" }}
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
            {isExecutionMode && (
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
            )}

            {!isExecutionMode && (
              <Box
                position={"relative"}
                mt={0.5}
                sx={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  border: `1px dashed ${theme.palette.primary.main}`,
                  bgcolor: "#375CA91A",
                  color: "primary.main",
                }}
              >
                <Add
                  sx={{
                    fontSize: 32,
                  }}
                />
                <Box
                  position={"absolute"}
                  width={"13px"}
                  height={"13px"}
                  borderRadius={"4px 0px 8px 0px"}
                  bgcolor={"surface.1"}
                  bottom={0}
                  right={0}
                />
              </Box>
            )}

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
                {!isExecutionMode && "New Prompt"}

                {isExecutionMode && (
                  <>
                    {isGenerating
                      ? "Generation in progress..."
                      : truncate(executionTitle ?? "Untitled", { length: 80 })}
                    {executionTitle && !isGenerating && (
                      <Tooltip
                        arrow
                        title="Rename"
                        PopperProps={commonPopperProps}
                      >
                        <IconButton
                          onClick={e => {
                            e.stopPropagation();
                            setExecutionPopup("update");
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
                )}
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
                {!isExecutionMode && "About 360s generation time"}
                {isExecutionMode && <>{isGenerating ? "About 360s Left" : ""}</>}
              </Typography>
            </Stack>
          </Stack>

          {!isExecutionMode && isExpanded && (
            <Stack
              direction={"row"}
              gap={1}
              alignItems={"center"}
            >
              {!!answers.length && (
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    dispatch(setAnswers([]));
                  }}
                  endIcon={<Close sx={{ fontSize: { xs: 3 }, ml: { xs: -1, md: 0 } }} />}
                  sx={{
                    mr: { xs: -2, md: 0 },
                    height: "22px",
                    p: { xs: "8px", md: "15px" },
                    color: "onSurface",
                    fontSize: { xs: 11, md: 15 },
                    fontWeight: 500,
                    ":hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                  variant="text"
                >
                  Clear
                </Button>
              )}
            </Stack>
          )}
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={"8px"}
          >
            {isExecutionMode && (
              <>
                {isGenerating ? (
                  <Grid
                    display={"flex"}
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
                    {!isGenerating && (
                      <Tooltip
                        title="Show Prompts"
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
                    )}
                  </Grid>
                ) : (
                  <Stack
                    direction={"row"}
                    gap={"8px"}
                    alignItems={"center"}
                    mt={-1}
                  >
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
                            setOpenExportpopup(true);
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
                            setExecutionPopup("delete");
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
                  </Stack>
                )}
              </>
            )}

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
        </Stack>
      </AccordionSummary>
      {(executionPopup === "delete" || executionPopup === "update") && (
        <SparkSaveDeletePopup
          type={executionPopup}
          activeExecution={selectedExecution}
          onClose={() => setExecutionPopup(null)}
          onUpdate={execution => setExecutionTitle(execution.title)}
        />
      )}

      {openExportPopup && selectedExecution?.id && (
        <SparkExportPopup
          onClose={() => setOpenExportpopup(false)}
          activeExecution={activeExecution}
        />
      )}
    </>
  );
}

export default AccordionMessageHeader;
