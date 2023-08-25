import React, { FC, ReactNode } from "react";
import { Button, Grid } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";

interface TemplatesPaginatedListProps {
  hasNext: boolean;
  hasPrev: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  children: ReactNode;
}

const TemplatesPaginatedList: FC<TemplatesPaginatedListProps> = ({
  hasNext,
  hasPrev,
  onNextPage,
  onPrevPage,
  children,
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
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {hasPrev && (
          <Button
            variant="text"
            color="primary"
            onClick={onPrevPage}
          >
            <ArrowLeft />
            Prev
          </Button>
        )}
        {hasNext && (
          <Button
            variant="text"
            color="primary"
            onClick={onNextPage}
          >
            Next
            <ArrowRight />
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default TemplatesPaginatedList;
