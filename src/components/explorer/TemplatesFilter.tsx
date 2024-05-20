import React, { useState } from "react";
import { Avatar, Button, Chip, Stack, Typography, alpha } from "@mui/material";
import { Engine, Tag } from "@/core/api/dto/templates";
import {
  deleteSelectedTag,
  setSelectedEngine,
  setSelectedTag,
  initialState as initialFiltersState,
} from "@/core/store/filtersSlice";
import { RootState } from "@/core/store";
import { theme } from "@/theme";
import { useRouter } from "next/router";
import { useGetTagsPopularQuery } from "@/core/api/tags";
import { useGetEnginesQuery } from "@/core/api/engines";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";

const minShown = 5;

export const TemplatesFilter = () => {
  const { data: tags } = useGetTagsPopularQuery();
  const { data: engines } = useGetEnginesQuery();
  const [enginesToShow, setEnginesToShow] = useState<number>(minShown);
  const filters = useAppSelector((state: RootState) => state.filters ?? initialFiltersState);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleEngineSelect = (engine: Engine) => {
    dispatch(setSelectedEngine(engine));
    router.push("/explore");
  };

  const handleTagSelect = (tag: Tag) => {
    if (storedTags.includes(tag)) {
      dispatch(deleteSelectedTag(tag.id));
    } else {
      dispatch(setSelectedTag(tag));
    }
    router.push("/explore");
  };

  const showmore = () => {
    if (engines?.length) {
      setEnginesToShow(engines.length);
    }
  };
  const showless = () => {
    setEnginesToShow(minShown);
  };

  const { engine: storedEngine, tag: storedTags } = filters;
  const enginesExpanded = enginesToShow > minShown;

  return (
    <Stack
      gap={2}
      p={"20px"}
    >
      <Stack
        direction={"row"}
        alignItems={{ xs: "baseline", md: enginesExpanded ? "baseline" : "center" }}
        gap={1}
      >
        <Typography
          fontSize={13}
          fontWeight={400}
          color={alpha(theme.palette.onSurface, 0.45)}
        >
          Engines:
        </Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          flexWrap={"wrap"}
          gap={1}
        >
          {engines?.slice(0, enginesToShow).map(engine => (
            <Button
              key={engine.id}
              onClick={() => handleEngineSelect(engine)}
              sx={{
                borderRadius: "8px",
                px: "16px",
                bgcolor: storedEngine === engine ? "secondaryContainer" : "surface.2",
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Avatar
                src={engine.icon || require("@/assets/images/promptify.png")}
                alt={engine.name}
                sx={{
                  width: "25px",
                  height: "25px",
                  mr: "8px",
                }}
              />
              <Typography
                fontSize={13}
                fontWeight={500}
                color={"onSurface"}
              >
                {engine.name}
              </Typography>
            </Button>
          ))}
          {engines && engines.length > minShown && (
            <Button
              sx={{
                fontSize: "12px",
                color: "black",
                mx: 2,
              }}
              variant="text"
              onClick={enginesExpanded ? showless : showmore}
            >
              {enginesExpanded ? "Show less" : "See all"}
            </Button>
          )}
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        alignItems={"baseline"}
        gap={1}
      >
        <Typography
          fontSize={13}
          fontWeight={400}
          color={alpha(theme.palette.onSurface, 0.45)}
        >
          Popular tags:
        </Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={1}
          flexWrap={"wrap"}
        >
          {tags?.map(tag => (
            <Chip
              key={tag.id}
              label={tag.name}
              onClick={() => handleTagSelect(tag)}
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: "onSurface",
                bgcolor: storedTags.includes(tag) ? "secondaryContainer" : "surface.4",
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

const listHeaderStyle = {
  fontSize: 12,
  fontWeight: 400,
};
