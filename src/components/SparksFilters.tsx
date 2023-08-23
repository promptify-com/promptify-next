import React, { useState } from "react";
import { ArrowDropDown, Search, SortRounded } from "@mui/icons-material";
import {
  Box,
  Grid,
  IconButton,
  InputBase,
  ListItemButton,
  List,
  Menu,
  Typography,
  CardMedia,
  Divider,
  Chip,
  Avatar,
  Tab,
  Tabs,
} from "@mui/material";

import DraftSpark from "@/assets/icons/DraftSpark";
import SavedSpark from "@/assets/icons/SavedSpark";
import { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import useTruncate from "@/hooks/useTruncate";
import TabsSection from "./sparks/TabsSection";
import SelectedFiltersSection from "./sparks/SelectedFiltersSection";
import TemplatesMenuSection from "./sparks/TemplatesMenu";

interface TemplateFilterProps {
  templates: TemplateExecutionsDisplay[];
  selectedTemplate: TemplateExecutionsDisplay | null;
  onTemplateSelect: (selectedTemplate: TemplateExecutionsDisplay | null) => void;
  onSortTemplateToggle: () => void;
  onSortExecutionToggle: () => void;
  onSortTimeToggle: () => void;
  sortTemplateDirection: "asc" | "desc";
  sortExecutionDirection: "asc" | "desc";
  sortTimeDirection: "asc" | "desc";
  onNameFilter: (nameFilter: string) => void;
  nameFilter: string;
  currentTab: string;
  setCurrentTab: (value: "all" | "drafts" | "saved") => void;
}

const SparkFilters: React.FC<TemplateFilterProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  onSortTemplateToggle,
  onSortExecutionToggle,
  onSortTimeToggle,
  sortTemplateDirection,
  sortExecutionDirection,
  sortTimeDirection,
  onNameFilter,
  nameFilter,
  currentTab,
  setCurrentTab,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [value, setValue] = useState(currentTab);
  const open = Boolean(anchorEl);
  const { truncate } = useTruncate();

  const handleTemplateSelect = (template: TemplateExecutionsDisplay | null) => {
    onTemplateSelect(template);
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNameFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterValue = event.target.value;
    onNameFilter(filterValue);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: "all" | "drafts" | "saved") => {
    setValue(newValue);
    setCurrentTab(newValue);
  };

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"16px"}
    >
      {/* Tabs Section */}
      <TabsSection
        value={value}
        onChange={handleChange}
      />

      {/* Selected Filters Section */}
      <SelectedFiltersSection
        selectedTemplate={selectedTemplate}
        nameFilter={nameFilter}
        currentTab={value}
        onTemplateClear={() => onTemplateSelect(null)}
        onSearchClear={() => onNameFilter("")}
        onTabClear={() => setValue("all")}
      />

      <Box
        bgcolor={"surface.5"}
        borderRadius={"8px"}
      >
        <Grid
          container
          position={"relative"}
        >
          <Grid
            item
            sx={{ width: "49px" }}
            padding={"16px 8px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <SavedSpark />
          </Grid>
          <Grid
            item
            md={3}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Search sx={{ fontSize: "16px" }} />
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: 13 }}
              placeholder="Name"
              inputProps={{ "aria-label": "Name" }}
              value={nameFilter}
              onChange={handleNameFilter}
            />
            <IconButton
              onClick={onSortExecutionToggle}
              size="small"
              aria-label="sort"
              sx={{
                border: "none",
                "&:hover": {
                  bgcolor: "surface.4",
                },
              }}
            >
              <SortRounded
                sx={{
                  transform: `rotate(${sortExecutionDirection === "asc" ? "180" : "0"}deg)`,
                }}
              />
            </IconButton>
          </Grid>
          <Grid
            item
            px={"16px"}
            lg={4}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              onClick={handleClick}
              fontSize={13}
              lineHeight={"143%"}
              letterSpacing={"0.17px"}
              sx={{ opacity: 0.75, display: "flex", alignItems: "center", gap: "8px" }}
            >
              template
              <ArrowDropDown sx={{ fontSize: "16px" }} />
            </Typography>
            <IconButton
              onClick={onSortTemplateToggle}
              size="small"
              aria-label="sort"
              sx={{
                border: "none",
                transform: `rotate(${sortTemplateDirection === "asc" ? "180" : "0"}deg)`,

                "&:hover": {
                  bgcolor: "surface.4",
                },
              }}
            >
              <SortRounded />
            </IconButton>
          </Grid>
          <Grid
            item
            xs={3}
            display={"flex"}
            gap={"8px"}
            alignItems={"center"}
          >
            <Typography
              fontSize={13}
              lineHeight={"143%"}
              letterSpacing={"0.17px"}
              sx={{ opacity: 0.75 }}
            >
              Last Modified
            </Typography>
            <IconButton
              onClick={onSortTimeToggle}
              size="small"
              aria-label="sort"
              sx={{
                border: "none",
                "&:hover": {
                  bgcolor: "surface.4",
                },
              }}
            >
              <SortRounded
                sx={{
                  transform: `rotate(${sortTimeDirection === "asc" ? "180" : "0"}deg)`,
                }}
              />
            </IconButton>
          </Grid>
          <Grid
            item
            display={"flex"}
            gap={"8px"}
            position={"absolute"}
            right={27}
            top={13}
            alignItems={"center"}
            justifyContent={"end"}
          >
            <Typography
              fontSize={13}
              lineHeight={"143%"}
              letterSpacing={"0.17px"}
              sx={{ opacity: 0.75 }}
            >
              Actions
            </Typography>
          </Grid>
        </Grid>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {/* Templates Menu Section */}
          <TemplatesMenuSection
            templates={templates}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
          />
        </Menu>
      </Box>
    </Grid>
  );
};

export default SparkFilters;
