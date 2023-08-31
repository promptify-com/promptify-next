import React, { useState } from "react";
import { Box, Button, CircularProgress, IconButton, InputBase, InputLabel, Stack, Typography } from "@mui/material";
import { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { Search as SearchIcon, StarOutline as StarOutlineIcon, Star as StarIcon, Close } from "@mui/icons-material";
import { SubjectIcon } from "@/assets/icons/SubjectIcon";
import { ExecutionCard } from "./ExecutionCard";
import { PromptLiveResponse } from "@/common/types/prompt";
import { ExecutionCardGenerated } from "./ExecutionCardGenerated";

interface Props {
  templateData: Templates;
  executions: TemplatesExecutions[];
  isFetching?: boolean;
  newExecutionData: PromptLiveResponse | null;
  refetchExecutions: () => void;
}

export const Executions: React.FC<Props> = ({
  templateData,
  executions,
  isFetching,
  newExecutionData,
  refetchExecutions,
}) => {
  const [searchText, setSearchText] = useState("");
  const [favoriteSearch, setFavoriteSearch] = useState(false);
  const [searchShown, setSearchShown] = useState(false);

  const allExecutions = executions
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .filter(exec => {
      return (exec.prompt_executions || []).some(promptExec =>
        promptExec.output.toLowerCase().includes(searchText.toLowerCase()),
      );
    });

  const favoritedExecutions = allExecutions.filter(execution => execution.is_favorite);

  const filteredExecutions = favoriteSearch ? favoritedExecutions : allExecutions;

  return (
    <Box sx={{ position: "relative", px: "16px" }}>
      <Box sx={{ position: "sticky", top: 0, left: 0, right: 0, zIndex: 998 }}>
        {searchShown && (
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={1}
            sx={{
              display: { md: "none" },
              bgcolor: "surface.1",
              color: "onSurface",
              py: "10px",
            }}
          >
            <Box
              sx={{
                flex: 1,
              }}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={2}
                sx={{
                  flex: 1,
                  bgcolor: "surface.4",
                  p: "8px 8px 8px 16px",
                  borderRadius: "99px",
                }}
              >
                <SearchIcon />
                <InputBase
                  id="exec"
                  placeholder={"Search..."}
                  fullWidth
                  sx={{
                    flex: 1,
                    fontSize: 14,
                    pr: "5px",
                  }}
                  value={searchText}
                  onChange={e => {
                    setSearchText(e.target.value);
                  }}
                />
              </Stack>
            </Box>
            <IconButton
              sx={{
                border: "none",
                bgcolor: "surface.1",
                ":hover": { color: "tertiary" },
              }}
              onClick={() => setSearchShown(!searchShown)}
            >
              <Close />
            </IconButton>
          </Stack>
        )}
        <Stack
          gap={2}
          sx={{
            display: { xs: "flex", md: "none" },
            width: "fit-content",
            ml: "auto",
            pt: "10px",
          }}
        >
          {!searchShown && (
            <IconButton
              sx={{
                border: "none",
                bgcolor: "surface.1",
                ":hover": { color: "tertiary" },
              }}
              onClick={() => setSearchShown(!searchShown)}
            >
              {searchShown ? <Close /> : <SearchIcon />}
            </IconButton>
          )}
          <IconButton
            sx={{
              fontSize: 24,
              border: "none",
              bgcolor: "surface.1",
              ":hover": { color: "tertiary" },
            }}
            onClick={() => {
              setFavoriteSearch(!favoriteSearch);
              refetchExecutions();
            }}
          >
            {favoriteSearch ? <StarIcon /> : <StarOutlineIcon />}
          </IconButton>
        </Stack>

        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={2}
          sx={{
            display: { xs: "none", md: "flex" },
            bgcolor: "surface.4",
            p: "10px 20px",
            borderRadius: "99px",
            color: "onSurface",
          }}
        >
          <SubjectIcon />
          <InputBase
            id="exec"
            placeholder={"Search..."}
            fullWidth
            sx={{
              flex: 1,
              fontSize: 14,
              padding: "0px",
            }}
            value={searchText}
            onChange={e => {
              setSearchText(e.target.value);
            }}
          />
          <InputLabel htmlFor="exec">
            <IconButton sx={{ border: "none", p: 0, ":hover": { color: "tertiary" } }}>
              <SearchIcon />
            </IconButton>
          </InputLabel>
          <IconButton
            sx={{ border: "none", p: 0, ":hover": { color: "tertiary" } }}
            onClick={() => {
              setFavoriteSearch(!favoriteSearch);
              refetchExecutions();
            }}
          >
            {favoriteSearch ? <StarIcon /> : <StarOutlineIcon />}
          </IconButton>
          <Button
            variant="text"
            sx={{
              minWidth: 0,
              p: 0,
              color: "onSurface",
              fontSize: 13,
              fontWeight: 500,
              "&:hover": { opacity: 0.8 },
            }}
            disabled={!searchText.length}
            onClick={() => setSearchText("")}
          >
            Clear
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mx: { xs: 0, md: "15px" } }}>
        {newExecutionData && (
          <ExecutionCardGenerated
            execution={newExecutionData}
            templateData={templateData}
          />
        )}

        {isFetching ? (
          <Box
            sx={{
              width: "100%",
              mt: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={20} />
          </Box>
        ) : filteredExecutions.length > 0 ? (
          filteredExecutions.map((execution, i) => {
            return (
              <ExecutionCard
                key={i}
                execution={execution}
                templateData={templateData}
              />
            );
          })
        ) : (
          <Typography sx={{ mt: "40px", textAlign: "center" }}>No sparks found</Typography>
        )}
      </Box>
    </Box>
  );
};
