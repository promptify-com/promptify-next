import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import TemplateFormModal from "@/components/modals/TemplateFormModal";
import { promptsApi } from "@/core/api/prompts";
import { Templates } from "@/core/api/dto/templates";
import { PageLoading } from "@/components/PageLoading";
import TemplateImportModal from "../modals/TemplateImportModal";

export const Prompts = () => {
  const [templateFormOpen, setTemplateFormOpen] = useState(false);
  const [templateImportOpen, setTemplateImportOpen] = useState(false);
  const [modalNew, setModalNew] = useState(false);
  const [modalPromptData, setModalPromptData] = useState<Templates[]>([]);

  const [trigger, { data: promptsData, isFetching }] =
    promptsApi.endpoints.getAllPromptTemplates.useLazyQuery();

  useEffect(() => {
    trigger();
  }, []);

  return (
    <section
      id="prompts"
      style={{
        scrollMarginTop: "100px",
        marginTop: "8rem",
        display: "flex",
        justifyContent: "center",
        paddingBottom: "1em",
      }}
    >
      <Box width={"100%"} display={{ xs: "none", sm: "block" }}>
        <Box display="flex" justifyContent="space-between">
          <Typography
            fontWeight={500}
            fontSize={{ xs: "1.5rem", sm: "2rem" }}
            textAlign={{ xs: "center", sm: "start" }}
          >
            Prompts
          </Typography>
          <Stack direction={'row'} spacing={1}>
            <Button
              variant="contained"
              onClick={() => {
                setTemplateImportOpen(true);
              }}
            >
              Import JSON
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setModalPromptData([]);
                setModalNew(true);
                setTemplateFormOpen(true);
              }}
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
                <Paper key={prompt.id} elevation={2} sx={{ marginTop: "10px" }}>
                  <Box
                    display="flex"
                    mt="25px"
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
                    >
                      <Button
                        sx={{ mr: "20px" }}
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
                        sx={{ mr: "20px" }}
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
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
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
    </section>
  );
};
