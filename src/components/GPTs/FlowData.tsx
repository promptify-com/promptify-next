import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import type { ITemplateWorkflow } from "@/components/Automation/types";
import { type IRelation, getWorkflowDataFlow } from "./helpers";
import Image from "@/components/design-system/Image";
import Stack from "@mui/material/Stack";
import { useAppSelector } from "@/hooks/useStore";
import LoadingDots from "@/components/design-system/LoadingDots";
import { IChatSliceState } from "@/core/store/types";
import { initialState } from "@/core/store/chatSlice";
import { isAdminFn } from "@/core/store/userSlice";
import { useRouter } from "next/router";
import { useGetTemplateByIdQuery } from "@/core/api/templates";

function Workflow({ workflow }: { workflow: ITemplateWorkflow }) {
  const steps = getWorkflowDataFlow(workflow);

  return (
    <Stack
      gap={5}
      sx={{
        p: "40px",
        borderLeft: "1px solid #ECECF3",
        backgroundColor: "#fcfbff",
        backgroundImage: "radial-gradient(circle, #e9e6f3 1px, transparent 1px)",
        backgroundSize: "10px 10px",
      }}
    >
      <Typography
        fontSize={14}
        fontWeight={500}
        color={"common.black"}
        fontStyle={"normal"}
        lineHeight={"100%"}
      >
        Data flow
      </Typography>
      <Stack>
        <Steps steps={steps} />
      </Stack>
    </Stack>
  );
}

const EXECUTION_DURATION = 15000; // TODO: to be replaced by API later
function Steps({ steps }: { steps: [string, IRelation][] }) {
  const [activeNode, setActiveNode] = useState(0);
  const gptGenerationStatus = useAppSelector(
    state => state.chat?.gptGenerationStatus ?? initialState.gptGenerationStatus,
  );
  const durationPerNode = Math.floor(EXECUTION_DURATION / steps.length);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gptGenerationStatus === "started") {
      timer = setInterval(() => {
        setActiveNode(prevActiveNode => {
          if (prevActiveNode === steps.length - 1) {
            clearInterval(timer);
            return prevActiveNode;
          }

          return prevActiveNode + 1;
        });
      }, durationPerNode);
    } else {
      setActiveNode(0);
    }

    return () => {
      clearInterval(timer);
    };
  }, [gptGenerationStatus]);

  if (!steps.length) {
    return null;
  }

  return steps.map((step, index) => (
    <React.Fragment key={index}>
      <FlowDataCard
        title={step[0]}
        description={step[1].description}
        iconUrl={step[1].iconUrl}
        activeNode={activeNode === index}
        gptGenerationStatus={gptGenerationStatus}
        templateId={step[1].templateId}
      />
      {index < steps.length - 1 && (
        <Stack
          alignItems={"center"}
          my={"8px"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="6"
            height="36"
            viewBox="0 0 6 36"
            fill="none"
          >
            <path
              d="M0.333333 3C0.333333 4.47276 1.52724 5.66667 3 5.66667C4.47276 5.66667 5.66667 4.47276 5.66667 3C5.66667 1.52724 4.47276 0.333333 3 0.333333C1.52724 0.333333 0.333333 1.52724 0.333333 3ZM0.333333 33C0.333333 34.4728 1.52724 35.6667 3 35.6667C4.47276 35.6667 5.66667 34.4728 5.66667 33C5.66667 31.5272 4.47276 30.3333 3 30.3333C1.52724 30.3333 0.333333 31.5272 0.333333 33ZM2.5 4.875C2.5 5.15114 2.72386 5.375 3 5.375C3.27614 5.375 3.5 5.15114 3.5 4.875H2.5ZM3.5 8.625C3.5 8.34886 3.27614 8.125 3 8.125C2.72386 8.125 2.5 8.34886 2.5 8.625H3.5ZM2.5 12.375C2.5 12.6511 2.72386 12.875 3 12.875C3.27614 12.875 3.5 12.6511 3.5 12.375H2.5ZM3.5 16.125C3.5 15.8489 3.27614 15.625 3 15.625C2.72386 15.625 2.5 15.8489 2.5 16.125H3.5ZM2.5 19.875C2.5 20.1511 2.72386 20.375 3 20.375C3.27614 20.375 3.5 20.1511 3.5 19.875H2.5ZM3.5 23.625C3.5 23.3489 3.27614 23.125 3 23.125C2.72386 23.125 2.5 23.3489 2.5 23.625H3.5ZM2.5 27.375C2.5 27.6511 2.72386 27.875 3 27.875C3.27614 27.875 3.5 27.6511 3.5 27.375H2.5ZM3.5 31.125C3.5 30.8489 3.27614 30.625 3 30.625C2.72386 30.625 2.5 30.8489 2.5 31.125H3.5ZM2.5 3V4.875H3.5V3H2.5ZM2.5 8.625V12.375H3.5V8.625H2.5ZM2.5 16.125V19.875H3.5V16.125H2.5ZM2.5 23.625V27.375H3.5V23.625H2.5ZM2.5 31.125V33H3.5V31.125H2.5Z"
              fill="#575462"
            />
          </svg>
        </Stack>
      )}
    </React.Fragment>
  ));
}

