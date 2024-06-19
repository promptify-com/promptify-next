import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Search from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { useAppDispatch } from "@/hooks/useStore";
import useDebounce from "@/hooks/useDebounce";
import usePromptsFilter from "@/components/explorer/Hooks/usePromptsFilter";

export default function PromptsReviewSearch({ title }: { title: string | null }) {
  const dispatch = useAppDispatch();
  const [textInput, setTextInput] = useState(title ?? "");
  const debouncedSearchName = useDebounce<string>(textInput, 300);
  const { handleSelectKeyword } = usePromptsFilter();

  useEffect(() => {
    handleSelectKeyword(debouncedSearchName);
  }, [debouncedSearchName]);

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
        }}
      >
        <Search />
        <InputBase
          onChange={e => setTextInput(e.target.value)}
          placeholder={"Search..."}
          value={textInput}
          sx={{
            flex: 1,
            fontSize: "13px",
            padding: "0px",
          }}
        />
      </Box>
    </Box>
  );
}
