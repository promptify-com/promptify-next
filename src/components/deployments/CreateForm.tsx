import { useState } from "react";
import { useFormik } from "formik";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import type { CreateDeployment, FormikCreateDeployment } from "@/common/types/deployments";
import BaseButton from "../base/BaseButton";
import { useGetInstancesQuery, useGetRegionsByQueryParamsQuery } from "@/core/api/deployments";
import { models } from "@/common/constants";
import { useAppSelector } from "@/hooks/useStore";
import InstanceLabel from "./InstanceLabel";
import { allFieldsFilled } from "@/common/helpers";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import useToken from "@/hooks/useToken";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Logs from "./Logs";

interface CreateFormProps {
  onClose: () => void;
}

const CreateForm = ({ onClose }: CreateFormProps) => {
  const token = useToken();
  const [deploymentStatus, setDeploymentStatus] = useState<"creating" | "InService" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const currentUser = useAppSelector(state => state.user.currentUser);

  const resetValues = () => {
    setErrorMessage(null);
    setDeploymentStatus(null);
  };

  const handleCreateDeployment = async (values: FormikCreateDeployment) => {
    resetValues();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/aithos/deployments/`;
    const { model, instance } = values;
    const payload: CreateDeployment = {
      instance,
      model,
    };

    fetchEventSource(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      async onopen(res) {
        if (res.ok && res.status === 200) {
          setLogs(["Initiating deployment process... "]);
        } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          setErrorMessage("Limited service! try another time");
          console.error("Client side error ", res);
        }
      },
      onmessage(msg) {
        if (msg.event === "status" && msg.data) {
          try {
            const data = JSON.parse(msg.data);
            setLogs(prevLogs => [...prevLogs, data.message]);

            if (data.message.includes("Creating")) {
              setDeploymentStatus("creating");
            } else if (data.message.includes("InService")) {
              setDeploymentStatus("InService");
              setTimeout(() => {
                onClose();
              }, 800);
            }
          } catch (error) {
            setErrorMessage("An error occurred while processing the deployment status.");
            console.error("Error parsing message data", error);
          }
        }
      },
      onerror(err) {
        console.log(err, "something went wrong");
        setErrorMessage("Limited service! try another time");
      },
    });
  };

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

  const isProviderSelected = provider !== "";
  const isRegionSelected = region !== "";

  const { data: instances } = useGetInstancesQuery({ region: region.toString() }, { skip: !isRegionSelected });

  const { data: regions } = useGetRegionsByQueryParamsQuery(
    { provider: provider.toString() },
    { skip: !isProviderSelected },
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
            disabled={!isProviderSelected}
            variant={!isProviderSelected ? "filled" : "outlined"}
            autoWidth
            MenuProps={selectMenuProps}
            onChange={event => {
              formik.setFieldValue("region", event.target.value);
            }}
          >
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
            disabled={!isRegionSelected}
            variant={!isRegionSelected ? "filled" : "outlined"}
            MenuProps={selectMenuProps}
            onChange={event => {
              formik.setFieldValue("instance", event.target.value);
            }}
          >
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
            MenuProps={selectMenuProps}
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
        <Button onClick={onClose}>{deploymentStatus === "creating" ? "Close" : "Cancel"}</Button>{" "}
        <BaseButton
          type="submit"
          variant={"contained"}
          color={"primary"}
          disabled={!allFieldsFilled(formik.values) || deploymentStatus === "creating"}
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
          {!deploymentStatus ? (
            <Typography color={"white"}>Deploy</Typography>
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
      minWidth: { md: 520 },
    },
  },
};

export default CreateForm;
