import { ReactNode } from "react";
import Tune from "@mui/icons-material/Tune";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import Search from "@mui/icons-material/Search";
import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined";
import MenuBookRounded from "@mui/icons-material/MenuBookRounded";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import HomeRounded from "@mui/icons-material/HomeRounded";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import Api from "@mui/icons-material/Api";
import { Prompt } from "@/assets/icons/Prompt";
import { TemplateStatus } from "@/core/api/dto/templates";
import { InputType } from "@/common/types/prompt";
import { DeploymentStatus } from "../types/deployments";
import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import ExtensionSettingsIcon from "@/assets/icons/ExtensionSettingsIcon";
import { Link } from "@/components/Prompt/Types";

export interface MenuType {
  id: number;
  icon: ReactNode;
  name: string;
  href: string;
}

export const BLOG_URL = "https://blog.promptify.com/";

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
    href: BLOG_URL,
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

export const TemplateSidebarLinks: Link[] = [
  {
    name: "customize",
    icon: <Tune />,
    title: "Customize",
  },
  {
    name: "clone",
    icon: <Tune />,
    title: "Clone",
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

export const LCL_STR_KEY = "promptify:";
export const COOKIE_STR_KEY = "promptify_";

export const outputFormatOptions = ["JSON", "XML", "Markdown", "Custom"];

export const SEO_TITLE = "Promptify - Boost Your Creativity";
export const SEO_DESCRIPTION =
  "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.";
export const AUTOMATION_DESCRIPTION =
  "Discover advanced Generative AI that combine sophisticated prompt templates, set of instructions, extra knowledge, and any combination of skills.";
export const BUILDER_DESCRIPTION =
  "Structure your prompts for a productive and more deterministic AI. Your chained prompts will guide AI content creation with focus and intent.";
