import { ArrowDropDownIcon } from "@/assets/icons/ArrowDropDownIcon";
import { MenuIcon } from "@/assets/icons/MenuIcon";
import SavedSpark from "@/assets/icons/SavedSpark";
import { TemplateExecutionsDisplay } from "@/core/api/dto/templates";
import useTruncate from "@/hooks/useTruncate";
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
} from "@mui/material";
import React, { useState } from "react";

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
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  return (
    <Grid
      display={"flex"}
      flexDirection={"column"}
      gap={"16px"}
    >
      <Grid display={"flex"}>
        {selectedTemplate && (
          <Chip
            avatar={
              <Avatar
                alt={selectedTemplate.title}
                src={selectedTemplate.thumbnail}
              />
            }
            label={selectedTemplate.title}
            onDelete={() => handleTemplateSelect(null)}
            sx={{
              bgcolor: "surface.1",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: "18px",
              letterSpacing: "0.16px",
            }}
          />
        )}
      </Grid>
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
          <List
            sx={{
              pt: 0,
              width: "401px",
            }}
          >
            <Grid padding={"8px 16px 16px 16px"}>
              <Typography
                textTransform={"uppercase"}
                fontSize={"12px"}
                lineHeight={"180%"}
                letterSpacing={"1px"}
                color={"#375CA9"}
              >
                Templates
              </Typography>
            </Grid>
            <Divider />
            <Box
              sx={{
                height: "408px",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                },
                "&::-webkit-scrollbar-track": {
                  boxShadow: "inset 1 0 2px rgba(0, 0, 0, 0.6)",
                  webkitBoxShadow: "inset 1 1 6px rgba(0,0,0,0.50)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "surface.5",
                  outline: "1px solid surface.5",
                  borderRadius: "10px",
                },
              }}
            >
              {templates.map(template => (
                <ListItemButton
                  sx={{ p: 0 }}
                  key={template.id}
                  selected={selectedTemplate?.title === template.title}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <Grid
                    padding={"16px"}
                    display={"flex"}
                    flexDirection={"column"}
                    gap={"8px"}
                  >
                    <Grid
                      display={"flex"}
                      alignItems={"center"}
                      gap={"8px"}
                    >
                      <CardMedia
                        sx={{
                          zIndex: 1,
                          borderRadius: "8px",
                          width: "41px",
                          height: "31px",
                          objectFit: "cover",
                        }}
                        component="img"
                        image={template.thumbnail}
                        alt={template.title}
                      />
                      <Typography
                        fontSize={"13px"}
                        lineHeight={"140%"}
                        letterSpacing={"0.15px"}
                      >
                        {template.title}
                      </Typography>
                    </Grid>
                    <Typography
                      fontSize={"12px"}
                      fontWeight={400}
                      lineHeight={"140%"}
                      letterSpacing={"0.15px"}
                      sx={{
                        opacity: 0.75,
                      }}
                    >
                      {truncate(template.description, { length: 53 })}
                    </Typography>
                    <Grid
                      display={"flex"}
                      gap={"8px"}
                    >
                      {template.tags.slice(0, 3).map(tag => (
                        <Chip
                          size="small"
                          key={tag.id}
                          label={tag.name}
                          sx={{
                            bgcolor: "surface.5",
                          }}
                        />
                      ))}
                    </Grid>
                  </Grid>
                  {/* {template.title} */}
                </ListItemButton>
              ))}
            </Box>
          </List>
        </Menu>
      </Box>
    </Grid>
  );
};

export default SparkFilters;
