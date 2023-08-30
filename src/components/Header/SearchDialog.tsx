import { Box, Grid, IconButton, InputBase } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedKeyword } from "@/core/store/filtersSlice";
import { Search } from "@mui/icons-material";
import { useRouter } from "next/router";
import { RootState } from "@/core/store";
import SearchByKeywords from "./SearchByKeywords";
import { useDeferredValue, useEffect, useState } from "react";
import { useGetTemplatesBySearchQuery } from "@/core/api/templates";
import useDebounce from "@/hooks/useDebounce";
import CardTemplate from "../common/cards/CardTemplate";
import CardTemplatePlaceholder from "../placeholders/CardTemplatePlaceHolder";
import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";

interface SearchDialogProps {
  open: boolean;
  close: () => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({ open, close }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [IsSm, setIsSm] = useState(false);
  const [textInput, setTextInput] = useState("");
  const deferredSearchName = useDeferredValue(textInput);
  const debouncedSearchName = useDebounce<string>(deferredSearchName, 300);

  const { data: templates, isFetching } = useGetTemplatesBySearchQuery(debouncedSearchName, {
    skip: Boolean(textInput.length <= 3),
  });

  const title = useSelector((state: RootState) => state.filters.title);

  const handleClose = (e: any) => {
    e.stopPropagation();
    close();
  };

  useEffect(() => {
    close();
  }, [title]);

  useEffect(() => {
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
                onChange={e => {
                  setTextInput(e.target.value);
                }}
                defaultValue={title ?? textInput}
                placeholder={"Search prompts, templates, collections, or ask something..."}
                fullWidth
                sx={{
                  fontSize: "13px",
                  padding: "0px",
                  fontFamily: "Poppins",
                }}
                onKeyPress={e => {
                  if (e.key === "Enter") {
                    dispatch(setSelectedKeyword(textInput));
                    router.push({ pathname: "/explore" });
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogTitle>
      <DialogContent>
        {textInput === "" ? (
          <SearchByKeywords title={title} />
        ) : (
          <Grid>
            {isFetching ? (
              <CardTemplatePlaceholder count={5} />
            ) : (
              <Grid
                display={"flex"}
                flexDirection={"column"}
              >
                {templates?.length !== 0 && !isFetching ? (
                  <Grid
                    display={"flex"}
                    flexDirection={"column"}
                    gap={"8px"}
                    width={"100%"}
                  >
                    {templates?.map(template => (
                      <CardTemplate
                        key={template.id}
                        template={template}
                        query={debouncedSearchName}
                      />
                    ))}
                  </Grid>
                ) : (
                  <Grid
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    minHeight={"20vh"}
                  >
                    <NotFoundIcon />
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};
