import { useFormik } from "formik";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import type { FormikCreateDeployment } from "@/common/types/deployments";
import BaseButton from "../base/BaseButton";
import { useAppSelector } from "@/hooks/useStore";
import InstanceLabel from "./InstanceLabel";
import { allFieldsFilled, isDesktopViewPort } from "@/common/helpers";

import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Logs from "./Logs";
import { useDeployment } from "@/hooks/deployments/useDeployment";
import { useFormSelects } from "@/hooks/deployments/useFormSelects";
import { useCallback, useRef } from "react";

interface CreateFormProps {
  onClose: () => void;
}

const DataLoading = ({ loading }: { loading: boolean }) => {
  return (
    <>
      {loading && (
        <Stack
          direction={"row"}
          justifyContent={"center"}
        >
          <CircularProgress />
        </Stack>
      )}
    </>
  );
};

const CreateForm = ({ onClose }: CreateFormProps) => {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { handleCreateDeployment, handleClose, isDeploying, errorMessage, logs } = useDeployment(onClose);

  const formik = useFormik<FormikCreateDeployment>({
    initialValues: {
      provider: "",
      user: currentUser?.id!,
      region: "",
      instance: "",
      llm: "",
      model: "",
    },
    onSubmit: handleCreateDeployment,
  });
  const { region, provider, instance, llm, model } = formik.values;

  const {
    instances,
    regions,
    models,
    fetchMoreModels,
    isModelsFetching,
    hasMoreModels,
    isProviderSelected,
    isRegionSelected,
    isInstanceFetching,
    isRegionFetching,
  } = useFormSelects(provider, region);

  const observer = useRef<IntersectionObserver | null>(null);
  const isMobile = !isDesktopViewPort();

  const lastTemplateElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isModelsFetching) return;
      if (observer.current) observer.current.disconnect();

      const rowHeight = isMobile ? 145 : 80;
      const margin = `${2 * rowHeight}px`;

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMoreModels) {
            fetchMoreModels();
          }
        },
        { rootMargin: margin },
      );
      if (node) observer.current.observe(node);
    },
    [isModelsFetching, hasMoreModels],
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        pt={1}
        pb={6}
        gap={2}
      >
        <FormControl fullWidth>
          <InputLabel> Select Cloud Provider</InputLabel>
          <Select
            value={provider}
            label="Select   Cloud Provider"
            autoWidth
            disabled={isDeploying}
            MenuProps={selectMenuProps}
            onChange={event => {
              formik.setFieldValue("provider", event.target.value);
            }}
          >
            <MenuItem value={1}>AWS</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel> Select Region</InputLabel>
          <Select
            value={region}
            label="Select Region"
            disabled={!isProviderSelected || isDeploying}
            variant={!isProviderSelected ? "filled" : "outlined"}
            autoWidth
            MenuProps={selectMenuProps}
            onChange={event => {
              formik.setFieldValue("region", event.target.value);
              formik.setFieldValue("instance", "");
            }}
          >
            <DataLoading loading={isRegionFetching} />
            {regions &&
              regions.map(region => (
                <MenuItem
                  key={region.id}
                  value={region.id}
                >
                  {region.name} - ({region.short_name})
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel> Select Instance</InputLabel>
          <Select
            value={instance}
            label="Select Instance"
            autoWidth
            disabled={!isRegionSelected || isDeploying}
            variant={!isRegionSelected ? "filled" : "outlined"}
            MenuProps={selectMenuProps}
            onChange={event => {
              formik.setFieldValue("instance", event.target.value);
            }}
          >
            {!instances?.length ? (
              <MenuItem disabled>No available instances found in the selected region</MenuItem>
            ) : (
              <DataLoading loading={isInstanceFetching} />
            )}
            {instances &&
              instances.map(instance => (
                <MenuItem
                  key={instance.id}
                  value={instance.id}
                >
                  <InstanceLabel instance={instance} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel> Select LLM source</InputLabel>
          <Select
            value={llm}
            label="Select LLM source"
            disabled={isDeploying}
            autoWidth
            MenuProps={selectMenuProps}
            onChange={event => {
              formik.setFieldValue("llm", event.target.value);
            }}
          >
            <MenuItem value={1}>HuggingFace</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Select Model</InputLabel>
          <Select
            value={model}
            label="Select Model"
            autoWidth
            disabled={isDeploying}
            MenuProps={selectMenuProps}
            onChange={event => {
              formik.setFieldValue("model", event.target.value);
            }}
          >
            {models &&
              models.map(model => (
                <MenuItem
                  key={model.id}
                  value={model.id}
                >
                  {model.name}
                </MenuItem>
              ))}
            <div ref={lastTemplateElementRef}></div>

            <DataLoading loading={isModelsFetching} />
          </Select>
        </FormControl>
      </Grid>
      <Grid
        item
        mb={3}
        display={"flex"}
        flexDirection={"column"}
        gap={1}
      >
        {errorMessage && (
          <Typography
            variant="body2"
            color={"red"}
          >
            {errorMessage}
          </Typography>
        )}
        <Logs items={logs} />
      </Grid>
      <Stack
        direction={"row"}
        justifyContent={"end"}
      >
        <Button onClick={handleClose}>{isDeploying ? "Close" : "Cancel"}</Button>{" "}
        <BaseButton
          type="submit"
          variant={"contained"}
          color={"primary"}
          disabled={!allFieldsFilled(formik.values) || isDeploying}
          sx={{
            p: "6px 16px",
            borderRadius: "8px",
            ":disabled": {
              border: "none",
            },
            ":hover": {
              bgcolor: "primary",
            },
          }}
          autoFocus
        >
          {!isDeploying ? (
            <span>Deploy</span>
          ) : (
            <>
              <Typography mr={1}>Deploying</Typography>
              <CircularProgress size={18} />
            </>
          )}
        </BaseButton>
      </Stack>
    </form>
  );
};

const selectMenuProps = {
  PaperProps: {
    sx: {
      maxHeight: 300,
      width: { md: 520 },
    },
  },
};

export default CreateForm;
