import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  SwipeableDrawer,
  alpha,
  Stack,
  Drawer,
} from "@mui/material";
import { ClassicPreset } from "rete";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useRete } from "rete-react-render-plugin";

import { createEditor, Node } from "@/components/builder/Editor";
import { Header } from "@/components/builder/Header";
import { MinusIcon, PlusIcon } from "@/assets/icons";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetPromptTemplatesQuery, usePublishTemplateMutation } from "@/core/api/templates";
import { Prompts } from "@/core/api/dto/prompts";
import { deletePrompt, updateTemplate } from "@/hooks/api/templates";
import { ContentCopy } from "@mui/icons-material";
import { INodesData } from "@/common/types/builder";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { promptRandomId } from "@/common/helpers/promptRandomId";
import { isPromptVariableValid } from "@/common/helpers/isPromptVariableValid";

import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { theme } from "@/theme";
import { useGetEnginesQuery } from "@/core/api/engines";
import { PromptForm } from "@/components/builder/PromptForm";
import useToken from "@/hooks/useToken";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
    />
  );
});

export const Builder = () => {
  const router = useRouter();
  const id = router.query.id;
  const [nodeCount, setNodeCount] = useState(1);
  const [prompts, setPrompts] = useState<Prompts[]>([]);
  const { data: engines } = useGetEnginesQuery();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<INodesData | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [nodesData, setNodesData] = useState<INodesData[]>([]);
  const { data: promptsData } = useGetPromptTemplatesQuery(id ? +id : skipToken);
  const dataForRequest = useRef({} as any);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [templateDrawerOpen, setTemplateDrawerOpen] = React.useState(Boolean(router.query.editor));
  const [publishTemplate] = usePublishTemplateMutation();
  const [snackBarInvalidVariables, setSnackBarInvalidVariables] = React.useState(false);
  const [invalidVariableMessage, setInvalidVariableMessage] = React.useState("");
  const token = useToken();

  // Remove 'editor' query param after first load to prevent open modal on every load
  useEffect(() => {
    if (!token) {
      router.push("/signin");
    }

    if (router.query.editor) {
      const { editor, ...restQueryParams } = router.query;

      // Replace the route without causing a re-render, and without changing the scroll position
      router.replace(
        {
          pathname: router.pathname,
          query: restQueryParams,
        },
        undefined,
        { scroll: false, shallow: true },
      );
    }
  }, [router.query]);

  const create = useCallback(
    (el: HTMLElement) => {
      return createEditor(
        el,
        setSelectedNode,
        setSelectedConnection,
        prompts,
        engines,
        nodeCount,
        setNodeCount,
        setNodesData,
        updateTemplateDependencies,
      );
    },
    [setSelectedNode, prompts, promptsData],
  );

  const [ref, editor] = useRete(create);

  useEffect(() => {
    if (promptsData) {
      const data = {
        title: promptsData.title,
        description: promptsData.description,
        example: promptsData.example,
        thumbnail: promptsData.thumbnail,
        is_visible: promptsData.is_visible,
        language: promptsData.language,
        category: promptsData.category.id,
        difficulty: promptsData.difficulty,
        duration: promptsData.duration,
        status: promptsData.status,
      };
      dataForRequest.current = data;
    }
  }, [promptsData]);

  useEffect(() => {
    if (nodesData) {
      const data = dataForRequest.current as any;
      data.prompts_list = nodesData.map(node => {
        const model_parameters = node.model_parameters || null;
        return {
          id: node.id,
          temp_id: node.temp_id,
          title: node.title,
          content: node.content,
          engine_id: node.engine_id,
          parameters: node?.parameters?.map(params => {
            return {
              parameter_id: params.parameter_id,
              score: params.score,
              is_visible: params.is_visible,
              is_editable: params.is_editable,
            };
          }),
          dependencies: node.dependencies,
          output_format: node.output_format,
          model_parameters: model_parameters,
          is_visible: node.is_visible,
          show_output: node.show_output,
          prompt_output_variable: node.prompt_output_variable,
        };
      });

      dataForRequest.current = data;
    }
  }, [nodesData, dataForRequest]);

  useEffect(() => {
    if (promptsData) {
      setPrompts(promptsData.prompts);
    }
  }, [promptsData]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);

    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [selectedNode]);

  useEffect(() => {
    if (!selectedNode) {
      setSelectedNodeData(null);
    } else {
      const findSelectedNode = nodesData?.find(node => {
        return node?.id?.toString() === selectedNode?.id.toString() || node?.temp_id === selectedNode?.temp_id;
      });

      if (findSelectedNode) {
        setSelectedNodeData(findSelectedNode);
      }
    }
  }, [selectedNode]);

  const handleKeyboard = async (e: KeyboardEvent) => {
    if (e.ctrlKey && e.code === "KeyN") {
      createNode();
    }
    if (selectedNode && e.code === "Delete") {
      setConfirmDialogOpen(true);
    }
  };

  const createNode = async () => {
    const socket = new ClassicPreset.Socket("socket");
    const node = new Node(`Prompt #${nodeCount}`);
    node.addInput("Input", new ClassicPreset.Input(socket, "Input"));
    node.addOutput("Output", new ClassicPreset.Output(socket, "Output"));
    node.engineIcon = engines?.find(eng => eng.id === 1)?.icon || "";

    const allNodes = editor?.editor.getNodes();

    allNodes?.forEach(_node => {
      _node.selected = false;
      editor?.area.update("node", _node.id);
    });

    await editor?.editor.addNode(node);

    setNodeCount(prev => prev + 1);
    setSelectedNode(node);
    node.selected = true;
    node.count = nodeCount.toString();
    node.temp_id = promptRandomId();

    setNodesData(prev => [
      ...prev,
      {
        temp_id: node.temp_id,
        count: nodeCount.toString(),
        title: `Prompt #${nodeCount}`,
        content: "Describe here prompt parameters, for example {{name:text}} or {{age:number}}",
        engine_id: engines ? engines[0].id : 0,
        dependencies: [],
        parameters: [],
        order: 1,
        output_format: "",
        model_parameters: null,
        is_visible: true,
        show_output: true,
        prompt_output_variable: `$temp_id_${node.temp_id}`,
      },
    ]);
  };

  const duplicateNode = async () => {
    if (selectedNode && selectedNodeData) {
      const socket = new ClassicPreset.Socket("socket");
      const node = new Node(`${selectedNodeData.title} - Copy`);
      node.addInput("Input", new ClassicPreset.Input(socket, "Input"));
      node.addOutput("Output", new ClassicPreset.Output(socket, "Output"));
      node.engineIcon = engines?.find(eng => eng.id === selectedNodeData.engine_id)?.icon || "";

      const allNodes = editor?.editor.getNodes();

      allNodes?.forEach(allNodesNode => {
        allNodesNode.selected = false;
        editor?.area.update("node", allNodesNode.id);
      });

      await editor?.editor.addNode(node);

      setNodeCount(prev => prev + 1);
      setSelectedNode(node);
      node.selected = true;
      node.count = nodeCount.toString();
      node.temp_id = promptRandomId();

      setNodesData(prev => [
        ...prev,
        {
          temp_id: node.temp_id,
          count: nodeCount.toString(),
          title: `${selectedNodeData.title} - Copy`,
          content: selectedNodeData.content,
          engine_id: selectedNodeData.engine_id,
          dependencies: [],
          parameters: selectedNodeData.parameters,
          order: selectedNodeData.order,
          output_format: selectedNodeData.output_format,
          model_parameters: selectedNodeData.model_parameters,
          is_visible: selectedNodeData.is_visible,
          show_output: selectedNodeData.show_output,
          prompt_output_variable: `$temp_id_${node.temp_id}`,
        },
      ]);
    }
  };

  const removeNode = async () => {
    setNodeCount(nodeCount - 1);

    const data = dataForRequest.current;

    const currentPrompt = dataForRequest.current.prompts_list.find((prompt: INodesData) => {
      return prompt?.id?.toString() === selectedNode?.id || prompt?.temp_id === selectedNode?.temp_id;
    });

    // Remove the prompt from the backend
    if (currentPrompt?.id) {
      await deletePrompt(Number(currentPrompt.id));
    }

    const allPrompts = data.prompts_list.filter((prompt: INodesData) => {
      return prompt?.id?.toString() !== currentPrompt?.id?.toString() || prompt?.temp_id !== currentPrompt?.temp_id;
    });

    data.prompts_list = allPrompts;

    // remove the ID of the prompt from the dependencies of other prompts
    allPrompts.forEach((prompt: INodesData) => {
      prompt.dependencies = prompt.dependencies.filter((dependency: number) => {
        return dependency !== currentPrompt?.id && dependency !== currentPrompt?.temp_id;
      });
    });

    dataForRequest.current = {
      ...dataForRequest.current,
      prompts_list: allPrompts,
    };

    setNodesData(allPrompts);
    await editor?.removeSelected();

    setSelectedNode(null);
    setConfirmDialogOpen(false);
  };

  const removeConnection = async () => {
    if (selectedConnection) {
      const connection = editor?.editor.getConnection(selectedConnection);
      if (connection) {
        const source = editor?.editor.getNode(connection?.source),
          target = editor?.editor.getNode(connection?.target);

        if (source && target) {
          const targetNode = nodesData.find(
            node => node.id?.toString() === target?.id || node.temp_id === target?.temp_id,
          );
          if (targetNode) {
            targetNode.dependencies = targetNode?.dependencies.filter(dep => dep.toString() !== source?.id);

            setNodesData(prev => [...prev.filter(node => node.id !== targetNode?.id), targetNode as INodesData]);
          }
          await editor?.removeConnection(selectedConnection);
          setSelectedConnection(null);
        }
      }
    }
  };

  useEffect(() => {
    updateNodes();
  }, [selectedNodeData]);

  const updateEditor = () => {
    if (!!!selectedNode || !!!selectedNodeData) return;

    const nodeId = Number(selectedNode.id) || Number(selectedNode.temp_id);
    if (nodeId !== selectedNodeData.id && nodeId !== selectedNodeData.temp_id) return;
    const engine = engines?.find(_engine => _engine.id === selectedNodeData.engine_id);

    if (selectedNode.label !== selectedNodeData.title || selectedNode.engineIcon !== engine?.icon) {
      selectedNode.label = selectedNodeData.title;
      selectedNode.engineIcon = engine?.icon || "";
      editor?.area.update("node", selectedNode.id);
    }
  };

  const updateNodes = () => {
    if (!!!selectedNode || !!!selectedNodeData) return;

    const _nodes = nodesData.map(node => {
      if (node.id === selectedNodeData.id || (selectedNodeData.temp_id && node.temp_id === selectedNodeData.temp_id)) {
        node = selectedNodeData;
      }
      return node;
    });

    setNodesData(_nodes);
    updateEditor();
  };

  const updateTemplateDependencies = (id: string, dependsOn: string) => {
    const data = dataForRequest.current;
    const currentPrompt = dataForRequest.current.prompts_list?.find((prompt: INodesData) => {
      return prompt.temp_id === Number(id) || prompt.id === Number(id);
    });

    if (currentPrompt) {
      currentPrompt.dependencies = [...currentPrompt.dependencies, Number(dependsOn)];

      const allPrompts = data.prompts_list.filter((prompt: any) => {
        return prompt.id !== currentPrompt?.id || prompt.temp_id !== currentPrompt?.temp_id;
      });

      const prompts = [...allPrompts, currentPrompt];
      data.prompts_list = prompts;

      dataForRequest.current = data;
      setNodesData(prompts);
    }
  };

  const injectOrderAndSendRequest = () => {
    const data = dataForRequest.current;

    const allPromptsValid = dataForRequest.current.prompts_list.every((prompt: any) => {
      const validation = isPromptVariableValid(prompt.content);
      if (!validation.isValid) {
        setInvalidVariableMessage(validation.message);
        return false;
      }
      return true;
    });

    if (!allPromptsValid) {
      setSnackBarInvalidVariables(true);
      return;
    }

    // remove duplicated dependencies in the prompts
    data.prompts_list?.forEach((prompt: INodesData) => {
      prompt.dependencies = prompt.dependencies.filter((dependency: number, index: number, self: number[]) => {
        return self.indexOf(dependency) === index;
      });
    });

    function getOrder(node: INodesData) {
      if (!node?.dependencies) {
        return 1;
      } else {
        let maxOrder = 0;
        node.dependencies.forEach(dependencyId => {
          const dependency = data.prompts_list.find((n: any) => n.id === dependencyId || n.temp_id === dependencyId);
          const dependencyOrder = dependency?.order || getOrder(dependency);
          if (dependencyOrder > maxOrder) {
            maxOrder = dependencyOrder;
          }
        });
        return maxOrder + 1;
      }
    }

    data.prompts_list?.forEach((node: any) => {
      node.order = getOrder(node);
    });

    data.prompts_list?.sort(function (a: any, b: any) {
      return a.order - b.order;
    });

    updateTemplate(Number(id), data).then(() => {
      setSnackBarOpen(true);
      window.location.reload();
    });
  };

  const toggleTemplateDrawer = (open: boolean) => {
    setTemplateDrawerOpen(open);
  };

  const handlePublishTemplate = async () => {
    injectOrderAndSendRequest();
    await publishTemplate(Number(id));
  };

  return (
    <>
      <Box>
        <Grid container>
          <Grid
            item
            xs={12}
          >
            <Header
              status={dataForRequest.current.status}
              title={dataForRequest.current.title}
              onPublish={() => handlePublishTemplate()}
              onDrawerOpen={() => toggleTemplateDrawer(true)}
              onSave={injectOrderAndSendRequest}
              templateSlug={promptsData?.slug}
            />
          </Grid>
          <Grid
            item
            xs={selectedNode ? 9 : 12}
            sx={{ flex: 1 }}
          >
            <Box
              height={"calc(100vh - 70.5px)"}
              bgcolor={"surface.5"}
              position="relative"
              sx={{
                backgroundImage: `radial-gradient(${alpha(theme.palette.grey[500], 0.5)} 1.3px, transparent 0)`,
                backgroundSize: "30px 30px",
              }}
            >
              <div
                ref={ref}
                style={{ height: "100%", width: "100%" }}
              ></div>

              <Stack
                direction={"row"}
                gap={2}
                sx={{
                  position: "absolute",
                  left: 50,
                  bottom: 50,
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    ":hover": {
                      bgcolor: "secondary.main",
                      color: "onPrimary",
                    },
                  }}
                  onClick={() => createNode()}
                >
                  Add Node
                  <Typography
                    color={"white"}
                    sx={{ opacity: 0.4 }}
                  >
                    &nbsp;Ctrl+N
                  </Typography>
                </Button>
                {selectedNode && (
                  <>
                    <Button
                      variant="contained"
                      sx={{
                        ":hover": {
                          bgcolor: "secondary.main",
                          color: "onPrimary",
                        },
                      }}
                      startIcon={<ContentCopy sx={{ opacity: 0.4 }} />}
                      onClick={() => duplicateNode()}
                    >
                      Duplicate
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#f85149",
                        color: "onError",
                        border: "none",
                        ":hover": {
                          bgcolor: "#f85149",
                          color: "onError",
                          opacity: 0.8,
                        },
                      }}
                      startIcon={<DeleteIcon sx={{ opacity: 0.5 }} />}
                      onClick={() => setConfirmDialogOpen(true)}
                    >
                      Delete
                    </Button>
                  </>
                )}
                {selectedConnection && (
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#f85149",
                      color: "onError",
                      border: "none",
                      ":hover": {
                        bgcolor: "#f85149",
                        color: "onError",
                        opacity: 0.8,
                      },
                    }}
                    startIcon={<DeleteIcon sx={{ opacity: 0.5 }} />}
                    onClick={removeConnection}
                  >
                    Delete
                  </Button>
                )}
              </Stack>
              <Box
                sx={{
                  position: "absolute",
                  top: 50,
                  right: 30,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  onClick={() => editor?.zoomAt(1)}
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      opacity: 0.5,
                    },
                  }}
                >
                  <PlusIcon />
                </Box>
                <Box
                  onClick={() => editor?.zoomAt(0.1)}
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      opacity: 0.5,
                    },
                  }}
                >
                  <MinusIcon />
                </Box>
              </Box>
            </Box>
          </Grid>
          {!!promptsData && (
            <SwipeableDrawer
              anchor={"left"}
              open={templateDrawerOpen}
              onClose={() => toggleTemplateDrawer(false)}
              onOpen={() => toggleTemplateDrawer(true)}
              PaperProps={{
                sx: {
                  width: "430px",
                  minWidth: "30svw",
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: "#FDFBFF",
                  p: "24px 32px",
                }}
              >
                <TemplateForm
                  type="edit"
                  templateData={promptsData}
                  darkMode
                  onSaved={() => window.location.reload()}
                  onClose={() => toggleTemplateDrawer(false)}
                />
              </Box>
            </SwipeableDrawer>
          )}
          {!!selectedNode && !!selectedNodeData && (
            <Drawer
              variant="persistent"
              anchor="right"
              open={!!selectedNode && !!selectedNodeData}
              sx={{
                "& .MuiDrawer-paper": {
                  width: "430px",
                  minWidth: "30svw",
                },
              }}
            >
              <PromptForm
                removeNode={() => setConfirmDialogOpen(true)}
                selectedNodeData={selectedNodeData}
                setSelectedNodeData={setSelectedNodeData}
                nodeCount={nodeCount}
                nodesData={nodesData}
                setNodesData={setNodesData}
                close={() => {
                  setSelectedNode(null);
                }}
              />
            </Drawer>
          )}
        </Grid>
        <Snackbar
          open={snackBarOpen}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={3000}
          message="Prompt template saved with success"
          onClose={() => setSnackBarOpen(false)}
        />
        <Snackbar
          open={snackBarInvalidVariables}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={4000}
          onClose={() => setSnackBarInvalidVariables(false)}
        >
          <Alert
            onClose={() => setSnackBarInvalidVariables(false)}
            severity="error"
            sx={{ width: "100%", bgcolor: "#f85249" }}
          >
            You have entered an invalid prompt variable {invalidVariableMessage}
          </Alert>
        </Snackbar>
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>{selectedNodeData?.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to remove this node?</DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              p: "8px 15px 15px",
            }}
          >
            <Button
              sx={{
                "&:hover": {
                  backgroundColor: "grey.300",
                },
              }}
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                removeNode();
              }}
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      title: "Promptify | Boost Your Creativity",
      description:
        "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
    },
  };
}
export default Builder;
