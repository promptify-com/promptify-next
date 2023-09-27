import { MutableRefObject } from "react";
import { InputVariable, PresetType } from "../types/builder";
import { IVariable } from "../types/prompt";

interface AddPresetParams {
  type: PresetType | null;
  label: string;
  nodePresets: IVariable[];
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
  nodePresets,
  inputPresets,
  hasValueAfterRegex,
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
