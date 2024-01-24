import { Fragment, useCallback, useState, memo } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useDrop } from "react-dnd";
import Add from "@mui/icons-material/Add";
import PromptCardAccordion from "@/components/builder/PromptCardAccordion";
import { promptComputeDomId, randomId } from "@/common/helpers";
import { useDeletePromptMutation } from "@/core/api/templates";
import { DeleteDialog } from "@/components/dialog/DeleteDialog";
import { useScrollToElement } from "@/hooks/useScrollToElement";
import { BUILDER_TYPE } from "@/common/constants";
import type { IEditPrompts } from "@/common/types/builder";
import BuilderPromptPlaceholder from "@/components/placeholders/BuilderPromptPlaceholder";
import { useAppSelector } from "@/hooks/useStore";

interface Props {
  prompts: IEditPrompts[];
  setPrompts: (prompts: IEditPrompts[]) => void;
  templateLoading: boolean;
}
function PromptList({ prompts, setPrompts, templateLoading }: Props) {
  const [promptToDelete, setPromptToDelete] = useState<IEditPrompts | null>(null);
  const [deletePrompt] = useDeletePromptMutation();

  const engines = useAppSelector(state => state.builder.engines);

  const setSmoothScrollTarget = useScrollToElement("smooth");

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
      const _promptsCopy = [...prompts];

      const targetPromptOrder = _promptsCopy.splice(index, 1);
      _promptsCopy.splice(atIndex, 0, targetPromptOrder[0]);

      const reorderedPrompts = _promptsCopy.map((prompt, index) => ({ ...prompt, order: index + 1 }));
      setPrompts(reorderedPrompts);
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

  const createPrompt = (order: number) => {
    const textEngine = engines.find(engine => engine.output_type === "TEXT");
    const temp_id = randomId();
    const _newPrompt = {
      temp_id: temp_id,
      title: `Prompt #${order}`,
      content: "Describe here prompt parameters, for example {{name:text}} or {{age:number}}",
      engine: textEngine?.id || 0,
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
    if (prompts.length) {
      _prompts = prompts
        .map((prompt, i) => {
          i++;
          if (i === order - 1) {
            return [prompt, _newPrompt];
          }
          return prompt;
        })
        .flat();
    }

    setPrompts(_prompts);
    setSmoothScrollTarget(`#${promptComputeDomId(_newPrompt)}`);
  };

  const duplicatePrompt = (duplicatedPrompt: IEditPrompts, order: number) => {
    const duplicateData = prompts.find(
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
      engine: duplicateData.engine,
      dependencies: duplicateData.dependencies,
      parameters: duplicateData.parameters,
      order: order,
      output_format: duplicateData.output_format,
      model_parameters: duplicateData.model_parameters,
      is_visible: duplicateData.is_visible,
      show_output: duplicateData.show_output,
      prompt_output_variable: `$temp_id_${temp_id}`,
    };

    const _prompts: IEditPrompts[] = prompts
      .map((prompt, i) => {
        i++;
        if (i === order - 1) {
          return [prompt, _newPrompt];
        }
        return prompt;
      })
      .flat();

    setPrompts(_prompts);
  };

  const removePrompt = async () => {
    if (!promptToDelete) return;

    if (promptToDelete.id) {
      await deletePrompt(promptToDelete.id);
    }

    const _prompts = prompts.filter(
      prompt => promptToDelete.id !== prompt.id || promptToDelete.temp_id !== prompt.temp_id,
    );

    setPrompts(_prompts);
    setPromptToDelete(null);
  };

  return (
    <>
      {templateLoading ? (
        <Stack gap={"16px"}>
          <BuilderPromptPlaceholder count={2} />
        </Stack>
      ) : (
        <Stack
          ref={drop}
          alignItems={"center"}
          gap={3}
        >
          {prompts.length ? (
            prompts.map((prompt, index) => {
              index++; // start from 1
              return (
                <Fragment key={index}>
                  <Box
                    width={"100%"}
                    id={promptComputeDomId({ title: prompt.title })}
                  >
                    <PromptCardAccordion
                      prompt={prompt}
                      order={index}
                      setPrompt={changePrompt}
                      deletePrompt={() => setPromptToDelete(prompt)}
                      duplicatePrompt={() => duplicatePrompt(prompt, index + 1)}
                      prompts={prompts}
                      movePrompt={movePrompt}
                      findPromptIndex={findPromptIndex}
                      builderType={BUILDER_TYPE.USER}
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
              open={true}
              dialogTitle="Delete Prompt"
              dialogContentText={`Are you sure you want to delete ${promptToDelete.title || "this prompt"}?`}
              onClose={() => setPromptToDelete(null)}
              onSubmit={removePrompt}
            />
          )}
        </Stack>
      )}
    </>
  );
}

export default memo(PromptList);
