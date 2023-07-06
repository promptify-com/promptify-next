import SearchIcon from "@mui/icons-material/Search";
import { Box, Grid, IconButton, InputBase, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  setKeyWord?: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  keyWord: string;
}
const InputDialog: React.FC<Props> = ({ setKeyWord, setOpen, keyWord }) => {
  const [textInput, setTextInput] = React.useState("");
  const router = useRouter();

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        backgroundColor: "#fdfbff",
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
          <InputBase
            onChange={(e) => {
              setTextInput(e.target.value);
            }}
            defaultValue={keyWord}
            placeholder={"Search prompts, templates, collections, or ask something..."}
            fullWidth
            sx={{
              fontSize: "13px",
              padding: "0px",
              fontFamily: "Poppins",
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                if (!!setKeyWord) {
                  setKeyWord(textInput);
                } else {
                  router.push({
                    pathname: `/explorer/details`,
                    query: {
                      category: "All directions",
                      keyWordP: textInput,
                    },
                  });
                }
                setOpen(false);
              }
            }}
          />
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

export default InputDialog;
