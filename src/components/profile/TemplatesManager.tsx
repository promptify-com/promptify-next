import React, { useMemo, useState, FC } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Modal,
  NativeSelect,
  Stack,
  Typography,
} from "@mui/material";

import { useDeleteTemplateMutation, useGetMyTemplatesQuery, useGetTemplatesByFilterQuery } from "@/core/api/templates";
import { TemplateStatus, Templates } from "@/core/api/dto/templates";
import TemplateImportModal from "@/components/modals/TemplateImportModal";
import TemplateForm from "@/components/common/forms/TemplateForm";
import BaseButton from "@/components/base/BaseButton";
import { modalStyle } from "@/components/modals/styles";
import { FormType } from "@/common/types/template";
import { TemplateStatusArray } from "@/common/constants";
import { PageLoading } from "../PageLoading";
import TemplateManagerItem from "./TemplateManagerItem";

export type UserType = "admin" | "user";

interface TemplateManagerProps {
  type: UserType;
  title: string;
}

export const TemplatesManager: FC<TemplateManagerProps> = ({ type, title }) => {
  const { data: templates, isFetching } =
    type === "admin" ? useGetTemplatesByFilterQuery({ ordering: "-created_at" }) : useGetMyTemplatesQuery();

  const [deleteTemplate] = useDeleteTemplateMutation(); // auto update templates daaata without refretch again

  const [templateImportOpen, setTemplateImportOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Templates | null>(null);
  const [templateFormType, setTemplateFormType] = useState<FormType>("create");
  const [status, setStatus] = useState<TemplateStatus | null>("ALL");

  const [templateFormOpen, setTemplateFormOpen] = useState(false);

  const openDeletionModal = (template: Templates) => {
    setSelectedTemplate(template);
    setConfirmDialog(true);
  };

  const filteredTemplates = useMemo(() => {
    if (type === "admin" && status !== "ALL" && templates) {
      return templates.filter(template => template.status === status);
    }
    return templates ?? [];
  }, [templates, status]);

  const confirmDelete = async () => {
    if (!selectedTemplate) return;

    await deleteTemplate(selectedTemplate.id);
    setConfirmDialog(false);
  };

  const [confirmDialog, setConfirmDialog] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      width={"100%"}
      gap={"16px"}
    >
      <Box
        display="flex"
        gap={2}
        width={"100%"}
        alignItems={{ xs: "start", md: "center" }}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: { xs: 18, md: 24 },
            lineHeight: { xs: "133.4%", sm: "123.5%" },
            display: "flex",
            alignItems: "center",
            color: "#1B1B1E",
          }}
        >
          {title}
        </Typography>
        {type === "admin" ? (
          <Stack
            direction={"row"}
            justifyContent={"end"}
            alignItems={"center"}
            ml={{ xs: "auto" }}
            spacing={1}
          >
            <FormControl
              sx={{ m: 1 }}
              variant="standard"
            >
              <NativeSelect
                id="status"
                sx={{
                  fontSize: 15,
                }}
                value={status ?? "ALL"}
                onChange={event => {
                  setStatus(event.target.value as TemplateStatus);
                }}
              >
                <option value="ALL">All Status</option>
                {TemplateStatusArray.map((item: TemplateStatus) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <BaseButton
              size="small"
              onClick={() => {
                setTemplateImportOpen(true);
              }}
              color="primary"
              variant="contained"
              style={{ fontWeight: 500 }}
            >
              Import JSON
            </BaseButton>

            <BaseButton
              size="small"
              onClick={() => {
                setSelectedTemplate(null);
                setTemplateFormType("create");
                setTemplateFormOpen(true);
              }}
              color="primary"
              variant="contained"
              style={{ fontWeight: 500 }}
            >
              Create New
            </BaseButton>
          </Stack>
        ) : (
          <Stack
            direction={"row"}
            justifyContent={"end"}
            alignItems={"center"}
            ml={{ xs: "auto" }}
            spacing={1}
          >
            <BaseButton
              onClick={() => {
                setTemplateFormOpen(true);
                setSelectedTemplate(null);
                setTemplateFormType("create");
              }}
              variant="contained"
              color="primary"
            >
              New
            </BaseButton>
          </Stack>
        )}
      </Box>
      {isFetching && filteredTemplates.length === 0 ? (
        <PageLoading />
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={"14px"}
          width={"100%"}
        >
          {filteredTemplates.length === 0 ? (
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              minHeight={"30vh"}
            >
              <Typography variant="body1">No templates found.</Typography>
            </Box>
          ) : (
            filteredTemplates.map((template: Templates) => {
              return (
                <TemplateManagerItem
                  key={template.id}
                  type={type}
                  template={template}
                  onOpenEdit={() => {
                    setSelectedTemplate(template);
                    setTemplateFormType("edit");
                    setTemplateFormOpen(true);
                  }}
                  onOpenDelete={() => openDeletionModal(template)}
                />
              );
            })
          )}
        </Box>
      )}
      <Dialog
        open={confirmDialog}
        keepMounted
        onClose={() => setConfirmDialog(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this item? Once deleted, it cannot be recovered. Please proceed with
            caution.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={() => confirmDelete()}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={templateFormOpen}
        onClose={() => setTemplateFormOpen(false)}
      >
        <Box sx={modalStyle}>
          <TemplateForm
            type={templateFormType}
            templateData={selectedTemplate}
            onSaved={() => setTemplateFormOpen(false)}
            onClose={() => setTemplateFormOpen(false)}
          />
        </Box>
      </Modal>

      <TemplateImportModal
        open={templateImportOpen}
        setOpen={setTemplateImportOpen}
        refetchTemplates={() => {}} // this needs to be refactored no need to refetch data
      />
    </Box>
  );
};
