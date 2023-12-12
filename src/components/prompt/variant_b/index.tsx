import { useEffect, type Dispatch, type SetStateAction, Fragment } from "react";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import GeneratorChat from "../common/chat";
import Header from "../common/Header";
import TemplateToolbar from "../common/Sidebar";
import ToolbarDrawer from "../common/Sidebar/ToolbarDrawer";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import { setGeneratedExecution, setSelectedExecution, setSparkHashQueryParam } from "@/core/store/executionsSlice";
import { isValidUserFn } from "@/core/store/userSlice";
import { useGetExecutionsByTemplateQuery } from "@/core/api/executions";
import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import { InfoOutlined } from "@mui/icons-material";
import { Link } from "@/common/types/TemplateToolbar";
import { theme } from "@/theme";
import ClientOnly from "@/components/base/ClientOnly";

interface TemplateVariantBProps {
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  questionPrefixContent: string;
}

export default function TemplateVariantB({ template, setErrorMessage, questionPrefixContent }: TemplateVariantBProps) {
  const dispatch = useAppDispatch();

  const isValidUser = useAppSelector(isValidUserFn);
  const selectedExecution = useAppSelector(state => state.executions.selectedExecution);
  const generatedExecution = useAppSelector(state => state.executions.generatedExecution);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  const {
    data: executions,
    isLoading: isExecutionsLoading,
    refetch: refetchTemplateExecutions,
  } = useGetExecutionsByTemplateQuery(isValidUser ? template.id : skipToken);

  useEffect(() => {
    if (!isGenerating && generatedExecution?.data?.length) {
      const promptNotCompleted = generatedExecution.data.find(execData => !execData.isCompleted);

      if (!promptNotCompleted) {
        dispatch(setSelectedExecution(null));
        dispatch(setGeneratedExecution(null));
        refetchTemplateExecutions();
      }
    }
  }, [isGenerating, generatedExecution]);

  const handleSelectExecution = ({
    execution,
    resetHash = false,
  }: {
    execution: TemplatesExecutions | null;
    resetHash?: boolean;
  }) => {
    if (resetHash) {
      dispatch(setSparkHashQueryParam(null));
    }

    dispatch(setSelectedExecution(execution));
  };

  useEffect(() => {
    if (!executions) {
      return;
    }

    const wantedExecutionId = selectedExecution?.id.toString();

    if (wantedExecutionId) {
      const _selectedExecution = executions.find(exec => exec.id.toString() === wantedExecutionId);

      handleSelectExecution({ execution: _selectedExecution || null, resetHash: true });
    } else {
      handleSelectExecution({ execution: template.example_execution || null, resetHash: true });
    }
  }, [executions]);

  const ToolbarItems: Link[] = [
    {
      name: "executions",
      icon: <NoteStackIcon />,
      title: "My Works",
    },

    {
      name: "details",
      icon: <InfoOutlined />,
      title: "Template details",
    },
  ];

  const renderIcon = (link: Link) => {
    if (link.name === "executions") {
      return <NoteStackIcon color={theme.palette.primary.main} />;
    }
    return link.icon;
  };

  return (
    <Stack
      mt={{ xs: 8, md: 0 }}
      height={{ xs: "calc(100svh - 65px)", md: "calc(100svh - 90px)" }}
    >
      <Header template={template} />

      <Stack
        py={1}
        direction={"row"}
        alignItems={"center"}
        gap={"20px"}
        display={{ xs: "flex", md: "none" }}
        mx={"16px"}
      >
        {ToolbarItems.map(link => (
          <Fragment key={link.name}>
            {executions?.length && link.name === "executions" ? (
              <Badge
                badgeContent={executions.length}
                color="primary"
              >
                <Button
                  onClick={() => dispatch(setActiveToolbarLink(link))}
                  variant="text"
                  startIcon={<Icon>{renderIcon(link)}</Icon>}
                  sx={{
                    height: 22,
                    p: "15px",
                    bgcolor: "surface.3",
                  }}
                >
                  {link.title}
                </Button>
              </Badge>
            ) : (
              <Button
                variant="text"
                onClick={() => dispatch(setActiveToolbarLink(link))}
                startIcon={<Icon sx={{ py: "4px", pr: "2px", mt: -0.5 }}>{renderIcon(link)}</Icon>}
                sx={{
                  height: 22,
                  p: "15px",
                  bgcolor: "surface.3",
                }}
              >
                {link.title}
              </Button>
            )}
          </Fragment>
        ))}
      </Stack>
      <Grid
        mt={0}
        gap={"1px"}
        container
        flexWrap={"nowrap"}
        mx={"auto"}
        bgcolor={"surface.1"}
        width={"100%"}
        height={{ xs: "calc(100svh)", md: "calc(100% - 68px)" }}
        position={"relative"}
        overflow={"auto"}
        sx={{
          "&::-webkit-scrollbar": {
            width: "6px",
            p: 1,
            bgcolor: "surface.1",
          },
          "&::-webkit-scrollbar-track": {
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "surface.1",
            outline: "1px solid surface.1",
            borderRadius: "10px",
          },
        }}
      >
        <Stack
          width={"100%"}
          position={"sticky"}
          bottom={0}
          zIndex={100}
          height={"100%"}
          overflow={"auto"}
          sx={{
            borderColor: "surface.3",
            "&::-webkit-scrollbar": {
              width: "6px",
              p: 1,
              backgroundColor: "surface.5",
            },
            "&::-webkit-scrollbar-track": {
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "surface.1",
              outline: "1px solid surface.1",
              borderRadius: "10px",
            },
          }}
        >
          <ClientOnly>
            <GeneratorChat
              onError={setErrorMessage}
              template={template}
              questionPrefixContent={questionPrefixContent}
            />
          </ClientOnly>
        </Stack>

        <TemplateToolbar template={template} />
        <ToolbarDrawer
          template={template}
          executions={executions!}
          isExecutionsLoading={isExecutionsLoading}
          refetchTemplateExecutions={refetchTemplateExecutions}
        />
      </Grid>
    </Stack>
  );
}
