import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useGetEnginesQuery } from "@/core/api/engines";
import { Engine } from "@/core/api/dto/templates";
import Search from "@mui/icons-material/Search";
import Image from "@/components/design-system/Image";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";

interface SearchInputProps {
  onSearch(val: string): void;
}
const SearchInput = ({ onSearch }: SearchInputProps) => (
  <Stack
    direction={"row"}
    gap={1}
    sx={{
      bgcolor: "surfaceContainerLowest",
      p: "12px 8px 12px 16px",
      position: "sticky",
      top: 0,
      zIndex: 999,
    }}
  >
    <Search />
    <Divider
      orientation="vertical"
      sx={{ bgcolor: "onSurface", height: "22px" }}
    />
    <TextField
      placeholder="Search..."
      onChange={e => onSearch(e.target.value)}
      onKeyDown={e => e.stopPropagation()}
      sx={{
        flex: 1,
        input: {
          p: 0,
          fontSize: 14,
          fontWeight: 400,
        },
        fieldset: {
          border: "none",
        },
      }}
    />
  </Stack>
);

interface Props {
  value: Engine | null;
  onSelect: (engine: Engine | null) => void;
}

function EnginesSelect({ value, onSelect }: Props) {
  let { data: allEngines } = useGetEnginesQuery();
  const [search, setSearch] = useState("");
  const deboundedSearch = useDebounce(search, 300);

  const handleSelect = (engineName: string) => {
    onSelect(engines.find(eng => eng.name === engineName) ?? null);
  };

  if (!allEngines) return;

  const engines = allEngines?.filter(engine => engine.name.toLowerCase().indexOf(deboundedSearch) > -1);

  const selectedEngine = value?.name ?? "";

  return (
    <Select
      value={selectedEngine}
      onChange={e => handleSelect(e.target.value)}
      onClose={_ => setSearch("")}
      displayEmpty
      sx={{
        width: "calc(100% - 16px)",
        mx: "8px",
        bgcolor: "surfaceContainerHigh",
        borderRadius: "8px",
        ":hover": {
          bgcolor: "surfaceContainerHighest",
        },
        ".MuiSelect-select": {
          p: "16px",
          display: "flex",
          gap: 2,
          mr: "32px",
        },
        input: {
          p: 0,
        },
        fieldset: {
          border: "none",
        },
      }}
      MenuProps={{
        disableScrollLock: true,
        sx: {
          ".MuiPaper-root": {
            borderRadius: "0 0 16px 16px",
          },
          ".MuiList-root": {
            p: 0,
            bgcolor: "transparent",
            height: 276,
            overflow: "auto",
            overscrollBehavior: "contain",
            "&::-webkit-scrollbar": {
              width: 0,
            },
          },
          ".MuiMenuItem-root": {
            bgcolor: "surfaceContainerLowest",
            p: "12px 8px 12px 16px",
            gap: 1,
            fontSize: 14,
            fontWeight: 400,
            color: "onSurface",
          },
        },
      }}
    >
      <SearchInput onSearch={val => setSearch(val)} />
      <Divider />
      <MenuItem value="">All Engines</MenuItem>
      {engines.length ? (
        engines.map(engine => (
          <MenuItem
            key={engine.id}
            value={engine.name}
          >
            <Image
              src={engine.icon}
              alt={engine.name}
              loading="lazy"
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
              }}
            />
            {engine.name}
          </MenuItem>
        ))
      ) : (
        <Stack
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            height: 276,
            opacity: 0.7,
            fontSize: 14,
            fontWeight: 400,
            color: "onSurface",
          }}
        >
          No engine found
        </Stack>
      )}
    </Select>
  );
}

export default EnginesSelect;
