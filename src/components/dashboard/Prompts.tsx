import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Slide,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import TemplateFormModal from "@/components/modals/TemplateFormModal";
import { promptsApi, useDeleteTemplateMutation } from "@/core/api/prompts";
import { Templates } from "@/core/api/dto/templates";
import { PageLoading } from "@/components/PageLoading";
import TemplateImportModal from "../modals/TemplateImportModal";
import {
  Delete,
  Edit,
  PreviewRounded,
  SettingsApplicationsRounded,
} from "@mui/icons-material";

export const Prompts = () => {
  const [templateFormOpen, setTemplateFormOpen] = useState(false);
  const [templateImportOpen, setTemplateImportOpen] = useState(false);
  const [modalNew, setModalNew] = useState(false);
  const [modalPromptData, setModalPromptData] = useState<Templates[]>([]);

  const [trigger, { data: promptsData, isFetching }] =
    promptsApi.endpoints.getAllPromptTemplates.useLazyQuery();

  const [deleteTemplate, response] = useDeleteTemplateMutation();
  useEffect(() => {
    trigger();
  }, [response]);

  const [confirmDialog, setConfirmDialog] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<
    number | undefined
  >();

  const openModal = (id: number) => {
    setSelectedTemplate(id);
    setConfirmDialog(true);
  };

  const confirmDelete = async () => {
    await deleteTemplate(selectedTemplate as number);
    setConfirmDialog(false);
  };

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
          fontWeight={500}
          fontSize={{ xs: "1.5rem", sm: "2rem" }}
          textAlign={{ xs: "center", sm: "start" }}
        >
          Prompts
        </Typography>
        <Stack
          direction={"row"}
          justifyContent={"end"}
          ml={{ xs: "auto" }}
          spacing={1}
        >
          <Button
            size="small"
            onClick={() => {
              setTemplateImportOpen(true);
            }}
            sx={{ bgcolor: "var(--primary-main, #3B4050)", color: "surface.1" }}
          >
            Import JSON
          </Button>
          <Button
            size="small"
            onClick={() => {
              setModalPromptData([]);
              setModalNew(true);
              setTemplateFormOpen(true);
            }}
            sx={{ bgcolor: "var(--primary-main, #3B4050)", color: "surface.1" }}
          >
            Create NEW
          </Button>
        </Stack>
      </Box>
      {isFetching ? (
        <PageLoading />
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={"14px"}
          width={"100%"}
        >
          {promptsData?.map((prompt) => {
            return (
              <Card
                key={prompt.id}
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
                      image={prompt.thumbnail}
                      sx={{
                        height: { xs: "90px", md: "60px" },
                        width: "80px",
                        borderRadius: "16px",
                      }}
                    />
                    <Box>
                      <Typography>{prompt.title}</Typography>
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
                            window.location.origin + `/prompt/${prompt.slug}`,
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
                            window.location.origin + `/builder/${prompt.id}`,
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
                          const findPrompt = promptsData?.filter(
                            (data) => data.id === prompt.id
                          );
                          if (findPrompt) {
                            setModalPromptData(findPrompt);
                          }
                          setModalNew(false);
                          setTemplateFormOpen(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => openModal(prompt.id)}
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
      <TemplateFormModal
        open={templateFormOpen}
        setOpen={setTemplateFormOpen}
        data={modalPromptData}
        modalNew={modalNew}
        refetchTemplates={trigger}
      />
      <TemplateImportModal
        open={templateImportOpen}
        setOpen={setTemplateImportOpen}
        refetchTemplates={trigger}
      />
    </Box>
  );
};
