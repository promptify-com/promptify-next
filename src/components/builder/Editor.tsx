import { type Dispatch, type SetStateAction } from "react";
import { createRoot } from "react-dom/client";
import { NodeEditor, GetSchemes, ClassicPreset, BaseSchemes, NodeId } from "rete";
import { AreaPlugin, AreaExtensions, Zoom } from "rete-area-plugin";
import { BidirectFlow, ConnectionPlugin } from "rete-connection-plugin";
import { ReactRenderPlugin, Presets, ReactArea2D } from "rete-react-render-plugin";
import { PromptCard } from "./PromptCard";
import { CustomSocket } from "./CustomSocket";
import { AutoArrangePlugin, Presets as ArrangePresets } from "rete-auto-arrange-plugin";
import { SelectableConnection } from "./SelectableConnection";
import { Prompts } from "@/core/api/dto/prompts";
import { IEditPrompts } from "@/common/types/builder";
import { Engine } from "@/core/api/dto/templates";

export class Node extends ClassicPreset.Node {
  width = 300;
  height = 112;
  count = "";
  temp_id = 0;
  engineIcon = "";
  editor?: NodeEditor<Schemes>;
  area?: AreaPlugin<Schemes, AreaExtra>;
  resetNodeData?: (node: Node | null) => void = () => {};
}

class Connection extends ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node> {
  selected?: boolean;
}
type Schemes = GetSchemes<Node, Connection>;
type AreaExtra = ReactArea2D<Schemes>;

