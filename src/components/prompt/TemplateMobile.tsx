import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Details } from "./Details";
import ChatBox from "./ChatBox";
import { Display } from "./Display";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { ButtonGenerateExecution } from "./ButtonGenerateExecution";
import { useAppSelector } from "@/hooks/useStore";
import { TemplateDetailsCard } from "./TemplateDetailsCard";

interface TemplateMobileProps {
  hashedExecution: TemplatesExecutions | null;
  template: Templates;
  setErrorMessage: Dispatch<SetStateAction<string>>;
}

export default function TemplateMobile({ template, hashedExecution, setErrorMessage }: TemplateMobileProps) {
  const [mobileTab, setMobileTab] = useState(1);
  const isGenerating = useAppSelector(state => state.template.isGenerating);

  useEffect(() => {
    if (isGenerating || hashedExecution?.id) {
      setMobileTab(2);
    }
  }, [isGenerating, hashedExecution]);

  const isTemplatePublished = template?.status === "PUBLISHED";
  const displayChatBox = !!template?.questions?.length && isTemplatePublished && mobileTab === 1;

  return (
    <Grid
      mt={7}
      container
      mx={"auto"}
      height={"calc(100svh - 56px)"}
      position={"relative"}
      overflow={"auto"}
      sx={{
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
      <TemplateDetailsCard template={template} />

      {displayChatBox ? (
        <Grid height={{ xs: "calc(100% - 90.5px)", md: "100%" }}>
          <ChatBox
            onError={setErrorMessage}
            key={template?.id}
            template={template}
          />
        </Grid>
      ) : (
        <Grid
          display={mobileTab === 1 ? "flex" : "none"}
          width={"100%"}
          justifyContent={"center"}
          height={"74%"}
          alignItems={"center"}
          overflow={"hidden"}
        >
          <ButtonGenerateExecution
            templateData={template}
            onError={setErrorMessage}
          />
        </Grid>
      )}

      <Grid
        flex={1}
        borderRadius={"16px"}
        display={mobileTab === 2 ? "block" : "none"}
      >
        <Grid mr={1}>
          <Display
            templateData={template}
            close={() => setMobileTab(1)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
