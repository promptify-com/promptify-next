import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Space_Mono } from "next/font/google";

import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Stack from "@mui/material/Stack";
import Zoom from "@mui/material/Zoom";
import { ClassicPreset } from "rete";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useRete } from "rete-react-render-plugin";
import { createEditor, Node } from "@/components/builder/Editor";
import Header from "@/components/builder/Header";
import { MinusIcon, PlusIcon } from "@/assets/icons";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useDeletePromptMutation,
  useGetPromptTemplateBySlugQuery,
  usePublishTemplateMutation,
} from "@/core/api/templates";
import { Prompts } from "@/core/api/dto/prompts";
import { updateTemplate } from "@/hooks/api/templates";
import { ContentCopy } from "@mui/icons-material";
import { IEditPrompts } from "@/common/types/builder";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { isPromptVariableValid } from "@/common/helpers/promptValidator";
import { randomId, redirectToPath } from "@/common/helpers";
import { theme } from "@/theme";
import { useGetEnginesQuery } from "@/core/api/engines";
import useToken from "@/hooks/useToken";
import { BUILDER_DESCRIPTION, BUILDER_TYPE } from "@/common/constants";
import PromptCardAccordion from "@/components/builder/PromptCardAccordion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { setEngines, setIsTemplateOwner, setTemplate } from "@/core/store/builderSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";

