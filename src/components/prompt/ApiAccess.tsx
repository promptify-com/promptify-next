import { ApiIcon } from "@/assets/icons";
import { ResPrompt } from "@/core/api/dto/prompts";
import { Templates } from "@/core/api/dto/templates";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { Bolt } from "@mui/icons-material";
import dynamic from "next/dynamic";

const ApiAccessModal = dynamic(() => import("../modals/ApiAccessModal"));

interface Props {
  isConnected?: boolean;
  lastAccess?: string;
  totalRuns?: number;
  executionData: ResPrompt[];
  templateData: Templates;
  token: string;
}

const ApiAccess: React.FC<Props> = ({
  isConnected = true,
  lastAccess = "2 hours ago",
  totalRuns = 246,
  executionData,
  templateData,
  token,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      p={"16px 8px 16px 16px"}
      gap="10px"
    >
      <Typography
        color="primary"
        fontSize={12}
      >
        API ACCESS
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
      >
        <Typography>Key Status:</Typography>
        {isConnected ? (
          <Box display="flex">
            <Bolt
              fontSize="small"
              sx={{
                color: "blue",
              }}
            />
            <Typography>Connected</Typography>
          </Box>
        ) : (
          <Box display="flex">
            <Bolt
              fontSize="small"
              sx={{
                color: "red",
              }}
            />
            <Typography>Disconnected</Typography>
          </Box>
        )}
      </Box>
      <Button
        variant={"contained"}
        startIcon={<ApiIcon />}
        sx={{
          flex: 1,
          p: "8px 22px",
          fontSize: 15,
          fontWeight: 500,
          border: "none",
          borderRadius: "999px",
          bgcolor: "surface.3",
          color: "onSurface",
          svg: {
            width: 24,
            height: 24,
          },
          ":hover": {
            bgcolor: "surface.4",
          },
        }}
        disabled={!isConnected}
        onClick={() => setIsModalOpen(true)}
      >
        <Typography
          display="flex"
          color={"inherit"}
        >
          Integrate this API
        </Typography>
      </Button>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{ opacity: 0.5 }}
      >
        <Typography fontSize={12}>Last access:</Typography>
        <Typography fontSize={12}>{lastAccess}</Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{ opacity: 0.5 }}
      >
        <Typography fontSize={12}>Total Runs:</Typography>
        <Typography fontSize={12}>{totalRuns}</Typography>
      </Box>
      <ApiAccessModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        executionData={executionData}
        templateData={templateData}
        token={token}
      />
    </Box>
  );
};

export default ApiAccess;
