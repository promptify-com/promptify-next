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
} from "@mui/material";
import { useGetTagsQuery } from "@/core/api/tags";
import { Templates } from "@/core/api/dto/templates";
import { IEditTemplate } from "@/common/types/editTemplate";
import { updateTemplate } from "@/hooks/api/templates";
import { authClient } from "@/common/axios";
import {
  fieldStyle,
  boxStyle,
  buttonBoxStyle,
  typographyStyle,
  checkboxStyle,
} from "../../modals/styles";
import { useGetCategoriesQuery } from "@/core/api/categories";
import { Upload } from "@mui/icons-material";
import useToken from "@/hooks/useToken";
import { useGetCurrentUserQuery } from "@/core/api/user";
import { useCreateTemplateMutation } from "@/core/api/templates";
import { FormType } from "@/common/types/template";

interface Props {
  type?: FormType;
  templateData: Templates | null;
  modalNew?: boolean;
  onSaved?: () => void;
  darkMode?: boolean;
}

const TemplateForm: React.FC<Props> = ({
  type = "create",
  templateData,
  onSaved = () => {},
  darkMode = false,
}) => {
  const token = useToken();
  const { data: categories } = useGetCategoriesQuery();
  const { data: fetchedTags } = useGetTagsQuery();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: user } = useGetCurrentUserQuery(token);

  const [createTemplate] = useCreateTemplateMutation();

  useEffect(() => {
    setSelectedTags(templateData?.tags.map((tag) => tag.name) ?? []);
  }, [templateData]);

  useEffect(() => {
    if (fetchedTags) setTags(fetchedTags.map((tag) => tag.name));
  }, [fetchedTags]);

  useEffect(() => {
    formik.setFieldValue(
      "tags",
      selectedTags.map((tag) => ({ name: tag }))
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

    await updateTemplate(templateData?.id, values);
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
      ...(type === "create" && { prompts_list: [] }),
    },
    enableReinitialize: true,
    validationSchema: FormSchema,
    onSubmit: type === "create" ? onCreateTemplate : onEditTemplate,
  });

  const color = darkMode ? "common.white" : "common.black";

  return (
    <Box sx={{ color }}>
      <Box sx={boxStyle}>
        <Typography sx={typographyStyle}>Title</Typography>
        <TextField
          multiline
          maxRows={4}
          sx={fieldStyle}
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && formik.values.title === ""}
        />
      </Box>
      <Box sx={boxStyle}>
        <Typography sx={typographyStyle}>Description</Typography>
        <TextField
          multiline
          maxRows={4}
          sx={fieldStyle}
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && formik.values.description === ""}
        />
      </Box>
      <Box sx={boxStyle}>
        <Typography sx={typographyStyle}>Thumbnail</Typography>
        <Box display="flex" flexDirection="column" width="250px">
          {formik.values.thumbnail && (
            <img
              src={formik.values.thumbnail}
              alt="thumbnail"
              style={{ height: "250px", objectFit: "cover" }}
            />
          )}
          <Box component="label">
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{
                bgcolor: "grey.600",
                color: "common.white",
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
              <Upload
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1.2rem",
                  mr: "15px",
                }}
              />
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: "inherit",
                }}
              >
                Select Image
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
      </Box>

      <Box sx={boxStyle}>
        <Typography sx={typographyStyle}>Difficulty</Typography>
        <Select
          sx={fieldStyle}
          name="difficulty"
          value={formik.values.difficulty}
          onChange={formik.handleChange}
        >
          <MenuItem value={"BEGINNER"}>Beginner</MenuItem>
          <MenuItem value={"INTERMEDIATE"}>Intermediate</MenuItem>
          <MenuItem value={"ADVANCED"}>Advanced</MenuItem>
        </Select>
      </Box>
      <Box sx={boxStyle}>
        <Typography sx={typographyStyle}>Duration</Typography>
        <TextField
          multiline
          maxRows={4}
          sx={fieldStyle}
          name="duration"
          value={formik.values.duration}
          onChange={formik.handleChange}
        />
      </Box>
      <Box sx={boxStyle}>
        <Typography sx={typographyStyle}>Visibility</Typography>
        <Select
          sx={fieldStyle}
          name="is_visible"
          value={formik.values.is_visible ? "1" : "0"}
          onChange={formik.handleChange}
        >
          <MenuItem value={1}>Yes</MenuItem>
          <MenuItem value={0}>No</MenuItem>
        </Select>
      </Box>
      <Box sx={boxStyle}>
        <Typography sx={typographyStyle}>Language</Typography>
        <Select
          sx={fieldStyle}
          name="language"
          value={formik.values.language}
          onChange={formik.handleChange}
        >
          <MenuItem value={"en-us"}>English</MenuItem>
          <MenuItem value={"es"}>Spanish</MenuItem>
          <MenuItem value={"fr"}>French</MenuItem>
        </Select>
      </Box>
      {categories && (
        <Box sx={boxStyle}>
          <Typography sx={typographyStyle}>Category</Typography>
          <Select
            sx={fieldStyle}
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
          >
            {categories.map((category) => (
              <MenuItem value={category.id} key={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
      <Box sx={boxStyle}>
        <Typography sx={typographyStyle}>Template Context</Typography>
        <TextField
          multiline
          maxRows={4}
          sx={fieldStyle}
          name="context"
          value={formik.values.context}
          onChange={formik.handleChange}
        />
      </Box>
      <Box sx={boxStyle}>
        <Typography sx={typographyStyle}>Tags</Typography>
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
                key={option}
              />
            ))
          }
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>

      {user?.is_admin && (
        <Box>
          <Box sx={boxStyle}>
            <Typography sx={typographyStyle}>Hourly Limit</Typography>
            <TextField
              maxRows={1}
              sx={fieldStyle}
              name="executions_limit"
              value={formik.values.executions_limit}
              onChange={formik.handleChange}
            />
          </Box>
          <Box sx={{ ...boxStyle, alignItems: "baseline" }}>
            <Typography sx={typographyStyle}>Slug</Typography>
            <Box>
              <Stack direction={"row"} alignItems={"center"} sx={checkboxStyle}>
                <Checkbox
                  checked={formik.values.slug === null}
                  onChange={() => {
                    formik.setFieldValue(
                      "slug",
                      formik.values.slug === null ? "" : null
                    );
                  }}
                />
                <InputLabel>Use Default</InputLabel>
              </Stack>
              <TextField
                sx={fieldStyle}
                name="slug"
                value={formik.values.slug ?? ""}
                disabled={formik.values.slug === null}
                onChange={formik.handleChange}
              />
            </Box>
          </Box>
          <Box sx={{ ...boxStyle, alignItems: "baseline" }}>
            <Typography sx={typographyStyle}>Meta title</Typography>
            <Box>
              <Stack direction={"row"} alignItems={"center"} sx={checkboxStyle}>
                <Checkbox
                  checked={formik.values.meta_title === null}
                  onChange={() => {
                    formik.setFieldValue(
                      "meta_title",
                      formik.values.meta_title === null ? "" : null
                    );
                  }}
                />
                <InputLabel>Use Default</InputLabel>
              </Stack>
              <TextField
                sx={fieldStyle}
                name="meta_title"
                value={formik.values.meta_title ?? ""}
                disabled={formik.values.meta_title === null}
                onChange={formik.handleChange}
              />
            </Box>
          </Box>
          <Box sx={{ ...boxStyle, alignItems: "baseline" }}>
            <Typography sx={typographyStyle}>Meta Description</Typography>
            <Box>
              <Stack direction={"row"} alignItems={"center"} sx={checkboxStyle}>
                <Checkbox
                  checked={formik.values.meta_description === null}
                  onChange={() => {
                    formik.setFieldValue(
                      "meta_description",
                      formik.values.meta_description === null ? "" : null
                    );
                  }}
                />
                <InputLabel>Use Default</InputLabel>
              </Stack>
              <TextField
                multiline
                maxRows={4}
                sx={fieldStyle}
                name="meta_description"
                value={formik.values.meta_description ?? ""}
                disabled={formik.values.meta_description === null}
                onChange={formik.handleChange}
              />
            </Box>
          </Box>
          <Box sx={{ ...boxStyle, alignItems: "baseline" }}>
            <Typography sx={typographyStyle}>Meta Tags</Typography>
            <Box>
              <Stack direction={"row"} alignItems={"center"} sx={checkboxStyle}>
                <Checkbox
                  checked={formik.values.meta_keywords === null}
                  onChange={() => {
                    formik.setFieldValue(
                      "meta_keywords",
                      formik.values.meta_keywords === null ? "" : null
                    );
                  }}
                />
                <InputLabel>Use Default</InputLabel>
              </Stack>
              <TextField
                sx={fieldStyle}
                name="meta_keywords"
                value={formik.values.meta_keywords ?? ""}
                disabled={formik.values.meta_keywords === null}
                onChange={formik.handleChange}
              />
            </Box>
          </Box>
        </Box>
      )}
      <Box sx={buttonBoxStyle}>
        <Button
          variant="contained"
          onClick={() => {
            formik.submitForm();
          }}
        >
          Save
        </Button>
        {type === "edit" && (
          <Button
            variant="contained"
            sx={{ mt: "20px" }}
            onClick={() => {
              window.open(
                window.location.origin + `/builder/${templateData?.id}`,
                "_blank"
              );
            }}
          >
            Prompt Builder
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TemplateForm;
