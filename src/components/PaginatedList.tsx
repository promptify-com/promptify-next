import React, { FC, ReactNode } from "react";
import { Button, Grid } from "@mui/material";

interface PaginatedListProps {
  children: ReactNode;
  hasNext?: boolean;
  hasPrev?: boolean;
  loading: boolean;
  onNextPage: () => void;
  onPrevPage?: () => void;
  canBeShown?: boolean;
  buttonText?: string;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  variant?: "text" | "contained" | "outlined";
}

const PaginatedList: FC<PaginatedListProps> = ({
  hasNext,
  hasPrev,
  onNextPage,
  onPrevPage,
  children,
  loading,
  canBeShown = true,
  buttonText = "Next",
  endIcon,
  startIcon,
  variant = "text",
}) => {
  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"16px"}
    >
      {children}
      <Grid
        p={"30px"}
        display={canBeShown ? "flex" : "none"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={variant === "outlined" ? 1 : 0}
      >
        {hasPrev && (
          <Button
            variant={variant}
            disabled={loading}
            color="primary"
            onClick={onPrevPage}
            startIcon={startIcon}
          >
            Prev
          </Button>
        )}
        {hasNext && (
          <Button
            variant={variant}
            disabled={loading}
            color="primary"
            onClick={onNextPage}
            endIcon={endIcon}
          >
            {buttonText}
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default PaginatedList;