export const Builder = () => {
  const router = useRouter();
  const slug = router.query.slug as string;
  const [nodeCount, setNodeCount] = useState(1);
  const [prompts, setPrompts] = useState<Prompts[]>([]);
  const { data: engines } = useGetEnginesQuery();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<IEditPrompts | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [nodesData, setNodesData] = useState<IEditPrompts[]>([]);
  const { data: templateData } = useGetPromptTemplateBySlugQuery(slug ? slug : skipToken);
  const dataForRequest = useRef({} as any);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(Boolean(router.query.editor));
  const [deletePrompt] = useDeletePromptMutation();
  const [publishTemplate] = usePublishTemplateMutation();
  const [invalidVariableMessage, setInvalidVariableMessage] = useState("");
  const token = useToken();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.currentUser);

  const spaceMono = Space_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-mono",
    weight: ["400"],
  });

  useEffect(() => {
    dispatch(setEngines(engines || []));
  }, [engines]);

  if (!slug) {
    redirectToPath("/404");
    return;
  }
  useEffect(() => {
    document.body.className = `${spaceMono.variable} font-sans`;
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }

    if (router.query.editor) {
      const { editor, ...restQueryParams } = router.query;

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
        setSelectedNodeData,
        setSelectedConnection,
        prompts,
        engines,
        nodeCount,
        setNodeCount,
        setNodesData,
        updateTemplateDependencies,
      );
    },
    [setSelectedNode, prompts, templateData],
  );

  const [ref, editor] = useRete(create);

  useEffect(() => {
    if (templateData) {
      const data = {
        title: templateData.title,
        description: templateData.description,
        example: templateData.example,
        thumbnail: templateData.thumbnail,
        is_visible: templateData.is_visible,
        language: templateData.language,
        category: templateData.category.id,
        difficulty: templateData.difficulty,
        duration: templateData.duration,
        status: templateData.status,
      };
      dataForRequest.current = data;
      setPrompts(templateData.prompts);

      dispatch(setTemplate(templateData));
      if (currentUser) {
        dispatch(setIsTemplateOwner(templateData?.created_by.id === currentUser?.id || currentUser?.is_admin));
      }
    }
  }, [templateData]);

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
          engine: node.engine,
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
    document.addEventListener("keydown", handleKeyboard);

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

    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [selectedNode]);

  useEffect(() => {
    if (!selectedNodeData) {
      return;
    }

    updateEditor();
    setNodesData(prevNodes =>
      prevNodes
        .filter(_node => _node.id !== selectedNodeData.id || _node.temp_id !== selectedNodeData.temp_id)
        .concat(selectedNodeData),
    );
  }, [selectedNodeData]);

  const handleKeyboard = async (e: KeyboardEvent) => {
    if (e.ctrlKey && e.code === "KeyN") {
      createNode();
    }
    if (selectedNode && e.code === "Delete") {
      setConfirmDialogOpen(true);
    }
  };

  const createNode = async (label: string = `Prompt #${nodeCount}`) => {
    const socket = new ClassicPreset.Socket("socket");
    const node = new Node(label);
    node.addInput("Input", new ClassicPreset.Input(socket, "Input"));
    node.addOutput("Output", new ClassicPreset.Output(socket, "Output"));
    node.engineIcon = engines?.find(eng => eng.id === 1)?.icon || "";
    node.editor = editor?.editor;
    node.area = editor?.area;
    node.resetNodeData = resetNodeData;

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
    node.temp_id = randomId();

    setNodesData(prev => [
      ...prev,
      {
        temp_id: node.temp_id,
        count: nodeCount.toString(),
        title: `Prompt #${nodeCount}`,
        content: "Describe here prompt parameters, for example {{name:text}} or {{age:number}}",
        engine: engines ? engines[0].id : 0,
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
      node.engineIcon = engines?.find(eng => eng.id === selectedNodeData.engine)?.icon || "";
      node.editor = editor?.editor;
      node.area = editor?.area;
      node.resetNodeData = resetNodeData;

      const allNodes = editor?.editor.getNodes();

      allNodes?.forEach(allNodesNode => {
        allNodesNode.selected = false;
        editor?.area.update("node", allNodesNode.id);
      });

      node.selected = true;
      node.count = nodeCount.toString();
      node.temp_id = randomId();

      await editor?.editor.addNode(node);
      await editor?.area.update("node", node.id);

      setSelectedNode(node);
      setNodeCount(prev => prev + 1);
      setNodesData(prev => [
        ...prev,
        {
          temp_id: node.temp_id,
          count: nodeCount.toString(),
          title: node.label,
          content: selectedNodeData.content,
          engine: selectedNodeData.engine,
          dependencies: [],
          parameters: selectedNodeData.parameters,
          order: selectedNodeData.order ?? 1,
          output_format: selectedNodeData.output_format,
          model_parameters: selectedNodeData.model_parameters,
          is_visible: selectedNodeData.is_visible,
          show_output: selectedNodeData.show_output,
          prompt_output_variable: `$temp_id_${node.temp_id}`,
        },
      ]);
    }
  };
  const resetNodeData = (selectedNode: Node | null = null) => {
    setSelectedNode(selectedNode);
    setSelectedNodeData(null);
  };

  const removeNode = async () => {
    setNodeCount(nodeCount - 1);

    const data = dataForRequest.current;

    const currentPrompt = dataForRequest.current.prompts_list.find((prompt: IEditPrompts) => {
      return prompt?.id?.toString() === selectedNode?.id || prompt?.temp_id === selectedNode?.temp_id;
    });

    // Remove the prompt from the backend
    if (currentPrompt?.id) {
      await deletePrompt(currentPrompt.id);
    }

    const allPrompts = data.prompts_list.filter((prompt: IEditPrompts) => {
      return prompt?.id?.toString() !== currentPrompt?.id?.toString() || prompt?.temp_id !== currentPrompt?.temp_id;
    });

    data.prompts_list = allPrompts;

    // remove the ID of the prompt from the dependencies of other prompts
    allPrompts.forEach((prompt: IEditPrompts) => {
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

    resetNodeData();
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

            setNodesData(prev => [...prev.filter(node => node.id !== targetNode?.id), targetNode as IEditPrompts]);
          }
          await editor?.removeConnection(selectedConnection);
          setSelectedConnection(null);
        }
      }
    }
  };

  const updateEditor = () => {
    if (!selectedNode || !selectedNodeData) return;

    const nodeId = Number(selectedNode.id) || Number(selectedNode.temp_id);
    if (nodeId !== selectedNodeData.id && nodeId !== selectedNodeData.temp_id) return;
    const engine = engines?.find(_engine => _engine.id === selectedNodeData.engine);

    if (selectedNode.label !== selectedNodeData.title || selectedNode.engineIcon !== engine?.icon) {
      selectedNode.label = selectedNodeData.title;
      selectedNode.engineIcon = engine?.icon || "";
      editor?.area.update("node", selectedNode.id);
    }
  };

  const updateTemplateDependencies = (id: string, dependsOn: string) => {
    const data = dataForRequest.current;
    const currentPrompt = dataForRequest.current.prompts_list?.find((prompt: IEditPrompts) => {
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
      dispatch(
        setToast({
          message: `You have entered an invalid prompt variable ${invalidVariableMessage}`,
          severity: "error",
          duration: 4000,
          position: { vertical: "bottom", horizontal: "right" },
        }),
      );
      return;
    }

    // remove duplicated dependencies in the prompts
    data.prompts_list?.forEach((prompt: IEditPrompts) => {
      prompt.dependencies = prompt.dependencies.filter((dependency: number, index: number, self: number[]) => {
        return self.indexOf(dependency) === index;
      });
    });

    function getOrder(node: IEditPrompts) {
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

    updateTemplate(templateData!.id, data).then(() => {
      dispatch(
        setToast({
          message: "Prompt template saved with success",
          severity: "success",
          duration: 3000,
          position: { vertical: "bottom", horizontal: "right" },
        }),
      );
      window.location.reload();
    });
  };

  const toggleTemplateDrawer = (open: boolean) => {
    setTemplateDrawerOpen(open);
  };

  const handlePublishTemplate = async () => {
    injectOrderAndSendRequest();
    await publishTemplate(templateData!.id);
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
              onSave={injectOrderAndSendRequest}
              templateSlug={templateData?.slug}
              onEditTemplate={() => toggleTemplateDrawer(true)}
              type={BUILDER_TYPE.ADMIN}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ flex: 1 }}
          >
            <Box
              height={"calc(100vh - 70.5px)"}
              bgcolor={"surface.5"}
              position="relative"
              sx={{
                backgroundImage: `radial-gradient(${alpha(theme.palette.grey[500], 0.5)} 1.3px, transparent 0)`,
                backgroundSize: "30px 30px",
                backgroundAttachment: "fixed",
                overflowY: "scroll",
              }}
            >
              <div
                ref={ref}
                style={{ height: "100%", width: "100%" }}
              ></div>
              {!!selectedNode && !!selectedNodeData && templateData && (
                <Zoom
                  in={true}
                  style={{
                    transitionDelay: "100ms",
                    width: "70%",
                    height: "68%",
                    position: "absolute",
                    top: "15%",
                    left: "15%",
                  }}
                >
                  <Stack
                    alignItems={"center"}
                    gap={3}
                  >
                    <DndProvider backend={HTML5Backend}>
                      <PromptCardAccordion
                        key={selectedNode.id ?? selectedNode.temp_id}
                        prompt={selectedNodeData}
                        order={0}
                        setPrompt={prompt => {
                          setSelectedNodeData(prompt);
                        }}
                        deletePrompt={() => setConfirmDialogOpen(true)}
                        duplicatePrompt={() => {
                          resetNodeData();
                          duplicateNode();
                        }}
                        prompts={nodesData}
                        movePrompt={() => {}}
                        findPromptIndex={() => 0}
                        builderType={BUILDER_TYPE.ADMIN}
                      />
                    </DndProvider>
                  </Stack>
                </Zoom>
              )}
              {!selectedNode && (
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
              )}
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
                  onClick={() => editor?.zoomAt(0.3)}
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
          {!!templateData && (
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
                  templateData={templateData}
                  darkMode
                  onSaved={() => window.location.reload()}
                  onClose={() => toggleTemplateDrawer(false)}
                />
              </Box>
            </SwipeableDrawer>
          )}
        </Grid>
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
      title: "Tree of Thoughts Builder",
      description: BUILDER_DESCRIPTION,
    },
  };
}

export default Builder;
