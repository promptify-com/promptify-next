import { object, string } from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { getBaseUrl, stripTags } from "@/common/helpers";
import { useCreateTemplateMutation, useUpdateTemplateMutation } from "@/core/api/templates";
import { uploadFileHelper } from "@/components/Prompt/Utils/uploadFileHelper";
import { useUploadFileMutation } from "@/core/api/uploadFile";
import type { Templates } from "@/core/api/dto/templates";
import type { IEditTemplate } from "@/common/types/editTemplate";
import type { FormType } from "./../common/types/template";

interface Props {
  type: FormType;
  template: Templates;
  uploadedFile?: File;
  onSaved?: (template?: Templates) => void;
}

const useTemplateForm = ({ type, template, uploadedFile, onSaved }: Props) => {
  const [updateTemplate] = useUpdateTemplateMutation();
  const [createTemplate] = useCreateTemplateMutation();
  const [uploadFile] = useUploadFileMutation();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleSave = (newTemplate?: Templates) => {
    if (typeof onSaved === "function") {
      onSaved(newTemplate);
    }
    formik.resetForm();
  };

  const onEditTemplate = async (values: IEditTemplate) => {
    if (!template) return;
    if (uploadedFile) {
      const result = await uploadFileHelper(uploadFile, { file: uploadedFile });

      if (typeof result?.file === "string") {
        values.thumbnail = result.file;
      }
    }
    await updateTemplate({
      id: template.id,
      data: values,
    });

    handleSave();
  };

  const onCreateTemplate = async (values: IEditTemplate) => {
    setLoading(true);
    if (uploadedFile) {
      const result = await uploadFileHelper(uploadFile, { file: uploadedFile });

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

  const handleSubmit = async (values: IEditTemplate) => {
    // Validate the form
    const validationErrors = await formik.validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setShowSnackbar(true);
      return;
    }

    if (type === "create") {
      onCreateTemplate(values);
    } else if (type === "edit") {
      onEditTemplate(values);
    }
  };

  const FormSchema = object({
    title: string().min(1).required("Template title field is required"),
    description: string().min(1).required("Description field is required"),
    thumbnail: string().min(1).required("Please upload a thumbnail."),
  });

  const formik = useFormik<IEditTemplate>({
    initialValues: {
      title: template?.title ? stripTags(template.title) : "",
      description: template?.description ? stripTags(template.description) : "",
      duration: template?.duration?.toString() ?? "1",
      difficulty: template?.difficulty ?? "BEGINNER",
      is_visible: template?.is_visible ?? true,
      language: template?.language ?? "en-us",
      category: template?.category?.id ?? 1,
      context: template?.context ? stripTags(template.context) : "",
      tags: template?.tags ?? [],
      thumbnail: template?.thumbnail ?? "",
      executions_limit: template?.executions_limit ?? -1,
      slug: template?.slug ? stripTags(template.slug) : "",
      meta_title: template?.meta_title ? stripTags(template.meta_title) : "",
      meta_description: template?.meta_description ? stripTags(template.meta_description) : "",
      meta_keywords: template?.meta_keywords ? stripTags(template.meta_keywords) : "",
      status: template?.status ?? "DRAFT",
      is_internal: template?.is_internal ?? false,
      ...(type === "edit" && {
        example_execution_id: template?.example_execution?.id ?? null,
      }),
      ...(type === "create" && { prompts_list: [] }),
    },
    enableReinitialize: true,
    validationSchema: FormSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleSubmit,
  });

  return {
    formik,
    loading,
    showSnackbar,
    closeSnackbar: () => setShowSnackbar(false),
    handleSubmit,
  };
};
export default useTemplateForm;
