import * as React from "react";
import { ClassicScheme, RenderEmit, Presets } from "rete-react-render-plugin";
import Divider from "@mui/material/Divider";
import Settings from "@mui/icons-material/Settings";

import styles from "@/styles/builder.module.css";

const { RefSocket } = Presets.classic;

type NodeExtraData = {
  width?: number;
  height?: number;
  engineIcon?: string;
  editor?: any;
  area?: any;
  resetNodeData?: (node: Props<ClassicScheme>["data"] | null) => void;
};
type Props<S extends ClassicScheme> = {
  data: S["Node"] & NodeExtraData;
  styles?: () => any;
  emit: RenderEmit<S>;
};

export type NodeComponent<Scheme extends ClassicScheme> = (props: Props<Scheme>) => JSX.Element;

function sortByIndex<T extends [string, undefined | { index?: number }][]>(entries: T) {
  entries.sort((a, b) => {
    const ai = a[1]?.index || 0;
    const bi = b[1]?.index || 0;

    return ai - bi;
  });
}

export function PromptCard<Scheme extends ClassicScheme>(props: Props<Scheme>) {
  const node = props.data;
  const inputs = Object.entries(node.inputs);
  const outputs = Object.entries(node.outputs);
  const controls = Object.entries(node.controls);
  const selected = node.selected || false;
  const { id, label, engineIcon } = node;

  sortByIndex(inputs);
  sortByIndex(outputs);
  sortByIndex(controls);

  return (
    <div className={`${styles.nodeStyles} ${selected ? styles.selected : ""}`}>
      <div className={styles.header}>
        <div>
          <img
            src={engineIcon}
            alt={label}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
          {label}
        </div>
        <Settings
          sx={{ cursor: "pointer" }}
          onPointerDown={e => {
            e.stopPropagation();

            const allNodes = node.editor?.getNodes() as Props<Scheme>["data"][];
            allNodes?.forEach(allNodesNode => {
              allNodesNode.selected = false;
              node.area?.update("node", allNodesNode.id);
            });

            node.selected = true;
            node.area?.update("node", node.id);
            node.resetNodeData?.(node);
          }}
        />
      </div>
      <Divider
        sx={{
          "&::before, &::after": {
            borderColor: "#e1e2ec",
          },
        }}
      />
      <div className={styles.body}>
        {inputs.map(
          ([key, input]) =>
            input && (
              <div
                className={styles.ioContainer}
                key={key}
                data-testid={`input-${key}`}
              >
                <RefSocket
                  name="input-socket"
                  emit={props.emit}
                  side="input"
                  socketKey={key}
                  nodeId={id}
                  payload={input.socket}
                />
                {input && (!input.control || !input.showControl) && (
                  <div
                    className="input-title"
                    data-testid="input-title"
                  >
                    {input?.label}
                  </div>
                )}
              </div>
            ),
        )}
        {outputs.map(
          ([key, output]) =>
            output && (
              <div
                className={`${styles.ioContainer}`}
                key={key}
                data-testid={`output-${key}`}
              >
                <div
                  className="output-title"
                  data-testid="output-title"
                >
                  {output?.label}
                </div>
                <RefSocket
                  name="output-socket"
                  side="output"
                  emit={props.emit}
                  socketKey={key}
                  nodeId={id}
                  payload={output.socket}
                />
              </div>
            ),
        )}
      </div>
    </div>
  );
}
