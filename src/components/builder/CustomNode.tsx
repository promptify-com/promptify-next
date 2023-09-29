import * as React from "react";
import { ClassicScheme, RenderEmit, Presets } from "rete-react-render-plugin";
import { Divider, Paper } from "@mui/material";

import styles from "@/styles/builder.module.css";

const { RefSocket } = Presets.classic;

type NodeExtraData = { width?: number; height?: number; engineIcon?: string };

function sortByIndex<T extends [string, undefined | { index?: number }][]>(entries: T) {
  entries.sort((a, b) => {
    const ai = a[1]?.index || 0;
    const bi = b[1]?.index || 0;

    return ai - bi;
  });
}

type Props<S extends ClassicScheme> = {
  data: S["Node"] & NodeExtraData;
  styles?: () => any;
  emit: RenderEmit<S>;
};
export type NodeComponent<Scheme extends ClassicScheme> = (props: Props<Scheme>) => JSX.Element;

export function CustomNode<Scheme extends ClassicScheme>(props: Props<Scheme>) {
  const inputs = Object.entries(props.data.inputs);
  const outputs = Object.entries(props.data.outputs);
  const controls = Object.entries(props.data.controls);
  const selected = props.data.selected || false;
  const { id, label, engineIcon } = props.data;

  sortByIndex(inputs);
  sortByIndex(outputs);
  sortByIndex(controls);

  return (
    <div className={`${styles.nodeStyles} ${selected ? styles.selected : ""}`}>
      <div className={styles.header}>
        <img
          src={engineIcon}
          alt={label}
          loading="lazy"
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
          }}
        />
        {label}
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
