import { Fragment, useCallback, useState, memo, useRef } from "react";
import { PromptCardAccordion } from "@/components/builder/PromptCardAccordion";
import { IEditPrompts } from "@/common/types/builder";
import { useDrop } from "react-dnd";
import { Box, Button, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { randomId } from "@/common/helpers";
import { Engine } from "@/core/api/dto/templates";

interface Props {
  initPrompts: IEditPrompts[];
  setPromptsData: (prompts: IEditPrompts[]) => void;
  engines: Engine[];
}
const PromptList = ({ initPrompts, setPromptsData, engines }: Props) => {
  const [prompts, setPrompts] = useState<IEditPrompts[]>(initPrompts);
  const promptsData = useRef(initPrompts);

  const [, drop] = useDrop(() => ({ accept: "prompt" }));
  const findPromptIndex = useCallback(
    (id: number) => {
      let promptIndex = 0;

      prompts.find((prompt, idx) => {
        promptIndex = idx;
        return prompt.id === id || prompt.temp_id === id;
      });

      return promptIndex;
    },
    [prompts],
  );
  const movePrompt = useCallback(
    (id: number, atIndex: number) => {
      const index = findPromptIndex(id);
      let _prompts = promptsData.current;

      const targetPromptOrder = _prompts.splice(index, 1);
      _prompts.splice(atIndex, 0, targetPromptOrder[0]);

      _prompts = _prompts.map((prompt, index) => ({ ...prompt, order: index + 1 }));

      promptsData.current = _prompts;
      setPrompts(_prompts);
      setPromptsData(_prompts);
    },
    [findPromptIndex, prompts],
  );

  const changePrompt = (prompt: IEditPrompts) => {
    const _prompts = promptsData.current.map(prevPrompt => {
      if (
        (prompt.id && prevPrompt.id && prompt.id === prevPrompt.id) ||
        (prompt.temp_id && prevPrompt.temp_id && prompt.temp_id === prevPrompt.temp_id)
      ) {
        return prompt;
      }
      return prevPrompt;
    });

    promptsData.current = _prompts;
    setPromptsData(_prompts);
  };

  const createPrompt = (order: number) => {
    const temp_id = randomId();
    const _newPrompt = {
      temp_id: temp_id,
      title: `Prompt #${order}`,
      content: "Describe here prompt parameters, for example {{name:text}} or {{age:number}}",
      engine_id: engines ? engines[0]?.id : 0,
      dependencies: [],
      parameters: [],
      order: order,
      output_format: "",
      model_parameters: null,
      is_visible: true,
      show_output: true,
      prompt_output_variable: `$temp_id_${temp_id}`,
    };

    let _prompts: IEditPrompts[] = [_newPrompt];
    if (promptsData.current.length) {
      _prompts = promptsData.current
        .map(prompt => {
          if (prompt.order === order - 1) {
            return [prompt, _newPrompt];
          }
          if (prompt.order >= order) {
            return { ...prompt, order: prompt.order + 1 };
          }
          return prompt;
        })
        .flat();
    }

    promptsData.current = _prompts;
    setPrompts(_prompts);
    setPromptsData(_prompts);
  };

  const duplicatePrompt = (duplicatedPrompt: IEditPrompts) => {
    const duplicateData = promptsData.current.find(
      prompt =>
        (duplicatedPrompt.id && prompt.id && duplicatedPrompt.id === prompt.id) ||
        (duplicatedPrompt.temp_id && prompt.temp_id && duplicatedPrompt.temp_id === prompt.temp_id),
    );
    if (!duplicateData) return;

    const temp_id = randomId();
    const _newPrompt = {
      ...duplicateData,
      temp_id: temp_id,
      title: `${duplicateData.title} - Copy`,
      order: duplicateData.order + 1,
      dependencies: [],
    };

    const _prompts: IEditPrompts[] = promptsData.current
      .map(prompt => {
        if (prompt.order === duplicatedPrompt.order) {
          return [prompt, _newPrompt];
        }
        if (prompt.order >= _newPrompt.order) {
          return { ...prompt, order: prompt.order + 1 };
        }
        return prompt;
      })
      .flat();

    promptsData.current = _prompts;
    setPrompts(_prompts);
    setPromptsData(_prompts);
  };

  const deletePrompt = (deletePrompt: IEditPrompts) => {
    const _prompts = promptsData.current
      .filter(
        prompt =>
          (deletePrompt.id && prompt.id && deletePrompt.id !== prompt.id) ||
          (deletePrompt.temp_id && prompt.temp_id && deletePrompt.temp_id !== prompt.temp_id),
      )
      .map(prompt => {
        if (prompt.order > deletePrompt.order) {
          return { ...prompt, order: prompt.order - 1 };
        }
        return prompt;
      });

    promptsData.current = _prompts;
    setPrompts(_prompts);
    setPromptsData(_prompts);
  };

  return (
    <Stack
      ref={drop}
      alignItems={"center"}
      gap={3}
    >
      {prompts.length ? (
        prompts.map((prompt, i) => {
          const order = i + 2;
          return (
            <Fragment key={i}>
              <Box width={"100%"}>
                <PromptCardAccordion
                  key={prompt.id}
                  prompt={prompt}
                  setPrompt={changePrompt}
                  deletePrompt={() => deletePrompt(prompt)}
                  duplicatePrompt={() => duplicatePrompt(prompt)}
                  prompts={prompts}
                  engines={engines}
                  movePrompt={movePrompt}
                  findPromptIndex={findPromptIndex}
                />
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  bgcolor: "surface.1",
                  color: "text.primary",
                  p: "6px 16px",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  ":hover": {
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => createPrompt(order)}
              >
                New prompt
              </Button>
            </Fragment>
          );
        })
      ) : (
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            mt: "20svh",
            bgcolor: "surface.1",
            color: "text.primary",
            p: "6px 16px",
            border: "none",
            fontSize: 14,
            fontWeight: 500,
            ":hover": {
              bgcolor: "action.hover",
            },
          }}
          onClick={() => createPrompt(1)}
        >
          New prompt
        </Button>
      )}
    </Stack>
  );
};

export default memo(PromptList);
