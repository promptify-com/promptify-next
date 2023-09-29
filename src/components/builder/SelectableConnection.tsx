import React from "react";
import { ClassicScheme, Presets } from "rete-react-render-plugin";
import { makeStyles } from "@mui/styles";

type SelectableConnectionProps = {
  data: ClassicScheme["Connection"] & {
    selected?: boolean;
    isLoop?: boolean;
  };
  click?: () => void;
};

export function SelectableConnection({ data, click }: SelectableConnectionProps) {
  const useStyles = makeStyles({
    svg: {
      overflow: "visible !important",
      position: "absolute",
      pointerEvents: "none",
    },
    path: {
      fill: "none",
      strokeWidth: "3px",
      stroke: data.selected ? "red" : "#1B1B1E",
      pointerEvents: "auto",
    },
  });
  const { path } = Presets.classic.useConnection();
  const classes = useStyles();

  if (!path) return null;

  return (
    <svg
      className={classes.svg}
      onClick={click}
      data-testid="connection"
    >
      <path
        className={classes.path}
        d={path}
      />
    </svg>
  );
}
