import React, { FC, ReactNode } from "react";
import { Button, Grid } from "@mui/material";
import ArrowLeft from "@mui/icons-material/ArrowLeft";

interface TemplatesPaginatedListProps {
  children: ReactNode;
  hasNext?: boolean;
  hasPrev?: boolean;
  loading: boolean;
  onNextPage: () => void;
  onPrevPage?: () => void;
  canBeShown?: boolean;
  buttonText?: string;
  endIcon?: React.ReactNode;
  variant?: "text" | "contained" | "outlined";
}

const TemplatesPaginatedList: FC<TemplatesPaginatedListProps> = ({
  hasNext,
  hasPrev,
  onNextPage,
  onPrevPage,
  children,
  loading,
  canBeShown = true,
  buttonText = "Next",
  endIcon,
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
      >
        {hasPrev && (
          <Button
            variant="text"
            disabled={loading}
            color="primary"
            onClick={onPrevPage}
          >
            <ArrowLeft />
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

export default TemplatesPaginatedList;
