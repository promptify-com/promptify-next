import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAnswers, setParamsValues } from "@/core/store/chatSlice";
import useVariant from "@/components/Prompt/Hooks/useVariant";
import Storage from "@/common/storage";
import ParamSlider from "@/components/Prompt/Common/Chat/ParamSlider";
import ParamButtons from "@/components/Chat/ParamButtons";
import type { PromptParams, ResOverrides } from "@/core/api/dto/prompts";
import type { IAnswer } from "@/components/Prompt/Types/chat";

interface GeneratorParamProps {
  param: PromptParams;
  variant: "slider" | "button";
}

export default function FormParam({ param, variant }: GeneratorParamProps) {
  const dispatch = useAppDispatch();
  const { isAutomationPage } = useVariant();

  const { paramsValues, answers } = useAppSelector(state => state.chat);

  useEffect(() => {
    const paramsStored = Storage.get("paramsValue") as unknown as ResOverrides[];

    if (!paramsStored || isAutomationPage) return;

    const isRelevantParam = paramsStored.some((paramStored: ResOverrides) => paramStored.id === param.prompt);

    if (isRelevantParam) {
      dispatch(setParamsValues(paramsStored));
      Storage.remove("paramsValue");
    }
  }, []);

  const handleScoreChange = (score: number) => {
    const inputName = param.parameter.name;
    const _answers = [...answers.filter(answer => answer.inputName !== inputName)];

    const newAnswer: IAnswer = {
      inputName: inputName,
      parameter: param.parameter,
      question: "",
      required: false,
      answer: score,
      prompt: param.prompt,
    };

    _answers.push(newAnswer);
    dispatch(setAnswers(_answers));

    const paramId = param.parameter.id;
    const updatedParamsValues = paramsValues.map(paramValue => {
      if (paramValue.id !== param.prompt) {
        return paramValue;
      }

      return {
        id: paramValue.id,
        contextual_overrides: paramValue.contextual_overrides.map(ctx =>
          ctx.parameter === paramId ? { parameter: paramId, score } : ctx,
        ),
      };
    });

    dispatch(setParamsValues(updatedParamsValues));
  };

  return (
    <>
      {variant === "slider" ? (
        <ParamSlider
          param={param}
          onChange={handleScoreChange}
        />
      ) : (
        <ParamButtons
          param={param}
          onChange={handleScoreChange}
        />
      )}
    </>
  );
}
