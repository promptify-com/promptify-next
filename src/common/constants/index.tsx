import { ReactNode } from "react";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import HomeRounded from "@mui/icons-material/HomeRounded";
import MenuBookRounded from "@mui/icons-material/MenuBookRounded";
import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined";
import Search from "@mui/icons-material/Search";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import { Prompt } from "@/assets/icons/prompts";
import { TemplateStatus } from "@/core/api/dto/templates";
import { InputType } from "@/common/types/prompt";
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
