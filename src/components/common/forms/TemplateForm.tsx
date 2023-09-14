import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { object, string } from "yup";
import { useFormik } from "formik";
import {
  Select,
  MenuItem,
  TextField,
  Chip,
  Autocomplete,
  InputLabel,
  Checkbox,
  Stack,
  IconButton,
  Icon,
} from "@mui/material";
import { useGetTagsQuery } from "@/core/api/tags";
import { Templates } from "@/core/api/dto/templates";
import { IEditTemplate } from "@/common/types/editTemplate";
import { authClient } from "@/common/axios";
import { fieldStyle, boxStyle, buttonBoxStyle, typographyStyle, checkboxStyle } from "../../modals/styles";
import { useGetCategoriesQuery } from "@/core/api/categories";
import { Close, Upload } from "@mui/icons-material";
import useToken from "@/hooks/useToken";
import { useGetCurrentUserQuery } from "@/core/api/user";
import { useCreateTemplateMutation, useUpdateTemplateMutation } from "@/core/api/templates";
import { FormType } from "@/common/types/template";
import { TemplateStatusArray } from "@/common/constants";

interface Props {
  type?: FormType;
  templateData: Templates | null;
  modalNew?: boolean;
  onSaved?: () => void;
  onClose?: () => void;
  darkMode?: boolean;
}

const TemplateForm: React.FC<Props> = ({
  type = "create",
  templateData,
  onSaved = () => {},
  onClose = () => {},
  darkMode = false,
}) => {
  const token = useToken();
  const { data: categories } = useGetCategoriesQuery();
  const { data: fetchedTags } = useGetTagsQuery();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { data: user } = useGetCurrentUserQuery(token);
  const [createTemplate] = useCreateTemplateMutation();
  const [updateTemplate] = useUpdateTemplateMutation();

  useEffect(() => {
    setSelectedTags(templateData?.tags.map(tag => tag.name) ?? []);
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

  // TODO - No need to upload image and then preview it, just preview it and upload on submit
  const getUrlImage = async (image: File) => {
    const file = new FormData();
    file.append("file", image);
    const {
      data: { file_url },
    } = await authClient.post("/api/upload/", file);
    formik.setFieldValue("thumbnail", file_url);
  };

  const addNewTag = (newValue: string[]) => {
    setSelectedTags(newValue);
  };

  const FormSchema = object({
    title: string().min(1).required("required"),
    description: string().min(1).required("required"),
    thumbnail: string().min(1).required("required"),
  });

  const handleSave = () => {
    onSaved();
    formik.resetForm();
  };

  const onEditTemplate = async (values: IEditTemplate) => {
    if (!templateData) return;
    await updateTemplate({
      id: templateData?.id,
      data: values,
    });
    handleSave();
  };

  const onCreateTemplate = async (values: IEditTemplate) => {
    const response = await createTemplate(values).unwrap();
    const { id } = response;
    handleSave();
    window.open(window.location.origin + `/builder/${id}`, "_blank");
  };

  const formik = useFormik<IEditTemplate>({
    initialValues: {
      title: templateData?.title ?? "",
      description: templateData?.description ?? "",
      duration: templateData?.duration?.toString() ?? "1",
      difficulty: templateData?.difficulty ?? "BEGINNER",
      is_visible: templateData?.is_visible ?? true,
      language: templateData?.language ?? "en-us",
      category: templateData?.category?.id ?? 1,
      context: templateData?.context ?? "",
      tags: templateData?.tags ?? [],
      thumbnail: templateData?.thumbnail ?? "",
      executions_limit: templateData?.executions_limit ?? -1,
      slug: templateData?.slug ?? "",
      meta_title: templateData?.meta_title ?? "",
      meta_description: templateData?.meta_description ?? "",
      meta_keywords: templateData?.meta_keywords ?? "",
      status: templateData?.status ?? "DRAFT",
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
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  lineHeight: "24px" /* 171.429% */,
                  letterSpacing: "0.2px",
                }}
              >
                Upload
              </Typography>

              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(args: any) => {
                  getUrlImage(args.target.files[0]);
                }}
              />
            </Stack>
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
          fullWidth
          renderInput={params => (
            <TextField
              {...params}
              label="Language"
            />
          )}
          getOptionLabel={option => {
            switch (option) {
              case "en-us":
                return "English";
              case "es":
                return "Spanish";
              case "fr":
                return "French";
              default:
                return "";
            }
          }}
        />
      </Stack>
      {categories && (
        <Stack sx={boxStyle}>
          <Autocomplete
            value={categories.find(category => category.id === formik.values.category)}
            onChange={(event, newValue) => {
              formik.setFieldValue("category", newValue?.id);
            }}
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
          onChange={formik.handleChange}
        />
      </Stack>
      <Stack sx={boxStyle}>
        <Autocomplete
          multiple
          freeSolo
          sx={fieldStyle}
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

      {true && (
        <Box>
          <Stack sx={boxStyle}>
            <TextField
              label="Hourly Limit"
              variant="outlined"
              size="medium"
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
              disabled={formik.values.slug === null}
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
              disabled={formik.values.meta_title === null}
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
              disabled={formik.values.meta_description === null}
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
              disabled={formik.values.meta_keywords === null}
              onChange={formik.handleChange}
            />
          </Stack>

          <Stack sx={boxStyle}>
            <Autocomplete
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
          sx={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "var(--borderRadius, 4px)",
            background: "var(--secondary-main, #1B1B1E)",
          }}
          onClick={() => {
            formik.submitForm();
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default TemplateForm;
