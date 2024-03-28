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
    label: "Complete questionary",
    hint: "Easy for new users",
    type: "qa",
  },

  {
    imagePath: "@/pages/chat/images/fill_prompt.png",
    label: "Fill prompt instructions",
    hint: "Better for advanced users",
    type: "form",
  },
];
