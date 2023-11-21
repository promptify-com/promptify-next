import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { DetailsCardMini } from "./DetailsCardMini";
import { DetailsCard } from "./DetailsCard";
import { Details } from "./Details";
import ChatMode from "./generate/ChatBox";
import { Display } from "./Display";
import BottomTabs from "./BottomTabs";
import type { Templates, TemplatesExecutions } from "@/core/api/dto/templates";
import { ButtonGenerateExecution } from "./ButtonGenerateExecution";
import { useAppSelector } from "@/hooks/useStore";

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
      gap={"8px"}
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
      {mobileTab === 0 ? (
        <Grid
          item
          xs={12}
          md={8}
          height={"100%"}
          overflow={"auto"}
          bgcolor={"surface.1"}
          position={"relative"}
          pb={"75px"} // Bottom tab bar height
        >
          <DetailsCard templateData={template} />
          <Details
            templateData={template}
            setMobileTab={setMobileTab}
            mobile
          />
        </Grid>
      ) : (
        <DetailsCardMini templateData={template} />
      )}

      {displayChatBox ? (
        <Grid>
          <ChatMode
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
          {/* TODO: double check if we still need this for mobile.
           onError={setErrorMessage} close={() => setMobileTab(1)} */}
          <Display templateData={template} />
        </Grid>
      </Grid>

      <BottomTabs
        setActiveTab={setMobileTab}
        activeTab={mobileTab}
      />
    </Grid>
  );
}
