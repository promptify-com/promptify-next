import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  NativeSelect,
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

import {
  useDeleteTemplateMutation,
  useGetTemplatesByOrderingQuery,
} from "@/core/api/templates";
import { TemplateStatus, Templates } from "@/core/api/dto/templates";
import TemplateImportModal from "@/components/modals/TemplateImportModal";
import TemplateForm from "@/components/common/forms/TemplateForm";
import BaseButton from "@/components/base/BaseButton";
import { modalStyle } from "@/components/modals/styles";
import { FormType } from "@/common/types/template";
import { TemplateStatusArray } from "@/common/constants";
import { PageLoading } from "../PageLoading";

import Image from "@/components/design-system/Image";

export const AllTemplates = () => {
  const { data: templates, isFetching } =
    useGetTemplatesByOrderingQuery("-created_at");

  const [deleteTemplate] = useDeleteTemplateMutation(); // auto update templates daaata without refretch again

  const [templateImportOpen, setTemplateImportOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Templates | null>(
    null
  );
  const [templateFormType, setTemplateFormType] = useState<FormType>("create");
  const [status, setStatus] = useState<TemplateStatus | null>("ALL");

  const [templateFormOpen, setTemplateFormOpen] = useState(false);

  const openDeletionModal = (template: Templates) => {
    setSelectedTemplate(template);
    setConfirmDialog(true);
  };

  const filteredTemplates = useMemo(() => {
    if (status !== "ALL" && templates) {
      return templates.filter((template) => template.status === status);
    }
    return templates || [];
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
          All templates
        </Typography>
        <Stack
          direction={"row"}
          justifyContent={"end"}
          alignItems={"center"}
          ml={{ xs: "auto" }}
          spacing={1}
        >
          <FormControl sx={{ m: 1 }} variant="standard">
            <NativeSelect
              id="status"
              sx={{
                fontSize: 15,
              }}
              value={status || "ALL"}
              onChange={(event) => {
                setStatus(event.target.value as TemplateStatus);
              }}
            >
              <option value="ALL">All Status</option>
              {TemplateStatusArray.map((item: TemplateStatus) => (
                <option key={item} value={item}>
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
                        sx={{
                          height: { xs: "90px", md: "60px" },
                          width: "80px",
                          borderRadius: "16px",
                        }}
                      >
                        <Image src={template.thumbnail} alt={template.title} style={{borderRadius: "16px", objectFit: "cover", width: "100%", height: "100%"}}/>
                      </CardMedia>
                      <Box>
                        <Typography>{template.title}</Typography>
                      </Box>
                      <Chip
                        label={template.status}
                        size="small"
                        sx={{ fontSize: "12px", fontWeight: 500 }}
                      />
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
                              window.location.origin +
                                `/prompt/${template.slug}`,
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
                              window.location.origin +
                                `/builder/${template.id}`,
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

      <TemplateImportModal
        open={templateImportOpen}
        setOpen={setTemplateImportOpen}
        refetchTemplates={() => {}} // this needs to be refactored no need to refetch data
      />
    </Box>
  );
};
