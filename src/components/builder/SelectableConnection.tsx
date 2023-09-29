import React from "react";
import { ClassicScheme, Presets } from "rete-react-render-plugin";
import styles from "@/styles/builder.module.css";
type SelectableConnectionProps = {
  data: ClassicScheme["Connection"] & {
    selected?: boolean;
    isLoop?: boolean;
  };
  click?: () => void;
};

export function SelectableConnection({ data, click }: SelectableConnectionProps) {
  const { path } = Presets.classic.useConnection();

  if (!path) return null;

  return (
    <svg
      className={styles.svg}
      onClick={click}
      data-testid="connection"
    >
      <path
        className={`${styles.path} ${data.selected ? styles.pathSelected : ""}`}
        d={path}
      />
    </svg>
  );
}
