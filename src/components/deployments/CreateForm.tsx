import React, { useEffect, useRef, useState } from "react";
import { Grid, Typography, Button, Stack, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useFormik } from "formik";
import { CreateDeployment, Instance, Model } from "@/common/types/deployments";
import BaseButton from "../base/BaseButton";
import {
  useCreateDeploymentMutation,
  useGetInstancesQuery,
  useGetRegionsByQueryParamsQuery,
} from "@/core/api/deployments";
import { models } from "@/pages/deployments/data";
import { useAppSelector } from "@/hooks/useStore";
import InstanceLabel from "./InstanceLabel";

interface CreateFormProps {
  onClose: () => void;
}

const CreateForm = ({ onClose }: CreateFormProps) => {
  const [createDeployment] = useCreateDeploymentMutation();

  const currentUser = useAppSelector(state => state.user.currentUser);

  const handleCreateDeployment = async (values: CreateDeployment) => {
    console.log(values);
    const data = await createDeployment(values).unwrap();
    console.log(data);
  };

  const formik = useFormik<CreateDeployment>({
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

  const isProviderSelected = provider !== "";
  const isRegionSelected = region !== "";

  const { data: instances, isFetching: isInstancesFetching } = useGetInstancesQuery(
    { region: region.toString() },
    { skip: !isRegionSelected },
  );

  const { data: regions, isFetching: isRegionFetching } = useGetRegionsByQueryParamsQuery(
    { provider: provider.toString() },
    { skip: !isProviderSelected },
  );

  function allFieldsFilled(obj: Record<string, any>): boolean {
    return Object.values(obj).every(value => value !== "");
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid
        container
        direction={"column"}
        alignItems={"start"}
        spacing={3}
        p={1}
        pb={9}
      >
        {/* Provider  */}
        <Grid item>
          <FormControl sx={{ minWidth: 520 }}>
            <InputLabel> Select Cloud Provider</InputLabel>
            <Select
              labelId="selectStatus"
              value={provider}
              label="Select   Cloud Provider"
              autoWidth
              MenuProps={{ PaperProps: { sx: { maxHeight: 300, width: 520 } } }}
              onChange={event => {
                formik.setFieldValue("provider", event.target.value);
              }}
            >
              <MenuItem value={1}>AWS</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Region */}
        <Grid item>
          <FormControl sx={{ minWidth: 520 }}>
            <InputLabel> Select Region</InputLabel>
            <Select
              labelId="selectStatus"
              value={region}
              label="Select Region"
              disabled={!isProviderSelected}
              variant={!isProviderSelected ? "filled" : "outlined"}
              autoWidth
              MenuProps={{ PaperProps: { sx: { maxHeight: 300, width: 520 } } }}
              onChange={event => {
                formik.setFieldValue("region", event.target.value);
              }}
            >
              {regions &&
                regions.map((region, idx) => (
                  <MenuItem
                    key={idx}
                    value={region.id}
                  >
                    {region.short_name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Instance  */}
        <Grid item>
          <FormControl sx={{ minWidth: 520 }}>
            <InputLabel> Select Instance</InputLabel>
            <Select
              value={instance}
              label="Select Instance"
              autoWidth
              disabled={!isRegionSelected}
              variant={!isRegionSelected ? "filled" : "outlined"}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300, width: 520 } } }}
              onChange={event => {
                formik.setFieldValue("instance", event.target.value);
              }}
            >
              {instances &&
                instances.map((instance, idx) => (
                  <MenuItem
                    key={idx}
                    value={instance.id}
                  >
                    {InstanceLabel(instance)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        {/* LLM SOURCE  */}

        <Grid item>
          <FormControl sx={{ minWidth: 520 }}>
            <InputLabel> Select LLM source</InputLabel>
            <Select
              value={llm}
              label="Select LLM source"
              autoWidth
              MenuProps={{ PaperProps: { sx: { maxHeight: 300, width: 520 } } }}
              onChange={event => {
                formik.setFieldValue("llm", event.target.value);
              }}
            >
              <MenuItem value={1}>HuggingFace</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl sx={{ minWidth: 520 }}>
            <InputLabel>Select Model</InputLabel>
            <Select
              value={model}
              label="Select Model"
              autoWidth
              MenuProps={{ PaperProps: { sx: { maxHeight: 300, width: 520 } } }}
              onChange={event => {
                formik.setFieldValue("model", event.target.value);
              }}
            >
              {models.map(model => (
                <MenuItem
                  key={model.pk}
                  value={model.pk}
                >
                  {model.fields.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Stack
        direction={"row"}
        justifyContent={"end"}
      >
        <Button onClick={onClose}>Cancel</Button>
        <BaseButton
          type="submit"
          variant={"contained"}
          color={"primary"}
          disabled={!allFieldsFilled(formik.values)}
          sx={{
            p: "6px 16px",
            borderRadius: "8px",
            ":disabled": {
              border: "none",
            },
          }}
          autoFocus
        >
          Run
        </BaseButton>
      </Stack>
    </form>
  );
};

export default CreateForm;
