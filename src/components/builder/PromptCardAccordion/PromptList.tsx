import { Fragment, useCallback, useState, memo, MutableRefObject } from "react";
import { PromptCardAccordion } from "@/components/builder/PromptCardAccordion";
import { IEditPrompts } from "@/common/types/builder";
import { useDrop } from "react-dnd";
import { Box, Button, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { randomId } from "@/common/helpers";
import { Engine } from "@/core/api/dto/templates";
import { useDeletePromptMutation } from "@/core/api/templates";
import { DeleteDialog } from "@/components/dialog/DeleteDialog";

interface Props {
  promptsRefData: MutableRefObject<IEditPrompts[]>;
  engines: Engine[];
}
const PromptList = ({ promptsRefData, engines }: Props) => {
  const [promptsList, setPromptsList] = useState<IEditPrompts[]>(promptsRefData.current);
  const [promptToDelete, setPromptToDelete] = useState<IEditPrompts | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePrompt] = useDeletePromptMutation();

  const [, drop] = useDrop(() => ({ accept: "prompt" }));
  const findPromptIndex = useCallback(
    (id: number) => {
      let promptIndex = 0;

      promptsList.find((prompt, idx) => {
        promptIndex = idx;
        return prompt.id === id || prompt.temp_id === id;
      });

      return promptIndex;
    },
    [promptsList],
  );
  const movePrompt = useCallback(
    (id: number, atIndex: number) => {
      const index = findPromptIndex(id);
      let _prompts = promptsRefData.current;

      const targetPromptOrder = _prompts.splice(index, 1);
      _prompts.splice(atIndex, 0, targetPromptOrder[0]);

      _prompts = _prompts.map((prompt, index) => ({ ...prompt, order: index + 1 }));

      promptsRefData.current = _prompts;
      setPromptsList(_prompts);
    },
    [findPromptIndex, promptsList],
  );

  const changePrompt = (prompt: IEditPrompts) => {
    const _prompts = promptsRefData.current.map(prevPrompt => {
      if (
        (prompt.id && prevPrompt.id && prompt.id === prevPrompt.id) ||
        (prompt.temp_id && prevPrompt.temp_id && prompt.temp_id === prevPrompt.temp_id)
      ) {
        return prompt;
      }
      return prevPrompt;
    });

    promptsRefData.current = _prompts;
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
    if (promptsRefData.current.length) {
      _prompts = promptsRefData.current
        .map((prompt, i) => {
          i++;
          if (i === order - 1) {
            return [prompt, _newPrompt];
          }
          return prompt;
        })
        .flat();
    }

    promptsRefData.current = _prompts;
    setPromptsList(_prompts);
  };

  const duplicatePrompt = (duplicatedPrompt: IEditPrompts, order: number) => {
    const duplicateData = promptsRefData.current.find(
      prompt =>
        (duplicatedPrompt.id && prompt.id && duplicatedPrompt.id === prompt.id) ||
        (duplicatedPrompt.temp_id && prompt.temp_id && duplicatedPrompt.temp_id === prompt.temp_id),
    );
    if (!duplicateData) return;

    const temp_id = randomId();
    const _newPrompt = {
      temp_id: temp_id,
      title: `${duplicateData.title} - Copy`,
      content: duplicateData.content,
      engine_id: duplicateData.engine_id,
      dependencies: duplicateData.dependencies,
      parameters: duplicateData.parameters,
      order: order,
      output_format: duplicateData.output_format,
      model_parameters: duplicateData.model_parameters,
      is_visible: duplicateData.is_visible,
      show_output: duplicateData.show_output,
      prompt_output_variable: `$temp_id_${temp_id}`,
    };

    const _prompts: IEditPrompts[] = promptsRefData.current
      .map((prompt, i) => {
        i++;
        if (i === order - 1) {
          return [prompt, _newPrompt];
        }
        return prompt;
      })
      .flat();

    promptsRefData.current = _prompts;
    setPromptsList(_prompts);
  };

  const removePrompt = async () => {
    if (!promptToDelete) return;

    if (promptToDelete.id) {
      await deletePrompt(promptToDelete.id);
    }

    const _prompts = promptsRefData.current.filter(
      prompt => promptToDelete.id !== prompt.id || promptToDelete.temp_id !== prompt.temp_id,
    );

    setPromptToDelete(null);
    promptsRefData.current = _prompts;
    setPromptsList(_prompts);
  };

  return (
    <Stack
      ref={drop}
      alignItems={"center"}
      gap={3}
    >
      {promptsList.length ? (
        promptsList.map((prompt, index) => {
          index++; // start from 1
          return (
            <Fragment key={index}>
              <Box width={"100%"}>
                <PromptCardAccordion
                  key={prompt.id ?? prompt.temp_id}
                  prompt={prompt}
                  order={index}
                  setPrompt={changePrompt}
                  deletePrompt={() => {
                    setPromptToDelete(prompt);
                    setDeleteConfirm(true);
                  }}
                  duplicatePrompt={() => duplicatePrompt(prompt, index + 1)}
                  prompts={promptsList}
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
                onClick={() => createPrompt(index + 1)}
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
      {promptToDelete && (
        <DeleteDialog
          open={deleteConfirm}
          dialogTitle="Delete Prompt"
          dialogContentText={`Are you sure you want to delete ${promptToDelete.title || "this prompt"}?`}
          onClose={() => setDeleteConfirm(false)}
          onSubmit={async () => {
            await removePrompt();
            setDeleteConfirm(false);
          }}
        />
      )}
    </Stack>
  );
};

export default memo(PromptList);
