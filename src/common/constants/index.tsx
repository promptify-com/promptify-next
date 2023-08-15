import { ReactNode } from "react";
import {
  AutoAwesome,
  HomeRounded,
  MenuBookRounded,
  Search,
} from "@mui/icons-material";

import { Prompt } from "@/assets/icons/prompts";
import { Setting } from "@/assets/icons/setting";
import { TemplateStatus } from "@/core/api/dto/templates";

export interface MenuType {
  id: number;
  icon: ReactNode;
  name: string;
  href: string;
}

export const Menu: MenuType[] = [
  {
    id: 1,
    icon: <Setting />,
    href: "/profile",
    name: "Settings",
  },
  {
    id: 2,
    icon: <AutoAwesome />,
    href: "/sparks",
    name: "My Sparks",
  },
  {
    id: 3,
    icon: <Prompt />,
    href: "/profile/#my-templates",
    name: "My Templates",
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
    label: "Browse",
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

export const TemplateStatusArray: TemplateStatus[] = [
  "ARCHIVED",
  "DRAFT",
  "PENDING_REVIEW",
  "PUBLISHED",
];
