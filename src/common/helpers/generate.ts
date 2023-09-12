import { QuestionAnswerParams, TemplateQuestionGeneratorData } from "@/core/api/dto/prompts";
import { Templates } from "@/core/api/dto/templates";
import { fetchEventSource } from "@microsoft/fetch-event-source";

function replacePlaceholders(text: string) {
  return text.replace(/{{/g, "[[").replace(/}}/g, "]]");
}

const generateData = ({
  template,
  isValidatingAnswer,
  payload,
}: {
  template: Templates | null;
  isValidatingAnswer: boolean;
  payload?: QuestionAnswerParams;
}) => {
  let data: TemplateQuestionGeneratorData[];

  if (template) {
    const modifiedTemplate = {
      ...template,
      prompts: template.prompts.map(prompt => ({
        id: prompt.id,
        order: prompt.order,
        title: prompt.title,
        execution_priority: prompt.execution_priority,
        content: replacePlaceholders(prompt.content),
        parameters: [],
      })),
    };
    if (isValidatingAnswer && payload) {
      data = [
        {
          prompt: 1796,
          contextual_overrides: [],
          prompt_params: payload,
        },
      ];
    } else {
      data = [
        {
          prompt: 1795,
          contextual_overrides: [],
          prompt_params: {
            TemplateData: {
              id: modifiedTemplate.id,
              title: modifiedTemplate.title,
              //@ts-ignore
              description: modifiedTemplate.description,
              prompts: modifiedTemplate.prompts,
            },
          },
        },
      ];
    }

    return data;
  }
};

export const generate = ({
  template,
  token,
  isValidatingAnswer = false,
  payload,
}: {
  template: Templates | null;
  token: string;
  isValidatingAnswer?: boolean;
  payload?: QuestionAnswerParams;
}) => {
  const data: TemplateQuestionGeneratorData[] | undefined = generateData({
    template,
    isValidatingAnswer,
    payload,
  });

  if (template) {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/${isValidatingAnswer ? "516" : "515"}/execute/`;
    let markdownData = [];
    fetchEventSource(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      openWhenHidden: true,

      async onopen(res) {
        if (res.ok && res.status === 200) {
          console.log("connection made", res);
        }
      },
      onmessage(msg) {
        try {
          markdownData.push(msg.data);
          // console.log(msg.data);
        } catch (error) {
          console.error(error);
        }
      },
    });
  }
};
