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
  highlitedValue: string;
  setHighlitedValue: (str: string) => void;
}

interface IHandlePreset {
  type: PresetType | null;
  label: string;
}

const highlight = [
  {
    highlight: /{{(?!{)\S*?}}|{{/g,
    className: "input-variable",
  },
  {
    highlight: /\$[\w]*|\$/g, // Highlight $ followed by word characters or $
    className: "output-variable",
  },
];

export const HighlightTextarea = ({
  inputPresets,
  nodePresets,
  cursorPositionRef,
  content,
  onChange,
  highlitedValue,
  setHighlitedValue,
}: Props) => {
  const [optionType, setOptionType] = useState<PresetType | null>(null);

  const [suggestionList, setSuggestionList] = useState<IVariable[]>([]);
  const isSuggestionsVisible = Boolean(suggestionList.length > 0);

  const divRef = useRef<HighlightWithinTextareaRef | null>(null);
  const cursorPosition = useCursorPosition(divRef, isSuggestionsVisible);

  const showSuggestions = (value: string) => {
    let suggestionListArr: IVariable[] = [];
    let currentRgx = "";

    const indexOfDoubleBrace = value.lastIndexOf("{{", cursorPositionRef.current);
    const indexOfDollarSign = value.lastIndexOf("$", cursorPositionRef.current);

    if (indexOfDoubleBrace > indexOfDollarSign) {
      suggestionListArr = inputPresets;
      currentRgx = "{{";
      setOptionType("input");
    } else if (indexOfDoubleBrace < indexOfDollarSign) {
      suggestionListArr = nodePresets;
      currentRgx = "$";
      setOptionType("node");
    }

    let start = indexOfDoubleBrace > indexOfDollarSign ? indexOfDoubleBrace + 2 : indexOfDollarSign + 1;
    let end = cursorPositionRef.current;

    const textAfterRegexValue = value.substring(start, end);

    if (textAfterRegexValue !== "") {
      suggestionListArr = suggestionListArr.filter(suggestion =>
        suggestion.label.toLowerCase().includes(textAfterRegexValue.toLowerCase()),
      );
    }

    let newVal = currentRgx + textAfterRegexValue;

    setHighlitedValue(newVal);
    setSuggestionList(suggestionListArr);
  };

  const handlePreset = ({ type, label }: IHandlePreset) => {
    addPreset({
      type,
      label,
      nodePresets,
      inputPresets,
      onChange,
      valueAfterRegex: highlitedValue,
      cursorPositionRef,
      content,
    });
  };

  const handleSuggestionSelect = (option: IVariable) => {
    handlePreset({ type: optionType, label: option.label });
    setOptionType(null);
    setHighlitedValue("");
    setSuggestionList([]);
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
