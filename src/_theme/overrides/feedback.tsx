import { alpha, type Theme } from "@mui/material/styles";
import { gray, orange } from "../palette";

/* eslint-disable import/prefer-default-export */
export const feedbackCustomizations = {
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: 10,
        backgroundColor: orange[100],
        color: theme.palette.text.primary,
        border: `1px solid ${alpha(orange[300], 0.5)}`,
        "& .MuiAlert-icon": {
          color: orange[500],
        },
        ...theme.applyStyles("dark", {
          backgroundColor: `${alpha(orange[900], 0.5)}`,
          border: `1px solid ${alpha(orange[800], 0.5)}`,
        }),
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          border: "1px solid",
          borderColor: theme.palette.divider,
        },
      }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        height: 8,
        borderRadius: 8,
        backgroundColor: gray[200],
        ...theme.applyStyles("dark", {
          backgroundColor: gray[800],
        }),
      }),
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: { m: 8, fontSize: 12, backgroundColor: "black", color: "white" },
      arrow: {
        color: "black",
      },
    },
  },
};
