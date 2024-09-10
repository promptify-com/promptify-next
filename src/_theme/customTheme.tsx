export interface CustomTheme {
  defaultSidebarWidth: string;
  leftClosedSidebarWidth: string;
  headerHeight: {
    xs: string;
    md: string;
  };
  promptBuilder: {
    headerHeight: string;
    drawerWidth: string;
  };
}

export const customTheme: CustomTheme = {
  defaultSidebarWidth: "240px",
  leftClosedSidebarWidth: "72px",
  headerHeight: {
    xs: "64px",
    md: "72px",
  },
  promptBuilder: {
    headerHeight: "64px",
    drawerWidth: "320px",
  },
};
export default customTheme;
