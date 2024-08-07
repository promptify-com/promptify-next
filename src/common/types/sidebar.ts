import { type SxProps } from "@mui/material";

export interface NavItem {
  name: string;
  href: string;
  icon: React.JSX.Element;
  active: boolean;
  external: boolean;
  reload: boolean;
  sx?: SxProps;
}
