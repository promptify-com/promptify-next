import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid, IconButton, InputBase, Typography } from "@mui/material";
import React from "react";
import { Tag } from "@/core/api/dto/templates";

interface Props {
  keyWord: string;
  setKeyWord?: React.Dispatch<React.SetStateAction<string>>;
  selectedTag?: Tag[] | [];
  // eslint-disable-next-line @typescript-eslint/ban-types
  setSelectedTag?: Function;
  from?: string;
}
const SearchBar: React.FC<Props> = ({
  keyWord,
  setKeyWord,
  selectedTag,
  setSelectedTag,
  from,
}) => {
  const handleRemoveTag = (tag: Tag) => {
    const removeTag =
      !!selectedTag && selectedTag.filter((el) => el.id !== tag.id);
    if (!!setSelectedTag) setSelectedTag(removeTag);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        backgroundColor: "surface.5",
        borderRadius: "99px",
        height: "48px",
        minWidth: "100%",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minWidth: "100%",
          flexDirection: "row",
          height: "100%",
        }}
        alignItems="center"
      >
        <Grid
          sx={{
            width: { xs: "97%", sm: "100%" },
            paddingRight: "0.5em",
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
              marginLeft: "0.5em",
              ":hover": { color: "tertiary" },
            }}
          >
            <SearchIcon />
          </IconButton>
          {!!selectedTag &&
            selectedTag.length > 0 &&
            selectedTag.map((el, idx) => (
              <Typography
                onClick={() => handleRemoveTag(el)}
                key={idx}
                sx={{
                  bgcolor: "white",
                  color: "black",
                  borderRadius: "20px",
                  minWidth: "fit-content",
                  padding: "2px 1em",
                  height: "26px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {el.name}
              </Typography>
            ))}

          {from === "middle" ? (
            <InputBase
              onChange={(e) => {
                if (!!setKeyWord) setKeyWord(e.target.value);
              }}
              placeholder={
                !!selectedTag && !selectedTag.length ? "Search prompts, templates, collections, or ask something..." : ""
              }
              fullWidth
              sx={{
                fontSize: "13px",
                padding: "0px",
                fontFamily: "Poppins",
              }}
              value={keyWord}
            />
          ) : !!keyWord ? (
            <Typography>{keyWord}</Typography>
          ) : (
            <Typography
              sx={{
                color: "gray",
              }}
            >
              Search prompts, templates, collections, or ask something...
            </Typography>
          )}
        </Grid>
        <Grid
          sx={{
            display: { xs: "none", sm: "flex" },
            marginRight: "0.2em",
          }}
        >
          <Typography
            sx={{
              bgcolor: "primary.main",
              color: "onPrimary",
              borderRadius: "20px",
              width: "75px",
              padding: "1px",
              height: "26px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "-15px",
              fontSize: "12px",
              zIndex: 1,
            }}
          >
            Prompts
          </Typography>
          <Typography
            onClick={() => console.log("")}
            sx={{
              bgcolor: "surface.5",
              color: "onSurface",
              borderRadius: "20px",
              fontSize: "12px",
              height: "26px",
              width: "92px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1px",
              paddingLeft: "10px",
              cursor: "pointer",
            }}
          >
            Collections
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchBar;
