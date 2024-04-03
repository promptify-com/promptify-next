import Box from "@mui/material/Box";
import Search from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

import { useAppDispatch } from "@/hooks/useStore";
import { setSelectedKeyword } from "@/core/store/filtersSlice";
import useDebounce from "@/hooks/useDebounce";
import { useDeferredValue, useEffect, useState } from "react";

export default function PromptsReviewSearch() {
  const dispatch = useAppDispatch();
  const [textInput, setTextInput] = useState("");
  const deferredSearchName = useDeferredValue(textInput);
  const debouncedSearchName = useDebounce<string>(deferredSearchName, 300);

  useEffect(() => {
    dispatch(setSelectedKeyword(debouncedSearchName || null));
  }, [debouncedSearchName, dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        flex: "1 0 0",
        borderRadius: "24px",
        background: "var(--surfaceContainerHigh, #E9E7EC)",
        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.00), 0px 4px 8px 0px rgba(225, 226, 236, 0.00)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          padding: "var(--1, 8px)",
          alignItems: "center",
          gap: "var(--1, 8px)",
          alignSelf: "stretch",
          mb: "4px",
          mt: "4px",
          mx: "8px",
        }}
      >
        <Search />
        <InputBase
          onChange={e => setTextInput(e.target.value)}
          placeholder={"Search..."}
          sx={{
            flex: 1,
            fontSize: "13px",
            padding: "0px",
            fontFamily: "Poppins",
          }}
        />
      </Box>
    </Box>
  );
}
