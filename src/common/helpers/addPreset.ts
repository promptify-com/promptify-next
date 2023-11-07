import { MutableRefObject } from "react";
import { InputVariable, OutputVariable, PresetType } from "../types/builder";

interface AddPresetParams {
  type: PresetType;
  label: string;
  outputPresets: OutputVariable[];
  inputPresets: InputVariable[];
  hasValueAfterRegex?: string;
  content: string;
  cursorPositionRef: MutableRefObject<number>;
  onChange: (str: string) => void;
}

function findFirstSpaceIndex(text: string, cursorPosition: number) {
  const regex = /(\{\{|\$)\w+/g;
  let match;
  let lastMatch;
  while ((match = regex.exec(text)) && match.index <= cursorPosition) {
    lastMatch = match;
  }

  if (lastMatch) {
    const spaceIndex = text.indexOf(" ", lastMatch.index + lastMatch[0].length);
    if (spaceIndex !== -1) {
      return spaceIndex;
    }
  }
  return -1;
}

export const addPreset = ({
  type,
  label,
  outputPresets,
  inputPresets,
  hasValueAfterRegex,
  content,
  cursorPositionRef,
  onChange,
}: AddPresetParams) => {
  if (!label) return;

  const cursorPosition = cursorPositionRef.current;

  let preset = "";

  if (type === "output") {
    const output = outputPresets.find(node => node.label === label);
    preset = output ? output.label : "";
  } else {
    const input = inputPresets.find(input => input.label === label);
    if (input) {
      const { label, type, required, choices, fileExtensions } = input;
      const options = type === "choices" ? choices : type === "file" ? fileExtensions : undefined;
      preset = `{{${label}:${type}:${required}${options ? `:${options}` : ""}}}`;
    } else {
      const _var = label.slice(2, label.indexOf(":"));
      const _type = label.slice(label.indexOf(":") + 1, label.indexOf("}}"));
      const choices = _type === "choices" ? ":1,2,3" : _type === "file" ? ":pdf,docx,txt" : "";
      preset = `{{${_var}:${_type}:true${choices}}}`;
    }
  }

  let start = content.slice(0, cursorPosition);
  let end = content.slice(cursorPosition);

  let isCursorWithinVar = findFirstSpaceIndex(content, cursorPosition) > cursorPosition;

  if (hasValueAfterRegex) {
    start = start.slice(0, -hasValueAfterRegex.length);
  }
  if (isCursorWithinVar) {
    end = content.slice(findFirstSpaceIndex(content, cursorPosition));
  }

  const addSpace = isCursorWithinVar ? "" : " ";

  let newValue = start + preset + addSpace + end;

  onChange(newValue);
  cursorPositionRef.current = cursorPosition + preset.length + 1;
};
