import type { Theme } from "@mui/material/styles";

/* eslint-disable import/prefer-default-export */
export const inputsCustomizations = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "unset",
        whiteSpace: "nowrap",
        boxShadow: "unset",
        borderRadius: "21px",
        padding: "7px 20px",
        transition: "all .15s",
        "&:hover": {
          backgroundColor: "transparent",
          boxShadow: "unset",
        },
      },
      contained: {
        backgroundColor: (theme: Theme) => theme.palette.primary.main,
        border: (theme: Theme) => `1px solid ${theme.palette.primary.main}`,
        color: (theme: Theme) => theme.palette.common.white,
        fontWeight: 600,
        "&:hover": {
          color: (theme: Theme) => theme.palette.primary.main,
        },
      },
      outlined: {
        borderColor: (theme: Theme) => theme.palette.grey[400],
        color: (theme: Theme) => theme.palette.common.black,
        fontWeight: 500,
        "&:hover": {
          color: (theme: Theme) => theme.palette.primary.main,
        },
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        color: (theme: Theme) => theme.palette.common.black,
        fontSize: 14,
        fontWeight: 500,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        boxShadow: "none",
        textTransform: "none",
        letterSpacing: 0,
        // color: gray[400],
        // borderColor: gray[200],
        // backgroundColor: alpha(gray[50], 0.4),
        "&:hover": {
          backgroundColor: "transparent",
          // borderColor: gray[300],
          // color: gray[800],
        },
        "&:active": {
          // color: gray[800],
          // backgroundColor: gray[200],
        },
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        textDecoration: "none",
        color: "inherit",
      },
    },
  },
};
