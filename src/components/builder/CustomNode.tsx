import * as React from "react";
import { ClassicScheme, RenderEmit, Presets } from "rete-react-render-plugin";
import { Divider, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";

const { RefSocket } = Presets.classic;

type NodeExtraData = { width?: number; height?: number; engineIcon?: string };

const useStyles = makeStyles({
  nodeStyles: {
    width: 300,
    borderColor: "transparent",
    minHeight: 112,
    background: "#fdfbff",
    color: "#1b1b1e",
    border: "2px solid",
    borderRadius: 16,
    cursor: "pointer",
    boxShadow: `
      0px 6px 6px -3px rgba(225, 226, 236, 0.2),
      0px 10px 14px 1px rgba(225, 226, 236, 0.14),
      0px 4px 18px 3px rgba(27, 27, 30, 0.12)
    `,
  },
  selected: {
    borderColor: "black",
  },
  header: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Poppins",
    padding: 16,
    display: "flex",
    gap: 8,
    whiteSpace: "nowrap",
    overflowX: "hidden",
  },
  headerImg: {
    width: 24,
    height: 24,
    borderRadius: "50%",
  },
  hr: {
    border: "0.5px solid #e1e2ec",
    margin: 0,
  },
  body: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 8px",
  },
  ioContainer: {
    display: "flex",
    gap: 8,
    fontSize: 14,
  },
});

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

  const classes = useStyles();

  sortByIndex(inputs);
  sortByIndex(outputs);
  sortByIndex(controls);

  return (
    <Paper className={`${classes.nodeStyles} ${selected ? classes.selected : ""}`}>
      <div className={classes.header}>
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
      <div className={classes.body}>
        {inputs.map(
          ([key, input]) =>
            input && (
              <div
                className={classes.ioContainer}
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
                className={`${classes.ioContainer}`}
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
    </Paper>
  );
}
