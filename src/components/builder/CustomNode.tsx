import { PromptIcon } from "@/assets/icons";
import { Avatar } from "@mui/material";
import * as React from "react";
import { ClassicScheme, RenderEmit, Presets } from "rete-react-render-plugin";
import styled from "styled-components";

const { RefSocket } = Presets.classic;

type NodeExtraData = { width?: number; height?: number; engine?: string };

export const NodeStyles = styled.div<NodeExtraData & { selected: boolean; styles?: (props: any) => any }>`
  width: 300px;
  height: 112px;
  background: #fdfbff;
  color: #1b1b1e;
  border: 2px solid;
  border-color: ${props => (props.selected ? `black` : "transparent")};
  border-radius: 16px;
  cursor: pointer;
  box-shadow:
    0px 6px 6px -3px rgba(225, 226, 236, 0.2),
    0px 10px 14px 1px rgba(225, 226, 236, 0.14),
    0px 4px 18px 3px rgba(27, 27, 30, 0.12);
  .header {
    font-size: 16px;
    font-weight: 500;
    font-family: Poppins;
    padding: 16px;
    display: flex;
    gap: 8px;
  }
  .header img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  hr {
    border: 0.5px solid #e1e2ec;
    margin: 0;
  }
  .body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 8px;
  }
  .input,
  .output {
    display: flex;
    gap: 8px;
    font-size: 14px;
  }
  .input-socket [title="socket"],
  .output-socket [title="socket"] {
    height: 12px;
    width: 12px;
    background: #e1e2ec;
    border: none;
  }
  ${props => props.styles && props.styles(props)}
`;

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
  const { id, label, width, height, engine } = props.data;

  sortByIndex(inputs);
  sortByIndex(outputs);
  sortByIndex(controls);

  return (
    <NodeStyles
      selected={selected}
      styles={props.styles}
      data-testid="node"
    >
      <div className="header">
        <img
          src={engine}
          alt={label}
          loading="lazy"
        />
        {label}
      </div>
      <hr />
      <div className="body">
        {inputs.map(
          ([key, input]) =>
            input && (
              <div
                className="input"
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
                className="output"
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
    </NodeStyles>
  );
}
