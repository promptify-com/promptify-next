import { alpha, type Theme } from "@mui/material/styles";
import { buttonBaseClasses, dividerClasses, menuItemClasses, tabClasses } from "@mui/material";
//
import { gray, brand } from "@/_theme/palette";

/* eslint-disable import/prefer-default-export */
export const navigationCustomizations = {
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: 6,
        padding: "6px 12px",
        margin: "0 8px",
        [`&.${menuItemClasses.focusVisible}`]: {
          backgroundColor: "transparent",
        },
        [`&.${menuItemClasses.selected}`]: {
          [`&.${menuItemClasses.focusVisible}`]: {
            backgroundColor: alpha(theme.palette.action.selected, 0.3),
          },
        },
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      list: {
        gap: "0px",
        [`&.${dividerClasses.root}`]: {
          margin: "0 -8px",
        },
      },
      paper: ({ theme }: { theme: Theme }) => ({
        marginTop: "4px",
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        backgroundImage: "none",
        background: "hsl(0, 0%, 100%)",
        boxShadow: "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
        [`& .${buttonBaseClasses.root}`]: {
          "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.action.selected, 0.3),
          },
        },
        ...theme.applyStyles("dark", {
          background: gray[900],
          boxShadow: "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px",
        }),
      }),
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: theme.shape.borderRadius,
        border: "1px solid",
        borderColor: gray[200],
        backgroundColor: theme.palette.background.paper,
        boxShadow: `inset 0 1px 0 1px hsla(220, 0%, 100%, 0.6), inset 0 -1px 0 1px hsla(220, 35%, 90%, 0.5)`,
        "&:hover": {
          borderColor: gray[300],
          backgroundColor: theme.palette.background.paper,
          boxShadow: "none",
        },
        "&:before, &:after": {
          display: "none",
        },
        ...theme.applyStyles("dark", {
          borderRadius: theme.shape.borderRadius,
          borderColor: gray[700],
          backgroundColor: theme.palette.background.paper,
          boxShadow: `inset 0 1px 0 1px ${alpha(gray[700], 0.15)}, inset 0 -1px 0 1px hsla(220, 0%, 0%, 0.7)`,
          "&:hover": {
            borderColor: alpha(gray[700], 0.7),
            backgroundColor: theme.palette.background.paper,
            boxShadow: "none",
          },
          "&:before, &:after": {
            display: "none",
          },
        }),
      }),
      select: ({ theme }: { theme: Theme }) => ({
        display: "flex",
        alignItems: "center",
        ...theme.applyStyles("dark", {
          display: "flex",
          alignItems: "center",
          "&:focus-visible": {
            backgroundColor: gray[900],
          },
        }),
      }),
    },
  },
  MuiLink: {
    defaultProps: {
      underline: "none",
    },
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        color: theme.palette.text.primary,
        fontWeight: 500,
        position: "relative",
        textDecoration: "none",
        width: "fit-content",
        "&:hover::before": {
          width: 0,
        },
        "&:focus-visible": {
          outline: `3px solid ${alpha(brand[500], 0.5)}`,
          outlineOffset: "4px",
          borderRadius: "2px",
        },
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.background.default,
      }),
    },
  },
  MuiPaginationItem: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        "&.Mui-selected": {
          color: "white",
          backgroundColor: theme.palette.grey[900],
        },
        ...theme.applyStyles("dark", {
          "&.Mui-selected": {
            color: "black",
            backgroundColor: theme.palette.grey[50],
          },
        }),
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: { minHeight: "fit-content" },
      indicator: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.grey[800],
        ...theme.applyStyles("dark", {
          backgroundColor: theme.palette.grey[200],
        }),
      }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        padding: "6px 8px",
        marginBottom: "8px",
        textTransform: "none",
        minWidth: "fit-content",
        minHeight: "fit-content",
        color: theme.palette.text.secondary,
        borderRadius: theme.shape.borderRadius,
        border: "1px solid",
        borderColor: "transparent",
        ":hover": {
          color: theme.palette.text.primary,
          backgroundColor: gray[100],
          borderColor: gray[200],
        },
        [`&.${tabClasses.selected}`]: {
          color: gray[900],
        },
        ...theme.applyStyles("dark", {
          ":hover": {
            color: theme.palette.text.primary,
            backgroundColor: gray[800],
            borderColor: gray[700],
          },
          [`&.${tabClasses.selected}`]: {
            color: "#fff",
          },
        }),
      }),
    },
  },
  MuiStepConnector: {
    styleOverrides: {
      line: ({ theme }: { theme: Theme }) => ({
        borderTop: "1px solid",
        borderColor: theme.palette.divider,
        flex: 1,
        borderRadius: "99px",
      }),
    },
  },
  MuiStepIcon: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        color: "transparent",
        border: `1px solid ${gray[400]}`,
        width: 12,
        height: 12,
        borderRadius: "50%",
        "& text": {
          display: "none",
        },
        "&.Mui-active": {
          border: "none",
          color: theme.palette.primary.main,
        },
        "&.Mui-completed": {
          border: "none",
          color: theme.palette.success.main,
        },
        ...theme.applyStyles("dark", {
          border: `1px solid ${gray[700]}`,
          "&.Mui-active": {
            border: "none",
            color: theme.palette.primary.light,
          },
          "&.Mui-completed": {
            border: "none",
            color: theme.palette.success.light,
          },
        }),
        variants: [
          {
            props: { completed: true },
            style: {
              width: 12,
              height: 12,
            },
          },
        ],
      }),
    },
  },
  MuiStepLabel: {
    styleOverrides: {
      label: ({ theme }: { theme: Theme }) => ({
        "&.Mui-completed": {
          opacity: 0.6,
          ...theme.applyStyles("dark", { opacity: 0.5 }),
        },
      }),
    },
  },
};
