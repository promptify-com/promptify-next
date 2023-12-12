import { ReactNode } from "react";
import {
  Api,
  AutoAwesome,
  AutoAwesomeOutlined,
  ChatBubbleOutline,
  HomeRounded,
  InfoOutlined,
  MenuBookRounded,
  RocketLaunchOutlined,
  Search,
  SettingsOutlined,
  Tune,
} from "@mui/icons-material/";

import { Prompt } from "@/assets/icons/prompts";
import { TemplateStatus } from "@/core/api/dto/templates";
import { InputType } from "@/common/types/prompt";
import { DeploymentStatus } from "../types/deployments";
import { Link } from "../types/TemplateToolbar";
import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import ExtensionSettingsIcon from "@/assets/icons/ExtensionSettingsIcon";

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
    name: "My works",
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

export const deploymentStatuses: DeploymentStatus[] = ["stopped", "created", "done", "deploying", "failed"];

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

export const BuilderInputTypes: InputType[] = ["text", "number", "integer", "code", "choices", "file"];

export const ToolbarItems: Link[] = [
  {
    name: "customize",
    icon: <Tune />,
    title: "Customize",
  },

  {
    name: "executions",
    icon: <NoteStackIcon />,
    title: "My Works",
  },
  {
    name: "feedback",
    icon: <ChatBubbleOutline />,
    title: "Feedback",
  },
  {
    name: "api",
    icon: <Api />,
    title: "API access",
  },
  {
    name: "extension",
    icon: <ExtensionSettingsIcon />,
    title: "Extension settings",
  },
  {
    name: "details",
    icon: <InfoOutlined />,
    title: "Template details",
  },
];

export const OUTPUT_FORMATS = ["JSON", "XML", "Markdown", "Custom"] as const;

export type OutputFormat = (typeof OUTPUT_FORMATS)[number];
