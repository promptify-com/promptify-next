import React, { useMemo, useState } from "react";
import { ArrowDropDown, FilterList, Search, SortRounded } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogActions,
  Divider,
  Grid,
  IconButton,
  InputBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import SavedSpark from "@/assets/icons/SavedSpark";
import { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import TabsSection from "./sparks/TabsSection";
import SelectedFiltersSection from "./sparks/SelectedFiltersSection";
import TemplatesMenuSection from "./sparks/TemplatesMenu";
import DraftSpark from "@/assets/icons/DraftSpark";
import BaseButton from "./base/BaseButton";

export type TabValueType = "all" | "drafts" | "saved";
interface TemplateFilterProps {
  templates: TemplateExecutionsDisplay[];
  selectedTemplate: TemplateExecutionsDisplay | null;
  onTemplateSelect: (selectedTemplate: TemplateExecutionsDisplay | null) => void;
  onSortTemplateToggle: () => void;
  onSortExecutionToggle: () => void;
  onSortTimeToggle: () => void;
  onSortFavoriteToggle: (value: "saved" | "drafts") => void;

  sortTemplateDirection: "asc" | "desc";
  sortExecutionDirection: "asc" | "desc";
  sortTimeDirection: "asc" | "desc";
  sortFavoriteDirection: "asc" | "desc";
  onNameFilter: (nameFilter: string) => void;
  nameFilter: string;
  currentTab: TabValueType;
  availableTabs: TabValueType[];
  setCurrentTab: (value: TabValueType) => void;
}

const SparkFilters: React.FC<TemplateFilterProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  onSortTemplateToggle,
  onSortExecutionToggle,
  onSortTimeToggle,
  onSortFavoriteToggle,
  sortTemplateDirection,
  sortExecutionDirection,
  sortTimeDirection,
  sortFavoriteDirection,
  onNameFilter,
  nameFilter,
  currentTab,
  setCurrentTab,
  availableTabs,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorFavoriteSort, setAnchorFavoriteSort] = useState<null | HTMLElement>(null);
  const [anchorSortOptions, setAnchorSortOptions] = useState<null | HTMLElement>(null);

  const [openFilters, setOpenFilters] = useState<boolean>(false);
  const [value, setValue] = useState<TabValueType>(currentTab);
  const openTemplatesMenu = Boolean(anchorEl);
  const openSortFavoriteMenu = Boolean(anchorFavoriteSort);
  const openSortOptionsMenu = Boolean(anchorSortOptions);

  const handleTemplateSelect = (template: TemplateExecutionsDisplay | null) => {
    onTemplateSelect(template);
    setAnchorEl(null);
  };

  const handleNameFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterValue = event.target.value;
    onNameFilter(filterValue);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: TabValueType) => {
    setValue(newValue);
    setCurrentTab(newValue);
  };

  const filteredTemplates = useMemo(() => {
    if (currentTab === "saved" || currentTab === "drafts") {
      return templates.filter(template => {
        if (currentTab === "saved") {
          return template.executions.some(execution => execution.is_favorite);
        } else if (currentTab === "drafts") {
          return template.executions.some(execution => !execution.is_favorite);
        }
        return true; // Keep the template if the tab is not "saved" or "drafts"
      });
    }

    return templates; // Default case
  }, [templates, currentTab]);

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
        availableTabs={availableTabs}
      />

      {/* Selected Filters Section */}
      <SelectedFiltersSection
        selectedTemplate={selectedTemplate}
        nameFilter={nameFilter}
        currentTab={value}
        onTemplateClear={() => onTemplateSelect(null)}
        onSearchClear={() => onNameFilter("")}
        onTabClear={() => {
          setValue("all");
          setCurrentTab("all");
        }}
      />

      <Box
        bgcolor={"surface.1"}
        height={"36px"}
        display={"flex"}
        alignItems={"center"}
        overflow={"hidden"}
        borderRadius={{ xs: "99px", md: "8px" }}
      >
        <Grid
          container
          position={"relative"}
          gap={{ md: "1px" }}
        >
          <Grid
            onClick={e => {
              if (currentTab !== "all") return;
              setAnchorFavoriteSort(e.currentTarget);
            }}
            bgcolor={"surface.5"}
            minWidth={"48px"}
            padding={"0px 8px"}
            display={{ xs: "none", md: "flex" }}
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
              cursor: "pointer",
            }}
          >
            {sortFavoriteDirection === "asc" || currentTab === "saved" ? <SavedSpark /> : <DraftSpark />}
            <ArrowDropDown sx={{ fontSize: "16px", display: currentTab !== "all" ? "none" : "block" }} />
          </Grid>
          <Grid
            bgcolor={"surface.5"}
            item
            flex={1}
            md={3}
            padding={{ xs: "0px 8px", md: "0px 8px" }}
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
                display: { xs: "none", md: "flex" },
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
            bgcolor={"surface.5"}
            item
            xs={3}
            justifyContent={"center"}
            display={{ xs: "flex", md: "none" }}
            alignItems={"center"}
            onClick={e => setAnchorSortOptions(e.currentTarget)}
          >
            <IconButton
              size="small"
              aria-label="sort"
              sx={{
                border: "none",
                "&:hover": {
                  bgcolor: "surface.4",
                },
              }}
            >
              <SortRounded />
            </IconButton>
            <Typography
              fontSize={13}
              lineHeight={"143%"}
              letterSpacing={"0.17px"}
              sx={{ opacity: 0.75, display: "flex", alignItems: "center", gap: "8px" }}
            >
              Sort
            </Typography>
          </Grid>
          <Grid
            item
            xs={3}
            justifyContent={"center"}
            bgcolor={"surface.5"}
            padding={"16px"}
            display={{ xs: "flex", md: "none" }}
            alignItems={"center"}
          >
            <IconButton
              onClick={e => setOpenFilters(true)}
              size="small"
              aria-label="sort"
              sx={{
                border: "none",

                "&:hover": {
                  bgcolor: "surface.4",
                },
              }}
            >
              <FilterList />
            </IconButton>
            <Typography
              fontSize={13}
              lineHeight={"143%"}
              letterSpacing={"0.17px"}
              sx={{ opacity: 0.75, display: "flex", alignItems: "center", gap: "8px" }}
            >
              Filter
            </Typography>
          </Grid>
          <Grid
            bgcolor={"surface.5"}
            item
            padding={"8px 8px 8px 16px"}
            lg={4}
            display={{ xs: "none", md: "flex" }}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              onClick={e => setAnchorEl(e.currentTarget)}
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
            bgcolor={"surface.5"}
            item
            padding={"8px 16px"}
            display={{ xs: "none", md: "flex" }}
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
            bgcolor={"surface.5"}
            item
            display={{ xs: "none", md: "flex" }}
            gap={"8px"}
            top={13}
            alignItems={"center"}
            justifyContent={"end"}
            flex={1}
            padding={"8px 16px"}
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
          id="favorite-menu"
          anchorEl={anchorFavoriteSort}
          open={openSortFavoriteMenu}
          onClose={() => setAnchorFavoriteSort(null)}
        >
          <MenuItem
            onClick={() => {
              onSortFavoriteToggle("saved");
              setAnchorFavoriteSort(null);
            }}
          >
            <ListItemIcon
              sx={{
                mr: -1.5,
              }}
            >
              <SavedSpark />
            </ListItemIcon>
            <ListItemText>Saved</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onSortFavoriteToggle("drafts");
              setAnchorFavoriteSort(null);
            }}
          >
            <ListItemIcon
              sx={{
                mr: -1.5,
              }}
            >
              <DraftSpark />
            </ListItemIcon>
            <ListItemText>Drafts</ListItemText>
          </MenuItem>
        </Menu>
        <Menu
          id="template-menu"
          anchorEl={anchorEl}
          open={openTemplatesMenu}
          onClose={() => setAnchorEl(null)}
        >
          {/* Templates Menu Section */}
          <TemplatesMenuSection
            templates={filteredTemplates}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
          />
        </Menu>

        {/* mobile sort options menu */}

        <Menu
          id="sortOptions-menu"
          anchorEl={anchorSortOptions}
          open={openSortOptionsMenu}
          onClose={() => setAnchorSortOptions(null)}
        >
          <MenuItem
            onClick={() => {
              onSortExecutionToggle();
              setAnchorSortOptions(null);
            }}
          >
            <ListItemIcon>
              <SortRounded
                sx={{
                  transform: `rotate(${sortExecutionDirection === "asc" ? "180" : "0"}deg)`,
                }}
              />
            </ListItemIcon>
            <ListItemText>By Spark</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onSortTimeToggle();
              setAnchorSortOptions(null);
            }}
          >
            <ListItemIcon>
              <SortRounded
                sx={{
                  transform: `rotate(${sortTimeDirection === "asc" ? "180" : "0"}deg)`,
                }}
              />
            </ListItemIcon>
            <ListItemText>By time</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onSortTemplateToggle();
              setAnchorSortOptions(null);
            }}
          >
            <ListItemIcon>
              <SortRounded
                sx={{
                  transform: `rotate(${sortTemplateDirection === "asc" ? "180" : "0"}deg)`,
                }}
              />
            </ListItemIcon>
            <ListItemText>By template</ListItemText>
          </MenuItem>
        </Menu>

        <Dialog
          open={openFilters}
          onClose={() => setOpenFilters(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <TemplatesMenuSection
            templates={filteredTemplates}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onClose={() => setOpenFilters(false)}
          />
          <DialogActions>
            <BaseButton
              onClick={() => setOpenFilters(false)}
              variant="contained"
              size="small"
              color="custom"
              customColor=""
              sx={{
                height: 30,
              }}
            >
              Cancel
            </BaseButton>
          </DialogActions>
        </Dialog>
      </Box>
    </Grid>
  );
};

export default SparkFilters;
