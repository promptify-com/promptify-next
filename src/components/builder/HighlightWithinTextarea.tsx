import { MutableRefObject, useRef, useState } from "react";
import HighlightWithinTextarea, { Selection } from "react-highlight-within-textarea";
import { Grid } from "@mui/material";

import { addPreset } from "@/common/helpers/addPreset";
import { HighlightWithinTextareaRef, InputVariable, PresetType } from "@/common/types/builder";
import { IVariable } from "@/common/types/prompt";
import { useCursorPosition } from "@/hooks/useCursorPosition";
import { SuggestionsList } from "./SuggestionsList";

interface Props {
  cursorPositionRef: MutableRefObject<number>;
  inputPresets: InputVariable[];
  nodePresets: IVariable[];
  content: string;
  onChange: (str: string, Selection?: Selection) => void;
}

interface IHandlePreset {
  type: PresetType | null;
  label: string;
  firstAppend?: boolean;
}

const highlight = [
  {
    highlight: /{{.*?}}|{{/g, // Highlight {{ or {{ followed by any characters inside
    className: "input-variable",
  },
  {
    highlight: /\$[\w]*|\$/g, // Highlight $ followed by word characters or $
    className: "output-variable",
  },
];

export const HighlightTextarea = ({ inputPresets, nodePresets, cursorPositionRef, content, onChange }: Props) => {
  const [optionType, setOptionType] = useState<PresetType | null>(null);
  const [highlightedOption, setHighlightedOption] = useState("");

  const [suggestionList, setSuggestionList] = useState<IVariable[]>([]);
  const isSuggestionsVisible = Boolean(suggestionList.length > 0);

  const divRef = useRef<HighlightWithinTextareaRef | null>(null);
  const cursorPosition = useCursorPosition(divRef, isSuggestionsVisible);

  const showSuggestions = (value: string) => {
    let suggestionListArr: IVariable[] = [];
    let textAfterRegexValue = "";

    const cursorPosition = cursorPositionRef.current;

    const indexOfDoubleBrace = value.lastIndexOf("{{", cursorPosition);
    const indexOfDollarSign = value.lastIndexOf("$", cursorPosition);

    if (indexOfDoubleBrace > indexOfDollarSign) {
      suggestionListArr = inputPresets;
      setOptionType("input");
      textAfterRegexValue = value.substring(indexOfDoubleBrace + 2, cursorPosition);
    } else {
      suggestionListArr = nodePresets;
      setOptionType("node");
      textAfterRegexValue = value.substring(indexOfDollarSign + 1, cursorPosition);
    }

    if (textAfterRegexValue.trim() !== "") {
      suggestionListArr = suggestionListArr.filter(suggestion =>
        suggestion.label.toLowerCase().includes(textAfterRegexValue.toLowerCase()),
      );
    }

    let highlightedOptionValue = `${optionType === "input" ? "{{" : "$"}${textAfterRegexValue}`;
    setHighlightedOption(highlightedOptionValue);
    setSuggestionList(suggestionListArr);
  };

  const handlePreset = ({ type, label, firstAppend }: IHandlePreset) => {
    addPreset({
      type,
      label,
      firstAppend,
      nodePresets,
      inputPresets,
      onChange,
      valueAfterRegex: highlightedOption,
      cursorPositionRef,
      content,
    });
  };

  const handleSuggestionSelect = (option: IVariable) => {
    handlePreset({ type: optionType, label: option.label });
    setHighlightedOption("");
    setSuggestionList([]);
    setOptionType(null);
  };

  return (
    <Grid>
      <HighlightWithinTextarea
        ref={divRef}
        value={content}
        highlight={highlight}
        placeholder="..."
        stripPastedStyles
        onChange={(newValue, selection) => {
          onChange(newValue, selection);
          showSuggestions(newValue);
        }}
      />
      <SuggestionsList
        suggestionList={suggestionList}
        position={cursorPosition}
        optionType={optionType}
        onSelect={handleSuggestionSelect}
      />
    </Grid>
  );
};
