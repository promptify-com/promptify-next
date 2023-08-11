import { useState, useEffect } from "react";
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
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Delete,
  Edit,
  PreviewRounded,
  SettingsApplicationsRounded,
} from "@mui/icons-material";

import {
  useDeleteTemplateMutation,
  useGetMyTemplatesQuery,
} from "@/core/api/templates";
import BaseButton from "@/components/base/BaseButton";
import { Templates } from "@/core/api/dto/templates";
import { modalStyle } from "@/components/modals/styles";
import { PageLoading } from "@/components/PageLoading";
import TemplateForm from "@/components/common/forms/TemplateForm";
import { FormType } from "@/common/types/template";

import CardTemplatePlaceholder from "@/components/placeholders/CardTemplatePlaceHolder";

export const MyTemplates = () => {
  const { data: templates, isLoading: isTemplatesLoading } =
    useGetMyTemplatesQuery();

  const [selectedTemplate, setSelectedTemplate] = useState<Templates | null>(
    null
  );
  const [templateFormOpen, setTemplateFormOpen] = useState(false);
  const [templateFormType, setTemplateFormType] = useState<FormType>("create");

  const openDeletionModal = (template: Templates) => {
    setSelectedTemplate(template);
    setConfirmDialog(true);
  };

  const [deleteTemplate, response] = useDeleteTemplateMutation();

  const confirmDelete = async () => {
    if (!selectedTemplate) return;

    await deleteTemplate(selectedTemplate.id);
    setConfirmDialog(false);
  };

  const [confirmDialog, setConfirmDialog] = useState(false);
  return (
    <Box
      id="my-templates"
      width={"100%"}
      sx={{
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography
          textAlign={{ xs: "center", sm: "start" }}
          sx={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: { xs: 18, md: 24 },
            lineHeight: { xs: "133.4%", sm: "123.5%" },
            display: "flex",
            alignItems: "center",
            color: "onSurface",
          }}
        >
          My templates
        </Typography>
        <BaseButton
          onClick={() => {
            setTemplateFormOpen(true);
            setTemplateFormType("create");
          }}
          variant="contained"
          color="primary"
        >
          New
        </BaseButton>
      </Box>
      {isTemplatesLoading ? (
        <CardTemplatePlaceholder count={6} />
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
                          setTemplateFormType("edit");
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

      {templates && templates.length == 0 && (
        <Typography textAlign={"center"}>
          All your templates will be listed here! This feature is coming soon.
        </Typography>
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
            type={templateFormType}
            templateData={selectedTemplate}
            onSaved={() => {
              setTemplateFormOpen(false);
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};
