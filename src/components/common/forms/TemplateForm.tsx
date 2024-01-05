import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Close from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useGetTagsQuery } from "@/core/api/tags";
import { fieldStyle, boxStyle, buttonBoxStyle, checkboxStyle } from "@/components/modals/styles";
import { useGetCategoriesQuery } from "@/core/api/categories";
import useToken from "@/hooks/useToken";
import { useGetCurrentUserQuery } from "@/core/api/user";
import { TemplateStatusArray } from "@/common/constants";
import { executionsApi } from "@/core/api/executions";
import { getLanguageFromCode } from "@/common/helpers";

import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import type { FormType } from "@/common/types/template";
import useTemplateForm from "@/hooks/useTemplateForm";

interface Props {
  type?: FormType;
  templateData: Templates | undefined;
  modalNew?: boolean;
  onSaved?: (template?: Templates) => void;
  onClose?: () => void;
  darkMode?: boolean;
}

function TemplateForm({ type = "create", templateData, onSaved, onClose, darkMode = false }: Props) {
  const token = useToken();

  const { data: fetchedTags } = useGetTagsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const { data: user } = useGetCurrentUserQuery(token);

  const [getTemplateExecution] = executionsApi.endpoints.getExecutionsByTemplate.useLazyQuery();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [executions, setExecutions] = useState<TemplatesExecutions[]>();
  const [selectedFile, setSelectedFile] = useState<File>();

  const { formik, loading, showSnackbar, closeSnackbar } = useTemplateForm({
    type,
    template: templateData!,
    uploadedFile: selectedFile,
    onSaved: onSaved,
  });

  const getExecutions = async () => {
    if (!templateData) return null;
    const response = await getTemplateExecution(templateData.id);
    setExecutions(response.data);
    setSelectedTags(templateData?.tags?.map(tag => tag.name) ?? []);
  };

  useEffect(() => {
    getExecutions();
  }, [templateData]);

  const handleImageChange = (image: File) => {
    setSelectedFile(image);
    formik.setFieldValue("thumbnail", URL.createObjectURL(image));
  };

  const addNewTag = (newTags: string[]) => {
    setSelectedTags(newTags);

    formik.setFieldValue(
      "tags",
      newTags.map(tag => ({ name: tag })),
    );
  };

  const color = !darkMode ? "common.white" : "common.black";

  return (
    <Box sx={{ color, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          cursor: "pointer",
        }}
      >
        <Close onClick={onClose} />
      </Box>
      <Stack sx={boxStyle}>
        <TextField
          fullWidth
          label="Template Name"
          variant="outlined"
          size="medium"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          disabled={loading}
          error={formik.touched.title && !formik.values.title}
          helperText={formik.touched.title && formik.errors.title}
        />
      </Stack>
      <Stack sx={boxStyle}>
        <TextField
          multiline
          maxRows={4}
          fullWidth
          label="Description"
          variant="outlined"
          disabled={loading}
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && !formik.values.description}
          helperText={formik.touched.description && formik.errors.description}
        />
      </Stack>
      <Stack sx={[{ display: "flex", flexDirection: "column" }, boxStyle]}>
        <Typography
          sx={{
            color: "#000",
            fontFeatureSettings: "'clig' off, 'liga' off",
            fontFamily: "Poppins",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "157%",
            letterSpacing: "0.1px",
          }}
        >
          Thumbnail
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignContent: "flex-start",
            alignSelf: "stretch",
            gap: "16px",
          }}
        >
          {formik.values.thumbnail && (
            <img
              src={formik.values.thumbnail}
              alt="thumbnail"
              style={{
                height: "180px",
                width: "237px",
                objectFit: "cover",
                borderRadius: "8px",
                background: "surface.5",
              }}
            />
          )}
          <Box
            component={"label"}
            sx={{ width: "100%" }}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{
                bgcolor: formik.touched.thumbnail && formik.errors.thumbnail ? "errorContainer" : "surface.4",
                color: formik.touched.thumbnail && formik.errors.thumbnail ? "error.main" : "primary.main",
                border: "1px solid transparent",
                borderRadius: "4px",
                p: "8px",
                mt: "5px",
                cursor: "pointer",
                ":hover": {
                  bgcolor: "transparent",
                  color: "grey.600",
                  borderColor: "grey.600",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "inherit",
                  fontStyle: "normal",
                  lineHeight: "24px",
                  letterSpacing: "0.2px",
                }}
              >
                Upload
              </Typography>

              <input
                hidden
                accept="image/*"
                disabled={loading}
                type="file"
                onChange={e => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    handleImageChange(file);
                  }
                }}
              />
            </Stack>
            {formik.touched.thumbnail && formik.errors.thumbnail && (
              <Typography
                color="error"
                fontSize={12}
                ml={2}
                fontWeight={300}
                variant="caption"
              >
                {formik.errors.thumbnail}
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>

      <Box sx={boxStyle}>
        <Autocomplete
          value={formik.values.difficulty}
          onChange={(event, newValue) => {
            formik.setFieldValue("difficulty", newValue);
          }}
          options={["BEGINNER", "INTERMEDIATE", "ADVANCED"]}
          fullWidth
          disabled={loading}
          renderInput={params => (
            <TextField
              {...params}
              label="Difficulty"
            />
          )}
          getOptionLabel={option => option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
        />
      </Box>
      <Stack sx={boxStyle}>
        <TextField
          label="Duration"
          variant="outlined"
          size="medium"
          name="duration"
          disabled={loading}
          value={formik.values.duration}
          onChange={formik.handleChange}
          fullWidth
        />
      </Stack>
      <Stack sx={boxStyle}>
        <Autocomplete
          value={formik.values.is_visible ? "1" : "0"}
          onChange={(event, newValue) => {
            formik.setFieldValue("is_visible", newValue === "1" ? true : false);
          }}
          options={["1", "0"]}
          fullWidth
          disabled={loading}
          renderInput={params => (
            <TextField
              {...params}
              label="Visibility"
            />
          )}
          getOptionLabel={option => (option === "1" ? "Yes" : "No")}
        />
      </Stack>
      <Stack sx={boxStyle}>
        <Autocomplete
          value={formik.values.language}
          onChange={(event, newValue) => {
            formik.setFieldValue("language", newValue);
          }}
          options={["en-us", "es", "fr"]}
          disabled={loading}
          fullWidth
          renderInput={params => (
            <TextField
              {...params}
              label="Language"
            />
          )}
          getOptionLabel={getLanguageFromCode}
        />
      </Stack>
      {categories && (
        <Stack sx={boxStyle}>
          <Autocomplete
            value={categories.find(category => category.id === formik.values.category)}
            onChange={(event, newValue) => {
              formik.setFieldValue("category", newValue?.id);
            }}
            disabled={loading}
            options={categories}
            getOptionLabel={option => option.name}
            fullWidth
            renderInput={params => (
              <TextField
                {...params}
                label="Category"
              />
            )}
          />
        </Stack>
      )}
      <Stack sx={boxStyle}>
        <TextField
          multiline
          maxRows={4}
          fullWidth
          label="Template Context"
          variant="outlined"
          size="medium"
          name="context"
          value={formik.values.context}
          disabled={loading}
          onChange={formik.handleChange}
        />
      </Stack>
      <Stack sx={boxStyle}>
        <Autocomplete
          multiple
          freeSolo
          sx={fieldStyle}
          disabled={loading}
          options={fetchedTags ? fetchedTags.map(tag => tag.name) : []}
          value={selectedTags}
          onChange={(event, newValue) => addNewTag(newValue)}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                key={index}
              />
            ))
          }
          renderInput={params => (
            <TextField
              {...params}
              label="Tags"
            />
          )}
        />
      </Stack>

      {user?.is_admin && (
        <Box>
          <Stack sx={boxStyle}>
            <TextField
              label="Hourly Limit"
              variant="outlined"
              size="medium"
              disabled={loading}
              name="executions_limit"
              value={formik.values.executions_limit}
              onChange={formik.handleChange}
            />
          </Stack>
          <Stack sx={boxStyle}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={checkboxStyle}
            >
              <Checkbox
                disabled={loading}
                checked={formik.values.slug === null}
                onChange={() => {
                  formik.setFieldValue("slug", formik.values.slug === null ? "" : null);
                }}
              />
              <InputLabel>Use Default</InputLabel>
            </Stack>
            <TextField
              label="Slug"
              variant="outlined"
              size="medium"
              name="slug"
              value={formik.values.slug ?? ""}
              disabled={formik.values.slug === null || loading}
              onChange={formik.handleChange}
            />
          </Stack>

          <Stack sx={boxStyle}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={checkboxStyle}
            >
              <Checkbox
                disabled={loading}
                checked={formik.values.meta_title === null}
                onChange={() => {
                  formik.setFieldValue("meta_title", formik.values.meta_title === null ? "" : null);
                }}
              />
              <InputLabel>Use Default</InputLabel>
            </Stack>
            <TextField
              label="Meta title"
              variant="outlined"
              size="medium"
              name="meta_title"
              value={formik.values.meta_title ?? ""}
              disabled={formik.values.meta_title === null || loading}
              onChange={formik.handleChange}
            />
          </Stack>

          <Stack sx={boxStyle}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={checkboxStyle}
            >
              <Checkbox
                disabled={loading}
                checked={formik.values.meta_description === null}
                onChange={() => {
                  formik.setFieldValue("meta_description", formik.values.meta_description === null ? "" : null);
                }}
              />
              <InputLabel>Use Default</InputLabel>
            </Stack>
            <TextField
              multiline
              maxRows={4}
              label="Meta Description"
              variant="outlined"
              size="medium"
              name="meta_description"
              value={formik.values.meta_description ?? ""}
              disabled={formik.values.meta_description === null || loading}
              onChange={formik.handleChange}
            />
          </Stack>

          <Stack sx={boxStyle}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={checkboxStyle}
            >
              <Checkbox
                disabled={loading}
                checked={formik.values.meta_keywords === null}
                onChange={() => {
                  formik.setFieldValue("meta_keywords", formik.values.meta_keywords === null ? "" : null);
                }}
              />
              <InputLabel>Use Default</InputLabel>
            </Stack>
            <TextField
              multiline
              maxRows={4}
              label="Meta Tags"
              variant="outlined"
              size="medium"
              name="meta_keywords"
              value={formik.values.meta_keywords ?? ""}
              disabled={formik.values.meta_keywords === null || loading}
              onChange={formik.handleChange}
            />
          </Stack>

          <Stack sx={boxStyle}>
            <Autocomplete
              disabled={loading}
              value={formik.values.status}
              onChange={(event, newValue) => {
                formik.setFieldValue("status", newValue);
              }}
              options={TemplateStatusArray}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Status"
                />
              )}
            />
          </Stack>
          {type === "edit" && (
            <Stack sx={boxStyle}>
              <FormControl variant="standard">
                <InputLabel id="execution-label">Execution Example</InputLabel>
                <Select
                  disabled={loading}
                  labelId="execution-label"
                  value={formik.values.example_execution_id}
                  onChange={event => {
                    formik.setFieldValue("example_execution_id", event.target.value);
                  }}
                >
                  {executions?.map(execution => (
                    <MenuItem
                      key={execution.id}
                      value={execution.id}
                    >
                      {`#${execution.id} - ${execution.title}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          )}
          <FormControlLabel
            control={<Switch color="primary" />}
            label="Is Internal?"
            labelPlacement="start"
            disabled={loading}
            checked={formik.values.is_internal}
            name="is_internal"
            value={formik.values.is_internal}
            onChange={() => {
              formik.setFieldValue("is_internal", !formik.values.is_internal);
            }}
            sx={{
              m: "20px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              ".MuiFormControlLabel-label": {
                fontSize: "1rem",
                fontWeight: 400,
              },
            }}
          />
        </Box>
      )}
      <Box sx={buttonBoxStyle}>
        <Button
          variant="text"
          sx={{
            color: "--secondary-main",
            display: "flex",
            padding: "8px 11px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "var(--borderRadius, 4px)",
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={loading}
          sx={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "4px",
            bgcolor: "secondary.main",
          }}
          onClick={() => {
            formik.submitForm();
          }}
        >
          {loading ? (
            <CircularProgress
              size={"20px"}
              sx={{
                color: "primary.main",
              }}
            />
          ) : (
            "Save"
          )}
        </Button>
      </Box>
      <Snackbar
        open={showSnackbar}
        onClose={closeSnackbar}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">Please try again, make sure you have entered all required template information.</Alert>
      </Snackbar>
    </Box>
  );
}

export default TemplateForm;
