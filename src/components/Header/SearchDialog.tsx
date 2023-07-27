import {
  Box,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedKeyword } from "@/core/store/filtersSlice";
import { Search } from "@mui/icons-material";
import { useRouter } from "next/router";
import { RootState } from "@/core/store";

const Menu: any[] = [
  {
    id: 1,
    name: "Chat GPT",
  },
  {
    id: 2,
    name: "Writer",
  },
  {
    id: 3,
    name: "Summary",
  },
  {
    id: 4,
    name: "Analyzer",
  },
  {
    id: 5,
    name: "Collection",
  },
  {
    id: 6,
    name: "New Year",
  },
  {
    id: 7,
    name: "Intelligence",
  },
];

interface SearchDialogProps {
  open: boolean;
  close: () => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({ open, close }) => {
  const router = useRouter();
  // TODO: const windowWidth = window.innerWidth; doesn't work in SSR
  const [IsSm, setIsSm] = React.useState(false);

  const title = useSelector((state: RootState) => state.filters.title);

  const handleClose = (e: any, reason: string) => {
    e.stopPropagation();
    close();
  };
  React.useEffect(() => {
    close();
  }, [title]);

  const [textInput, setTextInput] = React.useState("");
  const dispatch = useDispatch();

  React.useEffect(() => {
    function handleWindowResize() {
      const windowWidth = window.innerWidth;
      setIsSm(windowWidth < 600);
    }

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disablePortal
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "fit-content",
      }}
      componentsProps={{
        backdrop: { sx: { backgroundColor: !IsSm ? "rgba(0, 0, 0, 0)" : "" } },
      }}
      PaperProps={{
        sx: {
          borderRadius: IsSm ? "22px" : "18px",
          boxShadow:
            "0px 9px 11px -5px rgba(0, 0, 0, 0.20), 0px 18px 28px 2px rgba(0, 0, 0, 0.14), 0px 7px 34px 6px rgba(0, 0, 0, 0.12)",
          maxHeight: "591px",
          width: "100%",
          maxWidth: "100%",
          zIndex: 999,
          margin: "0px",
          background: "surface",
        },
      }}
    >
      <DialogTitle
        sx={{
          padding: "8px 4px",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          sx={{
            bgcolor: "surface.1",
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
                <Search />
              </IconButton>
              <InputBase
                onChange={(e) => {
                  setTextInput(e.target.value);
                }}
                defaultValue={title ?? ""}
                placeholder={
                  "Search prompts, templates, collections, or ask something..."
                }
                fullWidth
                sx={{
                  fontSize: "13px",
                  padding: "0px",
                  fontFamily: "Poppins",
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    dispatch(setSelectedKeyword(textInput));
                    router.push({ pathname: "/explore" });
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>{" "}
      </DialogTitle>
      <DialogContent>
        <Grid
          sx={{
            display: "flex",
            padding: "24px 24px 8px 24px",
            justifyContent: "space-between",
            alignItems: "flex-start",
            alignSelf: "stretch",
          }}
        >
          <Grid
            sx={{
              color: "var(--on-background, #1B1B1E)",
              fontSize: "12px",
              fontFamily: "Poppins",
              fontWeight: 500,
              lineHeight: "22px",
              letterSpacing: "0.46px",
              opacity: 0.75,
            }}
          >
            Popular requests:
          </Grid>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "8px",
              alignSelf: "stretch",
            }}
          >
            <Typography
              sx={{
                color: "var(--on-surface, #1B1B1E)",
                fontSize: "11px",
                fontFamily: "Poppins",
                fontWeight: 500,
                lineHeight: "166%",
                letterSpacing: "0.4px",
                opacity: 0.5,
              }}
            >
              Search:
            </Typography>

            <Grid
              sx={{
                borderRadius: "4px",
                background: "var(--surface-5, #E1E2EC)",
                display: "flex",
                padding: "0px 0px 2px 0px",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  padding: "2px 4px",
                  alignItems: "flex-start",
                  borderRadius: "4px",
                  border: "1px solid var(--surface-5, #E1E2EC)",
                  background: "var(--surface-1, #FDFBFF)",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--on-surface, #1B1B1E)",
                    fontSize: "11px",
                    fontFamily: "Poppins",
                    fontWeight: 500,
                    lineHeight: "166%",
                    letterSpacing: "0.4px",
                    opacity: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Enter
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <MenuList autoFocusItem={false} sx={{ width: "100%" }}>
          {Menu.map((el) => (
            <MenuItem
              key={el.name}
              onClick={() => {
                dispatch(setSelectedKeyword(el.name));
                router.push({ pathname: "/explore" });
              }}
              sx={{
                display: "flex",
                padding: "16px 24px",
                alignItems: "flex-start",
                gap: "8px",
                alignSelf: "stretch",
                background: el.name === title ? "#8080801a" : "none",
              }}
            >
              <Typography
                sx={{
                  color: "var(--on-background, #1B1B1E)",
                  fontSize: "16px",
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  lineHeight: "22px",
                  letterSpacing: "0.46px",
                }}
              >
                {el.name}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>
      </DialogContent>
    </Dialog>
  );
};
