import { ApiIcon } from "@/assets/icons";
import { Templates } from "@/core/api/dto/templates";
import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { Bolt } from "@mui/icons-material";
import dynamic from "next/dynamic";
import { timeAgo } from "@/common/helpers/timeManipulation";

const ApiAccessModal = dynamic(() => import("../modals/ApiAccessModal"));

interface Props {
  templateData: Templates;
}

const isConnected = true;

const ApiAccess: React.FC<Props> = ({ templateData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="10px"
    >
      <Typography
        color="tertiary"
        fontSize={13}
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
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <Typography
          display="flex"
          color={"inherit"}
        >
          Integrate this API
        </Typography>
      </Button>

      <Box sx={{ pb: "25px" }}>
        <Stack gap={1}>
          <Typography sx={detailsStyle}>
            Last access: <span>{templateData.last_api_run ? timeAgo(templateData.last_api_run) : "--"}</span>
          </Typography>
          <Typography sx={detailsStyle}>
            Total Runs: <span>{templateData.api_runs || "--"}</span>
          </Typography>
        </Stack>
      </Box>

      {isModalOpen && (
        <ApiAccessModal
          onClose={() => setIsModalOpen(false)}
          templateData={templateData}
        />
      )}
    </Box>
  );
};

export default ApiAccess;

const detailsStyle = {
  fontSize: 14,
  fontWeight: 400,
  color: "grey.600",
  span: {
    color: "common.black",
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
