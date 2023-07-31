import { Prompt } from "@/assets/icons/prompts";
import { Setting } from "@/assets/icons/setting";
import {
  AutoAwesome,
  HomeRounded,
  MenuBookRounded,
  Search,
} from "@mui/icons-material";
import { ReactNode } from "react";

export interface MenuType {
  id: number;
  icon: ReactNode;
  name: string;
  href: string;
}

export const Menu: MenuType[] = [
  {
    id: 1,
    icon: <Prompt />,
    href: "/profile/templates",
    name: "My Templates",
  },
  {
    id: 2,
    icon: <AutoAwesome />,
    href: "/profile",
    name: "My Sparks",
  },
  {
    id: 3,
    icon: <Setting />,
    href: "/profile/edit",
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
