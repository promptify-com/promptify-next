import React, { useMemo, useState, FC, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputBase,
  Modal,
  NativeSelect,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  templatesApi,
  useDeleteTemplateMutation,
  useGetMyTemplatesQuery,
  useGetTemplatesByFilterQuery,
} from "@/core/api/templates";
import { TemplateStatus, Templates } from "@/core/api/dto/templates";
import TemplateImportModal from "@/components/modals/TemplateImportModal";
import TemplateForm from "@/components/common/forms/TemplateForm";
import BaseButton from "@/components/base/BaseButton";
import { modalStyle } from "@/components/modals/styles";
import { FormType } from "@/common/types/template";
import { TemplateStatusArray } from "@/common/constants";
import { PageLoading } from "../PageLoading";
import TemplateManagerItem from "./TemplateManagerItem";
import { ArrowLeft, ArrowRight, ArrowRightAlt, Search } from "@mui/icons-material";
import TemplatesPaginatedList from "../TemplatesPaginatedList";
import { useGetTemplatesByFilter } from "@/hooks/useGetTemplatesByFilter";
import CardTemplatePlaceholder from "../placeholders/CardTemplatePlaceHolder";

export type UserType = "admin" | "user";

interface TemplateManagerProps {
  type: UserType;
  title: string;
}

export const TemplatesManager: FC<TemplateManagerProps> = ({ type, title }) => {
  const isUserAdmin = type === "admin";

  const { data: userTemplates, isFetching: isUserTemplatesFetching } = useGetMyTemplatesQuery(undefined, {
    skip: isUserAdmin,
  });

  const [deleteTemplate] = useDeleteTemplateMutation();
  const [templateImportOpen, setTemplateImportOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Templates | null>(null);
  const [templateFormType, setTemplateFormType] = useState<FormType>("create");
  const [status, setStatus] = useState<TemplateStatus | null>("ALL");
  const [templateFormOpen, setTemplateFormOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const {
    templates: adminTemplates,
    isTemplatesLoading: isAdminTemplatesLoading,
    hasNext,
    hasPrev,
    handleNextPage,
    handlePreviousPage,
    searchName,
    setSearchName,
    debouncedSearchName,
    resetOffest,
    isFetching,
  } = useGetTemplatesByFilter();

  const openDeletionModal = (template: Templates) => {
    setSelectedTemplate(template);
    setConfirmDialog(true);
  };

  const filteredTemplates = useMemo(() => {
    if (isUserAdmin && status !== "ALL" && adminTemplates) {
      return adminTemplates.results.filter(template => template.status === status);
    }
    return adminTemplates?.results ?? [];
  }, [adminTemplates, status, isUserAdmin]);

  useEffect(() => {
    resetOffest();
  }, [debouncedSearchName, status]);

  const confirmDelete = async () => {
    if (!selectedTemplate) return;

    await deleteTemplate(selectedTemplate.id);
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
        {isUserAdmin ? (
          <Stack
            direction={"row"}
            justifyContent={"end"}
            alignItems={"center"}
            ml={{ xs: "auto" }}
            spacing={1}
          >
            <Box
              display={"flex"}
              bgcolor={"surface.1"}
              alignItems={"center"}
              p={"4px 16px"}
              width={"200px"}
              borderRadius={"99px"}
            >
              <Search sx={{ fontSize: 18, opacity: 0.6 }} />
              <InputBase
                sx={{ ml: 1, flex: 1, fontSize: 14 }}
                placeholder="Search..."
                inputProps={{ "aria-label": "Search" }}
                defaultValue={searchName}
                onChange={e => setSearchName(e.target.value)}
              />
            </Box>

            <FormControl sx={{ m: 1 }}>
              <NativeSelect
                id="status"
                variant="outlined"
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

      {isUserAdmin ? (
        <Grid width={"100%"}>
          {isAdminTemplatesLoading ? (
            <CardTemplatePlaceholder count={4} />
          ) : (
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={"14px"}
              width={"100%"}
            >
              {filteredTemplates?.length === 0 ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="30vh"
                >
                  <Typography variant="body1">No templates found.</Typography>
                </Box>
              ) : (
                <TemplatesPaginatedList
                  hasNext={hasNext}
                  loading={isFetching}
                  hasPrev={hasPrev}
                  onNextPage={handleNextPage}
                  onPrevPage={handlePreviousPage}
                >
                  {filteredTemplates?.map((template: Templates) => (
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
                  ))}
                </TemplatesPaginatedList>
              )}
            </Box>
          )}
        </Grid>
      ) : (
        <Grid width={"100%"}>
          {isUserTemplatesFetching && userTemplates?.length === 0 ? (
            <CardTemplatePlaceholder count={4} />
          ) : (
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={"14px"}
              width={"100%"}
            >
              {userTemplates?.length === 0 ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="30vh"
                >
                  <Typography variant="body1">No templates found.</Typography>
                </Box>
              ) : (
                userTemplates?.map((template: Templates) => (
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
                ))
              )}
            </Box>
          )}
        </Grid>
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
