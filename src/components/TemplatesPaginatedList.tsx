import React, { FC, ReactNode } from "react";
import { Button, Grid } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";

interface TemplatesPaginatedListProps {
  children: ReactNode;
  hasNext?: boolean;
  hasPrev?: boolean;
  loading: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  canBeShown?: boolean;
  isExplorePage?: boolean;
}

const TemplatesPaginatedList: FC<TemplatesPaginatedListProps> = ({
  hasNext,
  hasPrev,
  onNextPage,
  onPrevPage,
  children,
  loading,
  canBeShown = true,
  isExplorePage = false,
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
        {hasNext &&
          (isExplorePage && hasNext ? (
            <Button
              variant="outlined"
              disabled={loading}
              color="primary"
              onClick={onNextPage}
            >
              LOAD MORE
            </Button>
          ) : (
            <Button
              variant="text"
              disabled={loading}
              color="primary"
              onClick={onNextPage}
            >
              Next
              <ArrowRight />
            </Button>
          ))}
      </Grid>
    </Grid>
  );
};

export default TemplatesPaginatedList;
