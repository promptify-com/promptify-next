import type { FormikCreateDeployment, Instance, Model } from "@/common/types/deployments";
import Search from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { type Dispatch, type SetStateAction, useCallback, useRef, useState } from "react";
import DataLoading from "./DataLoading";
import { isDesktopViewPort } from "@/common/helpers";
import type { FormikErrors } from "formik";
import useDebounce from "@/hooks/useDebounce";
import useDataFetching from "@/hooks/deployments/useDataFetching";
import InstanceLabel from "./InstanceLabel";

interface Props {
  value: string;
  name: string;
  label: string;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<void> | Promise<FormikErrors<FormikCreateDeployment>>;
  isDeploying: boolean;
  selectMenuProps: Record<string, any>;
  regionValue: string;
}

const isModel = (model: Model | Instance): model is Model => {
  return "name" in model;
};

export default function SearchableInputField({
  value,
  name,
  label,
  setFieldValue,
  isDeploying,
  selectMenuProps,
  regionValue,
}: Props) {
  const [searchText, setSearchText] = useState("");
  const deboundedSearchText = useDebounce(searchText, 300);
  const isModelType = name === "model";
  const { fetchMoreData, hasMoreData, isFetching, data, isRegionEmpty } = useDataFetching(
    regionValue,
    isModelType ? "models" : "instances",
    deboundedSearchText,
  );
  const isMobile = !isDesktopViewPort();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastModelRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetching) return;
      if (observer.current) {
        observer.current.disconnect();
      }

      const rowHeight = isMobile ? 145 : 80;
      const margin = `${2 * rowHeight}px`;

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            fetchMoreData();
          }

          if (!hasMoreData) {
            observer.current?.disconnect();
          }
        },
        { rootMargin: margin },
      );
      if (node) {
        observer.current.observe(node);
      }
    },
    [isFetching, hasMoreData, fetchMoreData],
  );

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        MenuProps={selectMenuProps}
        label={label}
        disabled={isDeploying ? true : isModelType ? false : isRegionEmpty}
        variant={isModelType ? "outlined" : isRegionEmpty ? "filled" : "outlined"}
        onChange={event => {
          setFieldValue(name, event.target.value);
        }}
      >
        <ListSubheader>
          <TextField
            size="small"
            autoFocus
            placeholder="Type to search..."
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={e => setSearchText(e.target.value)}
          />
        </ListSubheader>
        {data &&
          data.map(_data => (
            <MenuItem
              key={_data.id}
              value={_data.id}
            >
              {isModel(_data) ? _data.name : <InstanceLabel instance={_data} />}
            </MenuItem>
          ))}
        {!isFetching && !data.length && <MenuItem disabled>{`No ${name}s found.`}</MenuItem>}
        <DataLoading loading={isFetching} />
        <div ref={lastModelRef}></div>
      </Select>
    </FormControl>
  );
}
