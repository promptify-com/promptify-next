import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Delete,
  Edit,
  PreviewRounded,
  SettingsApplicationsRounded,
} from "@mui/icons-material";

import { templatesApi } from "@/core/api/templates";
import { Templates } from "@/core/api/dto/templates";
import { PageLoading } from "@/components/PageLoading";
import TemplateImportModal from "@/components/modals/TemplateImportModal";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { useDeleteTemplateMutation } from "@/core/api/templates";
import BaseButton from "../base/BaseButton";
import { modalStyle } from "../modals/styles";

import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";

export const AllTemplates = () => {
  const [templateImportOpen, setTemplateImportOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Templates | null>(
    null
  );
  const [templateFormOpen, setTemplateFormOpen] = useState(false);
  const [modalNew, setModalNew] = useState(false);

  const openDeletionModal = (template: Templates) => {
    setSelectedTemplate(template);
    setConfirmDialog(true);
  };

  const [deleteTemplate, response] = useDeleteTemplateMutation();
  useEffect(() => {
    trigger();
  }, [response]);

  const confirmDelete = async () => {
    if (!selectedTemplate) return;

    await deleteTemplate(selectedTemplate.id);
    setConfirmDialog(false);
  };

  const [trigger, { data: templates, isFetching }] =
    templatesApi.endpoints.getAllPromptTemplates.useLazyQuery();

  const [confirmDialog, setConfirmDialog] = useState(false);

  return (
    <Box
      mt={14}
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
          All templates
        </Typography>
        <Stack
          direction={"row"}
          justifyContent={"end"}
          ml={{ xs: "auto" }}
          spacing={1}
        >
          <BaseButton
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
            onClick={() => {
              setSelectedTemplate(null);
              setModalNew(true);
              setTemplateFormOpen(true);
            }}
            color="primary"
            variant="contained"
            style={{ fontWeight: 500 }}
          >
            Create New
          </BaseButton>
        </Stack>
      </Box>
      {!isFetching ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid key={index} item xs={12}>
              <CardTemplatePlaceholder />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={"14px"}
          width={"100%"}
        >
          {templates?.map((template: Templates) => {
            return (
              <Card
                key={template.id}
                elevation={0}
                sx={{
                  p: "10px",
                  borderRadius: "16px",
                  bgcolor: { xs: "surface.2", md: "surface.1" },
                }}
              >
                <Grid
                  container
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Grid
                    item
                    xs={12}
                    md={7}
                    display={"flex"}
                    alignItems={"center"}
                    gap={"16px"}
                  >
                    <CardMedia
                      component={"img"}
                      image={template.thumbnail}
                      sx={{
                        height: { xs: "90px", md: "60px" },
                        width: "80px",
                        borderRadius: "16px",
                      }}
                    />
                    <Box>
                      <Typography>{template.title}</Typography>
                    </Box>
                  </Grid>
                  <Grid
                    display={"flex"}
                    alignItems={"center"}
                    ml={"auto"}
                    gap={"8px"}
                  >
                    <Tooltip title="Preview">
                      <IconButton
                        sx={{
                          bgcolor: "surface.2",
                          border: "none",
                          color: "onSurface",
                          "&:hover": {
                            bgcolor: "surface.3",
                            color: "onSurface",
                          },
                        }}
                        onClick={() => {
                          window.open(
                            window.location.origin + `/prompt/${template.slug}`,
                            "_blank"
                          );
                        }}
                      >
                        <PreviewRounded />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Builder">
                      <IconButton
                        sx={{
                          bgcolor: "surface.2",
                          border: "none",
                          color: "onSurface",
                          "&:hover": {
                            bgcolor: "surface.3",
                            color: "onSurface",
                          },
                        }}
                        onClick={() => {
                          window.open(
                            window.location.origin + `/builder/${template.id}`,
                            "_blank"
                          );
                        }}
                      >
                        <SettingsApplicationsRounded />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        sx={{
                          bgcolor: "surface.2",
                          border: "none",
                          color: "onSurface",
                          "&:hover": {
                            bgcolor: "surface.3",
                            color: "onSurface",
                          },
                        }}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setModalNew(false);
                          setTemplateFormOpen(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => openDeletionModal(template)}
                        sx={{
                          bgcolor: "surface.2",
                          border: "none",
                          color: "onSurface",
                          "&:hover": {
                            bgcolor: "surface.3",
                            color: "#ef4444",
                          },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Card>
            );
          })}
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
            Are you sure you want to delete this item? Once deleted, it cannot
            be recovered. Please proceed with caution.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={() => confirmDelete()}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Modal open={templateFormOpen} onClose={() => setTemplateFormOpen(false)}>
        <Box sx={modalStyle}>
          <TemplateForm
            templateData={selectedTemplate}
            modalNew={modalNew}
            onSaved={() => {
              trigger();
              setTemplateFormOpen(false);
            }}
            linkBuilder={!modalNew}
          />
        </Box>
      </Modal>

      <TemplateImportModal
        open={templateImportOpen}
        setOpen={setTemplateImportOpen}
        refetchTemplates={trigger}
      />
    </Box>
  );
};
