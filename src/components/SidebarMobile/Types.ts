import { type ReactNode } from "react";

export type SidebarType = "navigation" | "profile";

export interface Link {
  label: string;
  icon: ReactNode;
  href: string;
  active: boolean;
  external: boolean;
}

export interface ProfileLink {
  id: number;
  icon: ReactNode;
  name: string;
  href: string;
}
