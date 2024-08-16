import { initialState } from "@/core/store/chatSlice";
import { useAppSelector } from "@/hooks/useStore";
import React from "react";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { IRelation } from "../GPTs/helpers";
import DataFlowCard from "./DataFlowCard";

const EXECUTION_DURATION = 15000; // TODO: to be replaced by API later

function DataFlowSteps({ steps }: { steps: [string, IRelation][] }) {
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
      <DataFlowCard
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

export default DataFlowSteps;