interface IFlowDataCard {
  title: string;
  description: string;
  borderColor?: string;
  iconUrl: string;
  activeNode: boolean;
  gptGenerationStatus: IChatSliceState["gptGenerationStatus"];
  templateId?: number;
}

function FlowDataCard({
  title,
  description,
  borderColor = "#6E45E9",
  iconUrl,
  activeNode,
  gptGenerationStatus,
  templateId,
}: IFlowDataCard) {
  const router = useRouter();
  const isAdmin = useAppSelector(isAdminFn);
  const { data: templates } = useGetTemplateByIdQuery(templateId! as unknown as number, {
    skip: !templateId,
  });

  const handleCardClick = () => {
    if (isAdmin && title.includes("Promptify") && templates) {
      router.push(`/prompt-builder/${templates.slug}`);
    }
  };
  return (
    <Card
      onClick={handleCardClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "10px 24px 10px 10px;",
        borderRadius: "100px",
        border: `1px solid ${borderColor}`,
        backgroundColor: "rgba(243, 239, 255, 0.50)",
        backdropFilter: "blur(1px)",
        width: "288px",
        position: "relative",
        overflow: "visible",
        boxShadow: "none",
        cursor: isAdmin && title.includes("Promptify") ? "pointer" : "default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          width: "28px",
          height: "28px",
          flexShrink: 0,
          overflow: "hidden",
          // backgroundColor: "#6E45E9",
        }}
      >
        {iconUrl ? (
          <Image
            src={iconUrl}
            width={14}
            height={14}
            alt={title}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
          >
            <rect
              width="28"
              height="28"
              rx="14"
              fill="#6E45E9"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.787 9.29333C20.759 9.0553 20.4851 8.92332 20.2709 9.04764C19.5161 9.48587 18.9395 9.91019 18.4325 10.4013C18.1761 10.3398 17.8841 10.305 17.5743 10.305C17.2645 10.305 16.9725 10.3398 16.7161 10.4013C16.2091 9.9102 15.6326 9.48589 14.8777 9.04766C14.6636 8.92334 14.3896 9.05532 14.3616 9.29335C14.3113 9.72053 14.2718 10.1044 14.2413 10.473H11.3662C8.59414 10.473 8 11.0411 8 13.6915V14.477C8 14.6033 8.00135 14.7249 8.00422 14.8418L8 14.8401C8.08308 16.6671 8.32333 19.1704 9.16673 20.9285C9.17944 20.955 9.19545 20.9789 9.21409 21C9.36005 20.9103 9.50904 20.8199 9.65875 20.7291C11.1102 19.8485 12.6294 18.9268 12.1069 18.2231C11.9911 18.0671 12.0703 17.6955 12.2703 17.6955H15.2913H15.7427C15.7465 17.6955 15.7502 17.6955 15.754 17.6955H15.9054C18.6481 17.6955 20.9507 15.9328 20.9992 13.3284L20.9995 13.3082C20.9999 13.287 21 13.2658 21 13.2444V12.8517C21 12.7688 20.9994 12.6888 20.9982 12.6116C20.9881 11.4115 20.9333 10.5356 20.787 9.29333Z"
              fill="white"
            />
          </svg>
        )}
      </Box>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "6px",
          flex: "1 0 0",
          padding: 0,
          boxShadow: "none",
        }}
      >
        <Typography
          sx={{
            alignSelf: "stretch",
            color: "#6E45E9",
            fontSize: "10px",
            fontWeight: "600",
            lineHeight: "100%",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            userSelect: "none",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: "#000",
            fontSize: "12px",
            fontWeight: "500",
            lineHeight: "100%",
            letterSpacing: "0.06px",
            userSelect: "none",
          }}
        >
          {description} {activeNode && gptGenerationStatus === "started" && <LoadingDots />}
        </Typography>
      </CardContent>
      <ArrowForwardIosIcon
        sx={{
          width: "16px",
          height: "16px",
          flexShrink: 0,
        }}
      />
      <Stack
        sx={{
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          right: "-11px",
          top: "-3px",
          width: "28px",
          height: "28px",
          gap: "8px",
          borderRadius: "100px",
          border: "2px solid #FCFBFF",
          background: "#2C2B30",
        }}
      >
        <CheckIcon
          sx={{
            width: "12px",
            height: "12px",
            color: "onPrimary",
          }}
        />
      </Stack>
    </Card>
  );
}

export default Workflow;
