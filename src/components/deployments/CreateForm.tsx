import { useFormik } from "formik";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppSelector } from "@/hooks/useStore";
import { useDeployment } from "@/hooks/deployments/useDeployment";
import type { FormikCreateDeployment } from "@/common/types/deployments";
import { allFieldsFilled } from "@/common/helpers";
import BaseButton from "../base/BaseButton";
import Logs from "./Logs";
import DataLoading from "./DataLoading";
import SearchableInputField from "./SearchableInputFields";
import { useGetRegionsQuery } from "@/core/api/deployments";
import TextField from "@mui/material/TextField";

interface CreateFormProps {
  onClose: () => void;
}

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
      name: "",
    },
    onSubmit: handleCreateDeployment,
  });
  const { region, provider, llm, name } = formik.values;
  const isProviderEmpty = provider === "";
  const { data: regions, isFetching: isRegionFetching } = useGetRegionsQuery(
    { provider: provider.toString() },
    { skip: isProviderEmpty },
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
          <TextField
            label="Model name"
            name="name"
            value={name}
            onChange={event => {
              formik.setFieldValue("name", event.target.value);
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel> Select Cloud Provider</InputLabel>
          <Select
            value={provider}
            label="Select Cloud Provider"
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
            disabled={isProviderEmpty || isDeploying}
            variant={isProviderEmpty ? "filled" : "outlined"}
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

        <SearchableInputField
          name={"instance"}
          label={"Select Instance"}
          setFieldValue={formik.setFieldValue}
          isDeploying={isDeploying}
          regionValue={region}
        />

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

        <SearchableInputField
          name={"model"}
          label={"Select Model"}
          setFieldValue={formik.setFieldValue}
          isDeploying={isDeploying}
          regionValue={region}
        />
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
