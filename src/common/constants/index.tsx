import { ReactNode } from "react";
import {
  AutoAwesome,
  AutoAwesomeOutlined,
  HomeRounded,
  MenuBookRounded,
  RocketLaunchOutlined,
  Search,
  SettingsOutlined,
} from "@mui/icons-material/";

import { Prompt } from "@/assets/icons/prompts";
import { TemplateStatus } from "@/core/api/dto/templates";
import { DeploymentStatus } from "../types/deployments";
import { Model } from "@/common/types/deployments";

export interface MenuType {
  id: number;
  icon: ReactNode;
  name: string;
  href: string;
}

export const ProfileMenuItems: MenuType[] = [
  {
    id: 1,
    icon: <AutoAwesomeOutlined />,
    href: "/sparks",
    name: "My Sparks",
  },
  {
    id: 2,
    icon: <Prompt />,
    href: "/profile/#my-templates",
    name: "My Templates",
  },
  {
    id: 3,
    icon: <RocketLaunchOutlined />,
    href: "/deployments",
    name: "My Deployments",
  },
  {
    id: 4,
    icon: <SettingsOutlined />,
    href: "/profile",
    name: "Settings",
  },
];

export const links = [
  {
    label: "Homepage",
    icon: <HomeRounded />,
    href: "/",
    external: false,
  },
  {
    label: "Prompts",
    icon: <Search />,
    href: "/explore",
    external: false,
  },
  {
    label: "My Sparks",
    icon: <AutoAwesome />,
    href: "/sparks",
    external: false,
  },
  {
    label: "Learn",
    icon: <MenuBookRounded />,
    href: "https://blog.promptify.com/",
    external: true,
  },
];

export const TemplateStatusArray: TemplateStatus[] = ["ARCHIVED", "DRAFT", "PENDING_REVIEW", "PUBLISHED"];

export const DeploymentStatuses: DeploymentStatus[] = ["stopped", "created", "done", "deploying", "failed"];

export const Keywords: any[] = [
  {
    id: 1,
    name: "Essay",
  },
  {
    id: 2,
    name: "Management",
  },
  {
    id: 3,
    name: "Novel",
  },
  {
    id: 4,
    name: "Marketing",
  },
  {
    id: 5,
    name: "Kids Story",
  },
  {
    id: 6,
    name: "Recommendations",
  },
  {
    id: 7,
    name: "Social Media",
  },
];

export const LANGUAGES_CODE_MAPPING: Record<string, string> = {
  es: "Spanish",
  fr: "French",
  en: "English",
};

export enum CONNECTIONS {
  GOOGLE = "Google",
  WINDOWS = "Windows",
  LINKEDIN = "Linkedin",
  REDDIT = "Reddit",
  MICROSOFT = "Microsoft",
  GITHUB = "Github",
}

export enum BUILDER_TYPE {
  USER = "user",
  ADMIN = "admin",
}

export const models: Model[] = [
  {
    model: "aithos.model",
    pk: 0,
    fields: {
      model_id: "distilgpt2",
      name: "distilgpt2",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 1,
    fields: {
      model_id: "gpt2-large",
      name: "gpt2-large",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 2,
    fields: {
      model_id: "gpt2-medium",
      name: "gpt2-medium",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 3,
    fields: {
      model_id: "gpt2-xl",
      name: "gpt2-xl",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 4,
    fields: {
      model_id: "gpt2",
      name: "gpt2",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 5,
    fields: {
      model_id: "0xDEADBEA7/DialoGPT-small-rick",
      name: "0xDEADBEA7/DialoGPT-small-rick",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 6,
    fields: {
      model_id: "13on/gpt2-wishes",
      name: "13on/gpt2-wishes",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 7,
    fields: {
      model_id: "1Basco/DialoGPT-small-jake",
      name: "1Basco/DialoGPT-small-jake",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 8,
    fields: {
      model_id: "2early4coffee/DialoGPT-medium-deadpool",
      name: "2early4coffee/DialoGPT-medium-deadpool",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 9,
    fields: {
      model_id: "2early4coffee/DialoGPT-small-deadpool",
      name: "2early4coffee/DialoGPT-small-deadpool",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 10,
    fields: {
      model_id: "2gud/DialogGPT-small-Koopsbot",
      name: "2gud/DialogGPT-small-Koopsbot",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 11,
    fields: {
      model_id: "ABBHISHEK/DialoGPT-small-harrypotter",
      name: "ABBHISHEK/DialoGPT-small-harrypotter",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 12,
    fields: {
      model_id: "AIDynamics/DialoGPT-medium-MentorDealerGuy",
      name: "AIDynamics/DialoGPT-medium-MentorDealerGuy",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 13,
    fields: {
      model_id: "AJ/DialoGPT-small-ricksanchez",
      name: "AJ/DialoGPT-small-ricksanchez",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 14,
    fields: {
      model_id: "AJ/rick-discord-bot",
      name: "AJ/rick-discord-bot",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 15,
    fields: {
      model_id: "AJ-Dude/DialoGPT-small-harrypotter",
      name: "AJ-Dude/DialoGPT-small-harrypotter",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 16,
    fields: {
      model_id: "AK270802/DialoGPT-small-harrypotter",
      name: "AK270802/DialoGPT-small-harrypotter",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 17,
    fields: {
      model_id: "ATGdev/DialoGPT-small-harrypotter",
      name: "ATGdev/DialoGPT-small-harrypotter",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
  {
    model: "aithos.model",
    pk: 18,
    fields: {
      model_id: "AVeryRealHuman/DialoGPT-small-TonyStark",
      name: "AVeryRealHuman/DialoGPT-small-TonyStark",
      source: "Hugging Face",
      task: "text-generation",
    },
  },
];
