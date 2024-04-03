import { ChatOption } from "@/core/api/dto/chats";

interface ChatOptionData {
  imagePath: string;
  label: string;
  hint: string;
  type: ChatOption;
}

export const CHAT_OPTIONS: ChatOptionData[] = [
  {
    imagePath: "@/pages/chat/images/QA.png",
    label: "Questionnaire",
    hint: "Easy for new users",
    type: "qa",
  },

  {
    imagePath: "@/pages/chat/images/fill_prompt.png",
    label: "Input form",
    hint: "Better for advanced users",
    type: "form",
  },
];
export const CHAT_OPTIONS_MAPPING = {
  qa: CHAT_OPTIONS[0].label,
  form: CHAT_OPTIONS[1].label,
};
