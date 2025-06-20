import { MutableRefObject, useEffect, useRef, useState } from "react";
import HighlightWithinTextarea, { Selection } from "react-highlight-within-textarea";
import { Grid } from "@mui/material";
import { addPreset } from "@/common/helpers/addPreset";
import {
  BuilderType,
  HighlightWithinTextareaRef,
  IEditPrompts,
  InputVariable,
  OutputVariable,
  Preset,
  PresetType,
} from "@/common/types/builder";
import { useCursorPosition } from "@/hooks/useCursorPosition";
import SuggestionsList from "./SuggestionsList";
import ClientOnly from "../base/ClientOnly";
import SuggestionsListDetailed from "./SuggestionsListDetailed";
import { InputType } from "@/common/types/prompt";
import { highlight } from "@/common/constants";

interface Props {
  prompt: IEditPrompts;
  cursorPositionRef: MutableRefObject<number>;
  inputPresets: InputVariable[];
  outputPresets: OutputVariable[];
  onChange: (str: string, Selection?: Selection) => void;
  highlightedValue: string;
  setHighlightedValue: (str: string) => void;
  type: BuilderType;
}

function HighlightTextarea({
  prompt,
  inputPresets,
  outputPresets,
  cursorPositionRef,
  onChange,
  highlightedValue,
  setHighlightedValue,
  type,
}: Props) {
  const [optionType, setOptionType] = useState<PresetType>("input");
  const [suggestionList, setSuggestionList] = useState<Preset[]>([]);
  const divRef = useRef<HighlightWithinTextareaRef | null>(null);
  const cursorPosition = useCursorPosition(divRef, highlightedValue);

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
      suggestions = outputPresets.filter(output => output.label !== prompt.prompt_output_variable);
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
        suggestion.label.toLowerCase().includes(textAfterRegexValue.toLowerCase()),
      );
    }

    let newVal = currentRegex + textAfterRegexValue;

    setHighlightedValue(newVal);
    setSuggestionList(suggestions);
  };

  const handleSuggestionSelect = (option: Preset, type: PresetType) => {
    addPreset({
      type: type,
      label: option.label,
      outputPresets,
      inputPresets,
      onChange,
      hasValueAfterRegex: highlightedValue,
      cursorPositionRef,
      content: prompt.content,
    });

    setHighlightedValue("");
    setSuggestionList([]);
  };

  const handleTypeSelect = (type: InputType) => {
    const _newSugg: Preset = {
      label: `${highlightedValue.slice(0, highlightedValue.indexOf(":") + 1) + type}}}`,
    };
    handleSuggestionSelect(_newSugg, "input");
  };

  const previousOutputs = outputPresets.slice(
    0,
    outputPresets.findIndex(preset => preset.label === prompt.prompt_output_variable),
  );

  return (
    <ClientOnly>
      <Grid
        sx={{
          height: "100%",
          overflow: "auto",
          overscrollBehavior: "contain",
        }}
      >
        <HighlightWithinTextarea
          ref={divRef}
          value={prompt.content}
          highlight={highlight}
          placeholder="Write Prompt instructions here"
          stripPastedStyles
          onChange={(newValue, selection) => {
            newValue = newValue.replace(/\{\{([^{}]*?)\}\}/g, (match, group) => `{{${group.replace(/\s+/g, "")}}}`);
            onChange(newValue, selection);
            showSuggestions(newValue);
          }}
        />
        {type === "admin" ? (
          <SuggestionsList
            suggestionList={suggestionList}
            position={cursorPosition}
            optionType={optionType}
            onSelect={option => handleSuggestionSelect(option, optionType)}
          />
        ) : (
          <SuggestionsListDetailed
            highlightValue={highlightedValue}
            suggestionList={suggestionList}
            position={cursorPosition}
            optionType={optionType}
            onSelect={handleSuggestionSelect}
            previousPresets={previousOutputs}
            setType={handleTypeSelect}
          />
        )}
      </Grid>
    </ClientOnly>
  );
}

export default HighlightTextarea;
