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

  const cursorPosition = cursorPositionRef.current;
  let notTheLastIndex = cursorPosition < content.length - 1;

  let preset = "";

  if (type === "node") {
    const matchedNode = nodePresets.find(node => node.label === label);
    if (matchedNode) {
      preset = matchedNode.label;
      if (content.endsWith("$")) {
        preset = preset.substring(1);
      }
    }
  } else {
    const input = inputPresets.find(input => input.label === label);
    if (input) {
      const type = input.type;
      if (content.endsWith("{{")) {
        preset = `${input.label}:${type}:${input.required}${input.choices ? `:"${input.choices}"` : ""}}}`;
      } else {
        preset = `{{${input.label}:${type}:${input.required}${input.choices ? `:"${input.choices}"` : ""}}}`;
      }
    }
  }

  if (valueAfterRegex && valueAfterRegex !== "{{" && valueAfterRegex !== "$") {
    preset = preset.substring(valueAfterRegex.length);
  }

  const start = content.slice(0, cursorPosition);
  const end = content.slice(cursorPosition);

  let newValue = start + preset + " " + end;
  if (!firstAppend && !notTheLastIndex) {
    newValue = content + preset + " ";
  }
  onChange(newValue);

  cursorPositionRef.current = cursorPosition + preset.length;
};
