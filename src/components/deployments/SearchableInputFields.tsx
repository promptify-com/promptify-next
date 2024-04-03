import type { FormikCreateDeployment, Instance, Model } from "@/common/types/deployments";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, type HTMLAttributes, forwardRef, type SyntheticEvent } from "react";
import DataLoading from "./DataLoading";
import type { FormikErrors } from "formik";
import useDebounce from "@/hooks/useDebounce";
import useDataFetching from "@/hooks/deployments/useDataFetching";

interface Props {
  name: string;
  label: string;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<void> | Promise<FormikErrors<FormikCreateDeployment>>;
  isDeploying: boolean;
  regionValue: string;
}
type RenderRowProps = [HTMLAttributes<HTMLLIElement>, Model | Instance, number];

const isModel = (model: Model | Instance): model is Model => "name" in model;

function RenderRow({ child }: { child: RenderRowProps }) {
  const option = child[1];
  const value = isModel(option)
    ? option.name
    : `${option.instance_type} (cost ${option.cost}/h, ${option.vcpus}vcpus, ${option.num_gpus}gpus, ${option.memory}memory)`;

  return <li {...child[0]}>{value}</li>;
}

export default function SearchableInputField({ name, label, setFieldValue, isDeploying, regionValue }: Props) {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 300);
  const isModelType = name === "model";
  const { fetchNextData, hasNextData, isFetching, data, isRegionEmpty } = useDataFetching(
    regionValue,
    isModelType ? "models" : "instances",
    debouncedSearchText,
  );
  const ListboxComponent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLElement>>(
    function ListboxComponent(props, ref) {
      const { children, ...other } = props;

      return (
        <div ref={ref}>
          <ul {...other}>
            {(children as RenderRowProps[])?.map(child => (
              <RenderRow
                key={child[1].id}
                child={child}
              />
            ))}
          </ul>
        </div>
      );
    },
  );

  return (
    <FormControl fullWidth>
      <Autocomplete
        sx={{
          ".MuiAutocomplete-endAdornment .MuiIconButton-root svg": {
            width: "24px",
            height: "24px",
          },
          ".MuiAutocomplete-endAdornment .MuiIconButton-root": {
            border: "none",
          },
        }}
        id={`auto-complete-${name}`}
        onInputChange={(_, value, reason) => {
          if (reason !== "input") {
            return;
          }

          setSearchText(value);
        }}
        onChange={(_, value, reason) => {
          if (reason !== "selectOption") {
            return;
          }

          setFieldValue(name, value!.id);
        }}
        getOptionLabel={(option: Model | Instance) => {
          return isModel(option)
            ? option.name
            : `${option.instance_type} (cost ${option.cost}/h, ${option.vcpus}vcpus, ${option.num_gpus}gpus, ${option.memory}memory)`;
        }}
        ListboxComponent={ListboxComponent}
        ListboxProps={{
          onScroll: (event: SyntheticEvent) => {
            const listboxNode = event.currentTarget;

            if (!listboxNode) {
              return;
            }

            if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight && hasNextData) {
              fetchNextData();
            }
          },
        }}
        noOptionsText={`No ${name}s found.`}
        options={data ?? []}
        loading={isFetching}
        disabled={isDeploying ? true : isModelType ? false : isRegionEmpty}
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  <DataLoading loading={isFetching} />
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option, state) => [props, option, state.index] as React.ReactNode}
      />
    </FormControl>
  );
}
