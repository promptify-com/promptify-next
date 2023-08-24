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
} from "@mui/material";
import { ClassicPreset } from "rete";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useRete } from "rete-react-render-plugin";

import { createEditor, Node } from "@/components/builder/Editor";
import { Header } from "@/components/builder/Header";
import { MinusIcon, PlusIcon } from "@/assets/icons";
import DeleteIcon from "@mui/icons-material/Delete";
import { Sidebar } from "@/components/builder/Sidebar";
import { useEngines } from "@/hooks/api/engines";
import { useGetPromptTemplatesQuery, usePublishTemplateMutation } from "@/core/api/templates";
import { Prompts } from "@/core/api/dto/prompts";
import { deletePrompt, updateTemplate } from "@/hooks/api/templates";
import { ContentCopy } from "@mui/icons-material";
import { INodesData } from "@/common/types/builder";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { Templates } from "@/core/api/dto/templates";

export interface ITemplate {
  title: string;
  description: string;
  example: string;
  thumbnail: string;
  is_visible: boolean;
  language: string;
  category: number;
  difficulty: string;
  duration: string;
  prompts_list?: INodesData[];
}
export interface IPromptParams {
  parameter_id: number;
  score: number;
  name?: string;
  is_visible: boolean;
  is_editable: boolean;
  descriptions?: {
    score: number;
    description: string;
  }[];
}

export const Builder = () => {
  const router = useRouter();
  const id = router.query.id;
  const [nodeCount, setNodeCount] = useState(1);
  const [prompts, setPrompts] = useState<Prompts[]>([]);
  const [engines] = useEngines();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<INodesData | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [nodesData, setNodesData] = useState<INodesData[]>([]);
  const { data: promptsData } = useGetPromptTemplatesQuery(id ? +id : skipToken);
  const dataForRequest = useRef({} as any);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [templateDrawerOpen, setTemplateDrawerOpen] = React.useState(Boolean(router.query.editor));
  const [publishTemplate] = usePublishTemplateMutation();

  // Remove 'editor' query param after first load to prevent open modal on every load
  useEffect(() => {
    const newQueryParams = new URLSearchParams(window.location.search);
    newQueryParams.delete("editor");
    window.history.replaceState({}, "", `${window.location.pathname}?${newQueryParams}`);
  }, [router.query.editor]);

  const create = useCallback(
    (el: HTMLElement) => {
      return createEditor(
        el,
        setSelectedNode,
        setSelectedConnection,
        prompts,
        nodeCount,
        setNodeCount,
        setNodesData,
        updateTemplateDependencties,
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
    // assign random integer to temp_id
    node.temp_id = Math.floor(Math.random() * 1000000000);

    setNodesData(prev => [
      ...prev,
      {
        temp_id: node.temp_id,
        count: nodeCount.toString(),
        title: `Prompt #${nodeCount}`,
        content: "Describe here prompt parameters, for example {{name:text}} or {{age:integer}}",
        engine_id: 1,
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
      node.temp_id = Math.floor(Math.random() * 1000000000);

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

  const updateTitle = (value: string) => {
    if (selectedNode) {
      selectedNode.label = value;
      editor?.area.update("node", selectedNode.id);
    }
  };

  const updateTemplateDependencties = (id: string, dependsOn: string) => {
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

  const injectOrderAndSendRequest = () => {
    const data = dataForRequest.current;
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
            />
          </Grid>
          <SwipeableDrawer
            anchor={"left"}
            open={templateDrawerOpen}
            onClose={() => toggleTemplateDrawer(false)}
            onOpen={() => toggleTemplateDrawer(true)}
          >
            <Box sx={{ bgcolor: "#373737", p: "1rem" }}>
              <TemplateForm
                type="edit"
                templateData={promptsData as Templates}
                darkMode
                onSaved={() => window.location.reload()}
                onClose={() => toggleTemplateDrawer(false)}
              />
            </Box>
          </SwipeableDrawer>
          <Grid
            item
            xs={selectedNode ? 9 : 12}
          >
            <Box
              height={"calc(100vh - 80px)"}
              bgcolor={"#525252"}
              position="relative"
              sx={{
                backgroundImage: "radial-gradient(black 1px, transparent 0)",
                backgroundSize: "30px 30px",
              }}
            >
              <div
                ref={ref}
                style={{ height: "100%", width: "100%" }}
              ></div>

              <Box
                sx={{
                  position: "absolute",
                  left: 50,
                  bottom: 50,
                }}
              >
                <Button
                  sx={{ bgcolor: "black" }}
                  onClick={() => createNode()}
                >
                  <Typography color={"white"}>Add Node</Typography>
                  <Typography
                    color={"white"}
                    sx={{ opacity: 0.4 }}
                  >
                    &nbsp;Ctrl+N
                  </Typography>
                </Button>
                {selectedNode && (
                  <React.Fragment>
                    <Button
                      sx={{ bgcolor: "black", ml: "10px" }}
                      onClick={() => duplicateNode()}
                    >
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "white",
                        }}
                      >
                        <ContentCopy sx={{ opacity: 0.4, mr: "3px", fontSize: "medium" }} /> Duplicate
                      </Typography>
                    </Button>
                    <Button
                      sx={{ bgcolor: "#f85149", ml: "10px" }}
                      onClick={() => setConfirmDialogOpen(true)}
                    >
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "white",
                        }}
                      >
                        <DeleteIcon sx={{ opacity: 0.5, mr: "3px", fontSize: "medium" }} /> Delete
                      </Typography>
                    </Button>
                  </React.Fragment>
                )}
                {selectedConnection && (
                  <Button
                    sx={{ bgcolor: "#f85149", ml: "10px" }}
                    onClick={() => removeConnection()}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      <DeleteIcon sx={{ opacity: 0.5, mr: "3px", fontSize: "medium" }} /> Delete
                    </Typography>
                  </Button>
                )}
              </Box>
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
          <Grid
            item
            xs={selectedNode ? 3 : 0}
          >
            <Box
              bgcolor={"#373737"}
              height={"calc(100vh - 80px)"}
              display={selectedNode ? "block" : "none"}
            >
              <Sidebar
                engines={engines}
                prompts={prompts}
                selectedNode={selectedNode}
                updateTitle={updateTitle}
                removeNode={() => setConfirmDialogOpen(true)}
                nodeCount={nodeCount}
                nodesData={nodesData}
                setNodesData={setNodesData}
                selectedNodeData={selectedNodeData}
                setSelectedNodeData={setSelectedNodeData}
              />
            </Box>
          </Grid>
        </Grid>
        <Snackbar
          open={snackBarOpen}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          autoHideDuration={3000}
          message="Prompt template saved with success"
          onClose={() => setSnackBarOpen(false)}
        />
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
