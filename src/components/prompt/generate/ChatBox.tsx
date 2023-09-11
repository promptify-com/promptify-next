import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import { useWindowSize } from "usehooks-ts";
import { ExpandLess, ExpandMore, MoreVert, Search, Send } from "@mui/icons-material";
import { useSelector } from "react-redux";

import LogoAsAvatar from "@/assets/icons/LogoAvatar";
import { RootState } from "@/core/store";
import { TemplateQuestionGeneratorData } from "@/core/api/dto/prompts";
import { useAppSelector } from "@/hooks/useStore";
import useToken from "@/hooks/useToken";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export const ChatMode: React.FC = () => {
  const template = useAppSelector(state => state.template.template);

  function replacePlaceholders(text: string) {
    return text.replace(/{{/g, "[[").replace(/}}/g, "]]");
  }

  useEffect(() => {
    if (template) {
      generateQuestions();
    }
  }, []);

  const token = useToken();

  const generateQuestions = () => {
    let data: TemplateQuestionGeneratorData[];

    if (template) {
      const modifiedTemplate = {
        ...template,
        prompts: template.prompts.map(prompt => ({
          id: prompt.id,
          order: prompt.order,
          title: prompt.title,
          execution_priority: prompt.execution_priority,
          content: replacePlaceholders(prompt.content),
          parameters: [],
        })),
      };
      data = [
        {
          prompt: 1795,
          contextual_overrides: [],
          prompt_params: {
            TemplateData: {
              id: modifiedTemplate.id,
              title: modifiedTemplate.title,
              description: modifiedTemplate.description,
              //@ts-ignore
              prompts: modifiedTemplate.prompts,
            },
          },
        },
      ];
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/meta/templates/515/execute/?streaming=true`;
      //@ts-ignore
      let markdownData = []; // Initialize an array to store messages
      //@ts-ignore
      // let questions = [];

      fetchEventSource(url, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        openWhenHidden: true,

        onmessage(msg) {
          markdownData.push(msg.data);
        },

        onclose() {},
      });
    }
  };

  const { width: windowWidth } = useWindowSize();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [chatExpanded, setChatExpanded] = useState(true);

  return (
    <Grid
      width={"100%"}
      overflow={"hidden"}
      borderRadius={"16px"}
      minHeight={{ xs: "70vh", md: "auto" }}
      position={"relative"}
    >
      <Accordion
        expanded={windowWidth < 960 ? true : chatExpanded}
        onChange={() => setChatExpanded(prev => !prev)}
        sx={{
          boxShadow: "none",
          bgcolor: "surface.1",
          borderRadius: "16px",
          overflow: "hidden",
          ".MuiAccordionDetails-root": {
            p: "0",
          },
          ".MuiAccordionSummary-root": {
            minHeight: "48px",
            ":hover": {
              opacity: 0.8,
              svg: {
                color: "primary.main",
              },
            },
          },
          ".MuiAccordionSummary-content": {
            m: 0,
          },
        }}
      >
        <AccordionSummary sx={{ display: { xs: "none", md: "flex" } }}>
          <Grid
            display={"flex"}
            alignItems={"center"}
            gap={"16px"}
            width={"100%"}
            justifyContent={"space-between"}
          >
            <Grid
              display={"flex"}
              alignItems={"center"}
              gap={"16px"}
            >
              {!chatExpanded ? <ExpandMore sx={{ fontSize: 16 }} /> : <ExpandLess sx={{ fontSize: 16 }} />}

              <Typography
                px={"8px"}
                sx={{
                  fontSize: 13,
                  lineHeight: "22px",
                  letterSpacing: "0.46px",
                  color: "onSurface",
                  opacity: 0.8,
                }}
              >
                Chat with Promptify
              </Typography>
            </Grid>
            <Grid>
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                }}
                size="small"
                sx={{
                  border: "none",
                }}
              >
                <Search />
              </IconButton>
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                }}
                size="small"
                sx={{
                  border: "none",
                }}
              >
                <MoreVert />
              </IconButton>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            borderTop: { xs: "none", md: "2px solid #ECECF4" },
          }}
        >
          <Grid
            display={"flex"}
            flexDirection={"column"}
            gap={"8px"}
          >
            <Grid
              p={"16px"}
              display={"flex"}
              flexDirection={{ xs: "column", md: "row" }}
              gap={"16px"}
            >
              <LogoAsAvatar />
              <Grid flex={1}>
                <Typography>Hi, {currentUser?.username}. Welcome. I can help you with your</Typography>
                <Typography mt={4}> We need following things:</Typography>
              </Grid>
            </Grid>
            <Grid
              p={"16px"}
              position={{ xs: "fixed", md: "inherit" }}
              bottom={"60px"}
              zIndex={99}
              left={0}
              right={0}
            >
              <Box
                bgcolor={"surface.3"}
                display={"flex"}
                alignItems={"center"}
                borderRadius="99px"
                minHeight={"32px"}
                p={"8px 16px"}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1, fontSize: 13, lineHeight: "22px", letterSpacing: "0.46px", fontWeight: "500" }}
                  placeholder="Chat with Promptify"
                  inputProps={{ "aria-label": "Name" }}
                />

                <Send
                  onClick={() => {}}
                  sx={{
                    cursor: "pointer",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};
