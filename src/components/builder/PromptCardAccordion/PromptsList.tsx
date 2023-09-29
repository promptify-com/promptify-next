import { Fragment, useCallback, useEffect, useState, memo } from "react";
import { PromptCardAccordion } from "@/components/builder/PromptCardAccordion";
import { IEditPrompts } from "@/common/types/builder";
import { useDrop } from "react-dnd";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { promptRandomId } from "@/common/helpers";
import { Engine } from "@/core/api/dto/templates";

const PromptList = ({ initPrompts, engines }: { initPrompts: IEditPrompts[]; engines: Engine[] }) => {
  const [prompts, setPrompts] = useState<IEditPrompts[]>(initPrompts);
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

      setPrompts(prevOrders => {
        const targetPromptOrder = prevOrders.splice(index, 1);
        prevOrders.splice(atIndex, 0, targetPromptOrder[0]);

        const newPromptsOrders = prevOrders.map((prompt, index) => ({ ...prompt, order: index + 1 }));

        return newPromptsOrders;
      });
    },
    [findPromptIndex, prompts],
  );

  const changePrompt = (prompt: IEditPrompts) => {
    const _prompts = prompts.map(prevPrompt => {
      if (
        (prompt.id && prevPrompt.id && prompt.id === prevPrompt.id) ||
        (prompt.temp_id && prevPrompt.temp_id && prompt.temp_id === prevPrompt.temp_id)
      ) {
        return prompt;
      }
      return prevPrompt;
    });

    setPrompts(_prompts);
  };
  const createPrompt = useCallback((order: number) => {
    const temp_id = promptRandomId();
    const _newPrompt = {
      temp_id: temp_id,
      title: `Prompt #${order}`,
      content: "Describe here prompt parameters, for example {{name:text}} or {{age:number}}",
      engine_id: engines ? engines[0].id : 0,
      dependencies: [],
      parameters: [],
      order: order,
      output_format: "",
      model_parameters: null,
      is_visible: true,
      show_output: true,
      prompt_output_variable: `$temp_id_${temp_id}`,
    };

    if (!prompts.length) {
      setPrompts([_newPrompt]);
      return;
    }

    const _prompts: IEditPrompts[] = prompts
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

    setPrompts(_prompts);
  }, []);

  return (
    <div ref={drop}>
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
    </div>
  );
};

export default memo(PromptList);
