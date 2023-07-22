import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import TemplateFormModal from "@/components/modals/TemplateFormModal";
import { promptsApi, useDeleteTemplateMutation } from "@/core/api/prompts";
import { Templates } from "@/core/api/dto/templates";
import { PageLoading } from "@/components/PageLoading";
import TemplateImportModal from "../modals/TemplateImportModal";
import { Delete } from "@mui/icons-material";

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
    <Box width={"100%"} display={{ xs: "none", sm: "block" }} mt={"30px"}>
      <Box display="flex" justifyContent="space-between">
        <Typography
          fontWeight={500}
          fontSize={{ xs: "1.5rem", sm: "2rem" }}
          textAlign={{ xs: "center", sm: "start" }}
        >
          Prompts
        </Typography>
        <Stack mb={-1} direction={"row"} spacing={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setTemplateImportOpen(true);
            }}
            sx={{ height: "30px" }}
          >
            Import JSON
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              setModalPromptData([]);
              setModalNew(true);
              setTemplateFormOpen(true);
            }}
            sx={{ height: "30px" }}
          >
            Create NEW
          </Button>
        </Stack>
      </Box>
      {isFetching ? (
        <PageLoading />
      ) : (
        <Box>
          {promptsData?.map((prompt) => {
            return (
              <Paper key={prompt.id} elevation={0} sx={{ marginTop: "4px" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  padding="20px"
                >
                  <Typography>ID: {prompt.id}</Typography>
                  <Typography>{prompt.title}</Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => {
                        window.open(
                          window.location.origin + `/prompt/${prompt.slug}`,
                          "_blank"
                        );
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        window.open(
                          window.location.origin + `/builder/${prompt.id}`,
                          "_blank"
                        );
                      }}
                    >
                      Builder
                    </Button>
                    <Button
                      variant="contained"
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
                      Edit
                    </Button>
                    <IconButton
                      onClick={() => openModal(prompt.id)}
                      size="large"
                      sx={{
                        bgcolor: "#ef4444",
                        border: "none",
                        color: "white",
                        "&:hover": {
                          bgcolor: "surface.3",
                          color: "#ef4444",
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
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
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Disagree</Button>
          <Button onClick={() => confirmDelete()}>Agree</Button>
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
