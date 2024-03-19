import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid, IconButton, InputBase, Typography, alpha, useTheme } from "@mui/material";
import React from "react";
import { Tag } from "@/core/api/dto/templates";
import { LogoApp } from "@/assets/icons/LogoApp";

interface Props {
  keyWord: string;
  setKeyWord?: React.Dispatch<React.SetStateAction<string>>;
  onClick: () => void;
}
const SearchBar: React.FC<Props> = ({ keyWord, onClick, setKeyWord }) => {
  const { palette } = useTheme();

  return (
    <Box
      onClick={onClick}
      display="flex"
      alignItems="center"
      sx={{
        bgcolor: "surface.3",
        borderRadius: "99px",
        height: "48px",
        width: "100%",
        cursor: "pointer",
      }}
    >
      <Grid
        sx={{
          minWidth: "100%",
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          pl: "8px",
          pr: "16px",
        }}
        alignItems="center"
      >
        <Grid
          sx={{
            width: { xs: "97%", sm: "100%" },
            gap: "5px",
            display: "flex",
            overflowX: "auto",
            alignItems: "center",
          }}
        >
          <IconButton
            size="small"
            sx={{
              color: "onSurface",
              border: "none",
              ":hover": { color: "tertiary" },
            }}
          >
            <SearchIcon />
          </IconButton>

          {keyWord ? (
            <Typography>{keyWord}</Typography>
          ) : (
            <Typography
              sx={{
                color: `${alpha(palette.onSurface, 0.5)}`,
                fontSize: 13,
                fontWeight: 400,
              }}
            >
              Search prompt templates...
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchBar;
