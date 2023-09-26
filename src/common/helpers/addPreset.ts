import { MutableRefObject } from "react";
import { InputVariable, PresetType } from "../types/builder";
import { IVariable } from "../types/prompt";

interface AddPresetParams {
  type: PresetType | null;
  label: string;
  firstAppend?: boolean;
  nodePresets: IVariable[];
  inputPresets: InputVariable[];
  valueAfterRegex?: string;
  content: string;
  cursorPositionRef: MutableRefObject<number>;
  onChange: (str: string) => void;
}

export const addPreset = ({
  type,
  label,
  firstAppend = true,
  nodePresets,
  inputPresets,
  valueAfterRegex,
  content,
  cursorPositionRef,
  onChange,
}: AddPresetParams) => {
  if (!label) return;

  const input = inputPresets.find(input => input.label === label);
  const matchedNode = nodePresets.find(node => node.label === label);
  const cursorPosition = cursorPositionRef.current;

  let preset = "";

  if (type === "node") {
    preset = matchedNode ? matchedNode.label : "";
  } else if (input) {
    const { type, required, choices, label } = input;
    preset = `{{${label}:${type}:${required}${choices ? `:"${choices}"` : ""}}}`;
  }

  let start = content.slice(0, cursorPosition);
  if (valueAfterRegex) {
    start = start.slice(0, -valueAfterRegex.length);
  }
  let end = content.slice(cursorPosition);
  let newValue = start + " " + preset + " " + end;

  onChange(newValue);
  cursorPositionRef.current = cursorPosition + preset.length + 1;
};
