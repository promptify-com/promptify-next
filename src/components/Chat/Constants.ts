import { ChatOption } from "@/components/Prompt/Types/chat";

interface ChatOptionData {
  imagePath: string;
  label: string;
  hint: string;
  type: ChatOption;
}

export const CHAT_OPTIONS: ChatOptionData[] = [
  {
    imagePath: "@/pages/chat/images/QA.png",
    label: "Complete questionary",
    hint: "Easy for new users",
    type: "QA",
  },

  {
    imagePath: "@/pages/chat/images/fill_prompt.png",
    label: "Fill prompt instructions",
    hint: "Better for advanced users",
    type: "FORM",
  },
];
