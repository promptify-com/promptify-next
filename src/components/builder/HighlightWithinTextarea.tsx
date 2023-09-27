import { MutableRefObject, useRef, useState } from "react";
import HighlightWithinTextarea, { Selection } from "react-highlight-within-textarea";
import { Grid } from "@mui/material";

import { addPreset } from "@/common/helpers/addPreset";
import { HighlightWithinTextareaRef, InputVariable, OutputVariable, Preset, PresetType } from "@/common/types/builder";
import { useCursorPosition } from "@/hooks/useCursorPosition";
import { SuggestionsList } from "./SuggestionsList";

interface Props {
  cursorPositionRef: MutableRefObject<number>;
  inputPresets: InputVariable[];
  outputPresets: OutputVariable[];
  content: string;
  onChange: (str: string, Selection?: Selection) => void;
  highlitedValue: string;
  setHighlitedValue: (str: string) => void;
}

const highlight = [
  {
    highlight: /{{(?!{)\S*?}}|{{/g,
    className: "input-variable",
  },
  {
    highlight: /\$[\w]*|\$/g,
    className: "output-variable",
  },
];

export const HighlightTextarea = ({
  inputPresets,
  outputPresets,
  cursorPositionRef,
  content,
  onChange,
  highlitedValue,
  setHighlitedValue,
}: Props) => {
  const [optionType, setOptionType] = useState<PresetType>("input");
  const [suggestionList, setSuggestionList] = useState<Preset[]>([]);
  const divRef = useRef<HighlightWithinTextareaRef | null>(null);

  const isSuggestionsVisible = Boolean(suggestionList.length > 0);
  const cursorPosition = useCursorPosition(divRef, isSuggestionsVisible);

  const showSuggestions = (value: string) => {
    let suggestions: Preset[] = [];
    let currentRegex = "";

    const cursorPosition = cursorPositionRef.current;
    const charBeforeCursor = value.charAt(cursorPosition - 1);
    const indexOfDoubleBrace = value.lastIndexOf("{{", cursorPosition);
    const indexOfDollarSign = value.lastIndexOf("$", cursorPosition);

    if (indexOfDoubleBrace > indexOfDollarSign) {
      suggestions = inputPresets;
      currentRegex = "{{";
      setOptionType("input");
    } else if (indexOfDoubleBrace < indexOfDollarSign && charBeforeCursor !== " ") {
      suggestions = outputPresets;
      currentRegex = "$";
      setOptionType("output");
    } else {
      return;
    }

    let start = indexOfDoubleBrace > indexOfDollarSign ? indexOfDoubleBrace + 2 : indexOfDollarSign + 1;
    let end = cursorPosition;

    const textAfterRegexValue = value.substring(start, end);

    if (textAfterRegexValue !== "") {
      suggestions = suggestions.filter(suggestion =>
        suggestion.label.toLowerCase().startsWith(textAfterRegexValue.toLowerCase()),
      );
    }

    let newVal = currentRegex + textAfterRegexValue;

    setHighlitedValue(newVal);
    setSuggestionList(suggestions);
  };

  const handleSuggestionSelect = (option: Preset) => {
    addPreset({
      type: optionType,
      label: option.label,
      outputPresets,
      inputPresets,
      onChange,
      hasValueAfterRegex: highlitedValue,
      cursorPositionRef,
      content,
    });

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