export async function createEditor(
  container: HTMLElement,
  setSelectedNode: Dispatch<SetStateAction<Node | null>>,
  setSelectedNodeData: Dispatch<SetStateAction<IEditPrompts | null>>,
  setSelectedConnection: Dispatch<SetStateAction<string | null>>,
  prompts: Prompts[],
  engines: Engine[] | undefined,
  nodeCount: number,
  setNodeCount: Dispatch<SetStateAction<number>>,
  setNodesData: Dispatch<SetStateAction<IEditPrompts[]>>,
  updateTemplateDependencies: (val1: string, val2: string) => void,
) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactRenderPlugin<Schemes>({ createRoot });
  const arrange = new AutoArrangePlugin<Schemes>();
  const selector = AreaExtensions.selector();
  const accumulating = AreaExtensions.accumulateOnCtrl();
  let isLoaded = false;

  const setInitialNodes = async (id: string, prompt: Prompts) => {
    const initialParams = prompt.parameters?.map(param => {
      return {
        parameter_id: param.parameter.id,
        score: param.score,
        name: param.parameter.name,
        is_visible: param.is_visible,
        is_editable: param.is_editable,
        descriptions: param.parameter?.score_descriptions ?? param.descriptions,
      };
    });

    setNodesData(prev => [
      ...prev,
      {
        id: Number(id),
        count: nodeCount.toString(),
        title: prompt?.title || `Prompt #${nodeCount}`,
        content: prompt?.content || "Describe here prompt parameters, for example {{name:John Doe}}",
        engine: prompt?.engine?.id || engines![0].id,
        dependencies: prompt?.dependencies || [],
        parameters: initialParams,
        order: 1,
        output_format: prompt?.output_format,
        model_parameters: prompt?.model_parameters,
        is_visible: prompt?.is_visible,
        show_output: prompt?.show_output,
        prompt_output_variable: prompt?.prompt_output_variable,
      },
    ]);
  };

  const createNode = async (label: string, prompt: Prompts) => {
    const socket = new ClassicPreset.Socket("socket");
    const node = new Node(label);
    node.addInput("Input", new ClassicPreset.Input(socket, "Input"));
    node.addOutput("Output", new ClassicPreset.Output(socket, "Output"));
    node.editor = editor;
    node.area = area;
    node.resetNodeData = _node => {
      setSelectedNode(_node);
      setSelectedNodeData(null);
    };

    const allNodes = editor.getNodes();

    allNodes?.forEach(allNodesNode => {
      allNodesNode.selected = false;
      area.update("node", allNodesNode.id);
    });

    setNodeCount(nodeCount + 1);

    node.count = nodeCount.toString();

    if (prompt) {
      node.id = prompt.id.toString();
      node.engineIcon = prompt.engine.icon;
    }

    await editor.addNode(node);

    if (area) {
      AreaExtensions.zoomAt(area, editor.getNodes());
    }

    return { id: node.id };
  };

  // First, create all nodes
  const nodeCreationPromises = prompts.map((prompt: Prompts) => {
    return createNode(prompt.title, prompt).then(data => setInitialNodes(data.id, prompt));
  });

  // After all nodes have been created, create connections
  Promise.all(nodeCreationPromises).then(() => {
    const connectionPromises: Promise<any>[] = [];

    prompts.forEach(prompt => {
      const allNodes = editor.getNodes();

      const promptNode = allNodes?.filter(node => {
        return node?.id === prompt.id.toString();
      });

      if (prompt.dependencies) {
        prompt.dependencies.forEach(dependency => {
          const depNode = allNodes?.filter(node => {
            return node?.id === dependency.toString();
          });

          if (depNode?.length && promptNode?.length) {
            const connectionPromise = editor.addConnection(
              new ClassicPreset.Connection(depNode[0], "Output", promptNode[0], "Input"),
            );
            connectionPromises.push(connectionPromise);
          }
        });
      }
    });

    // Once all connections are added, arrange the layout
    Promise.all(connectionPromises).then(() => {
      arrange.layout();
      AreaExtensions.zoomAt(area, editor.getNodes(), { scale: 1 });
      isLoaded = true;
    });
  });

  AreaExtensions.selectableNodes(area, selector, { accumulating });

  area.addPipe(async context => {
    if (context.type === "connectioncreated" && isLoaded) {
      let target: any = context.data.target;
      let source: any = context.data.source;

      if (context.data.target.length > 3) {
        const node = editor.getNode(context.data.target);
        if (node) {
          target = node?.temp_id ? node.temp_id : node?.id;
        }
      }

      // if self connection ?
      if (target === source) {
        editor.removeConnection(context.data.id);
        return context;
      }

      // Filter connections list from duplicates
      const connections = await editor.getConnections();
      connections.forEach(async (conn, i, self) => {
        const validator = conn.source + conn.target;
        const existIndex = self.findIndex(checkConn => checkConn.source + checkConn.target === validator);
        if (i !== existIndex) {
          await editor.removeConnection(conn.id);
        }
      });

      updateTemplateDependencies(target, source);

      return context;
    }

    if (context.type === "pointerdown" || context.type === "nodepicked") {
      const allNodes = editor.getNodes();
      allNodes?.forEach(node => {
        node.selected = false;
        area.update("node", node.id);
      });
      setSelectedNode(null);
      setSelectedNodeData(null);
      setSelectedConnection(null);
    }

    return context;
  });

  arrange.addPreset(ArrangePresets.classic.setup());

  render.addPreset(
    Presets.classic.setup({
      area,
      customize: {
        // @ts-ignore
        node() {
          return PromptCard;
        },
        socket() {
          return CustomSocket;
        },
        connection() {
          return SelectableConnectionBind;
        },
      },
    }),
  );

  connection.addPreset(() => new BidirectFlow());
  area.area.setZoomHandler(new Zoom(0.05));

  editor.use(area);
  area.use(connection);
  area.use(render);
  area.use(arrange);

  AreaExtensions.simpleNodesOrder(area);

  const zoomAt = (k: number) => {
    AreaExtensions.zoomAt(area, editor.getNodes(), { scale: k });
  };

  function SelectableConnectionBind(props: { data: Schemes["Connection"] }) {
    const id = props.data.id;
    const label = "connection";

    return (
      <SelectableConnection
        {...props}
        click={() => {
          setSelectedConnection(id),
            selector.add(
              {
                id,
                label,
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                translate() {},
                unselect() {
                  props.data.selected = false;
                  area.update("connection", id);
                },
              },
              accumulating.active(),
            );
          props.data.selected = true;
          area.update("connection", id);
        }}
      />
    );
  }

  async function removeNodeWithConnections(editor: NodeEditor<BaseSchemes>, nodeId: NodeId) {
    for (const item of [...editor.getConnections()]) {
      if (item.source === nodeId || item.target === nodeId) {
        await editor.removeConnection(item.id);
      }
    }
    await editor.removeNode(nodeId);
  }

  return {
    destroy: () => area.destroy(),
    editor,
    zoomAt,
    area,
    arrange,
    removeSelected: async () => {
      for (const item of [...editor.getConnections()]) {
        if (item.selected) {
          await editor.removeConnection(item.id);
        }
      }
      for (const item of [...editor.getNodes()]) {
        if (item.selected) {
          await removeNodeWithConnections(editor, item.id);
        }
      }
    },
    removeConnection: async (connectionId: string) => {
      await editor.removeConnection(connectionId);
    },
  };
}
