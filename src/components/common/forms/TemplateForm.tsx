import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { object, string } from "yup";
import { useFormik } from "formik";
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
import { usePathname } from "next/navigation";

import { useGetTagsQuery } from "@/core/api/tags";
import { fieldStyle, boxStyle, buttonBoxStyle, checkboxStyle } from "@/components/modals/styles";
import { useGetCategoriesQuery } from "@/core/api/categories";
import useToken from "@/hooks/useToken";
import { useGetCurrentUserQuery } from "@/core/api/user";
import { useCreateTemplateMutation, useUpdateTemplateMutation } from "@/core/api/templates";
import { TemplateStatusArray } from "@/common/constants";
import { executionsApi } from "@/core/api/executions";
import { stripTags, getLanguageFromCode, getBaseUrl } from "@/common/helpers";
import { useUploadFileMutation } from "@/core/api/uploadFile";
import { uploadFileHelper } from "@/components/Prompt/Utils/uploadFileHelper";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import type { IEditTemplate } from "@/common/types/editTemplate";
import type { FormType } from "@/common/types/template";

interface Props {
  type?: FormType;
  templateData: Templates | null | undefined;
  modalNew?: boolean;
  onSaved?: (template?: Templates) => void;
  onClose?: () => void;
  darkMode?: boolean;
}

function TemplateForm({ type = "create", templateData, onSaved, onClose, darkMode = false }: Props) {
  const token = useToken();
  const pathname = usePathname();

  const { data: categories } = useGetCategoriesQuery();
  const { data: fetchedTags } = useGetTagsQuery();
  const { data: user } = useGetCurrentUserQuery(token);
  const [createTemplate] = useCreateTemplateMutation();
  const [updateTemplate] = useUpdateTemplateMutation();
  const [getTemplateExecution] = executionsApi.endpoints.getExecutionsByTemplate.useLazyQuery();
  const [uploadFile] = useUploadFileMutation();

  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [executions, setExecutions] = useState<TemplatesExecutions[]>();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const getExecutions = async () => {
    if (!templateData) return null;
    const response = await getTemplateExecution(templateData.id);
    setExecutions(response.data);
    setSelectedTags(templateData?.tags?.map(tag => tag.name) ?? []);
  };

  useEffect(() => {
    getExecutions();
  }, [templateData]);

  useEffect(() => {
    if (fetchedTags) setTags(fetchedTags.map(tag => tag.name));
  }, [fetchedTags]);

  useEffect(() => {
    formik.setFieldValue(
      "tags",
      selectedTags.map(tag => ({ name: tag })),
    );
  }, [selectedTags]);

  const handleImageChange = (image: File) => {
    setSelectedFile(image);
    formik.setFieldValue("thumbnail", URL.createObjectURL(image));
  };

  const addNewTag = (newValue: string[]) => {
    setSelectedTags(newValue);
  };

  const FormSchema = object({
    title: string().min(1).required("required"),
    description: string().min(1).required("required"),
    thumbnail: string().min(1).required("required"),
  });

  const handleSave = (newTemplate?: Templates) => {
    if (typeof onSaved !== "undefined") {
      onSaved(newTemplate);
    }
    formik.resetForm();
  };

  const onEditTemplate = async (values: IEditTemplate) => {
    if (!templateData) return;
    if (selectedFile) {
      const result = await uploadFileHelper(uploadFile, { file: selectedFile });

      if (typeof result?.file === "string") {
        values.thumbnail = result.file;
      }
    }
    await updateTemplate({
      id: templateData.id,
      data: values,
    });

    handleSave();
  };

  const onCreateTemplate = async (values: IEditTemplate) => {
    setLoading(true);
    if (selectedFile) {
      const result = await uploadFileHelper(uploadFile, { file: selectedFile });

      if (typeof result?.file === "string") {
        values.thumbnail = result.file;
        const newTemplate = await createTemplate(values).unwrap();

        handleSave(newTemplate);

        if (type === "create" && pathname === "/prompt-builder/create") {
          return;
        }
        window.open(`${getBaseUrl}/prompt-builder/${newTemplate.slug}`, "_blank");
      }
    }
    setLoading(false);
  };

  const formik = useFormik<IEditTemplate>({
    initialValues: {
      title: templateData?.title ? stripTags(templateData.title) : "",
      description: templateData?.description ? stripTags(templateData.description) : "",
      duration: templateData?.duration?.toString() ?? "1",
      difficulty: templateData?.difficulty ?? "BEGINNER",
      is_visible: templateData?.is_visible ?? true,
      language: templateData?.language ?? "en-us",
      category: templateData?.category?.id ?? 1,
      context: templateData?.context ? stripTags(templateData.context) : "",
      tags: templateData?.tags ?? [],
      thumbnail: templateData?.thumbnail ?? "",
      executions_limit: templateData?.executions_limit ?? -1,
      slug: templateData?.slug ? stripTags(templateData.slug) : "",
      meta_title: templateData?.meta_title ? stripTags(templateData.meta_title) : "",
      meta_description: templateData?.meta_description ? stripTags(templateData.meta_description) : "",
      meta_keywords: templateData?.meta_keywords ? stripTags(templateData.meta_keywords) : "",
      status: templateData?.status ?? "DRAFT",
      is_internal: templateData?.is_internal ?? false,
      ...(type === "edit" && {
        example_execution_id: templateData?.example_execution?.id ?? null,
      }),
      ...(type === "create" && { prompts_list: [] }),
    },
    enableReinitialize: true,
    validationSchema: FormSchema,
    onSubmit: type === "create" ? onCreateTemplate : onEditTemplate,
  });

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
          error={formik.touched.title && formik.values.title === ""}
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
          error={formik.touched.description && formik.values.description === ""}
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
                bgcolor: "surface.4",
                color: "primary.main",
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
                variant="caption"
              >
                {`Thumbnail is ${formik.errors.thumbnail}`}
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
          options={tags}
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
    </Box>
  );
}

export default TemplateForm;
