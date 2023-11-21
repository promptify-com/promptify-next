import { useState } from "react";
import ApiAccessModal from "@/components/modals/ApiAccessModal";
import { Templates } from "@/core/api/dto/templates";
import { Button, Stack, Typography, alpha } from "@mui/material";
import { ApiAccessIcon } from "@/assets/icons/ApiAccess";
import { theme } from "@/theme";
import { Api } from "@mui/icons-material";
import Link from "next/link";

interface ApiAccessProps {
  template: Templates;
}

export const ApiAccess: React.FC<ApiAccessProps> = ({ template }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Stack
      width={"300px"}
      gap={2}
      p={"0px 24px"}
    >
      <ApiAccessIcon />

      <Typography
        fontSize={22}
        fontWeight={500}
        color={"text.primary"}
        textAlign={"center"}
      >
        Access to this template through Promptify API
      </Typography>
      <Typography
        fontSize={14}
        fontWeight={400}
        color={alpha(theme.palette.text.secondary, 0.45)}
        textAlign={"center"}
      >
        Unlock the power of generated content on your site
      </Typography>

      <Button
        onClick={() => setIsModalOpen(true)}
        startIcon={<Api />}
        sx={{
          p: "8px 22px",
          borderRadius: "100px",
          gap: 1.5,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          ":hover": {
            bgcolor: "action.hover",
            color: "text.primary",
          },
        }}
      >
        Enable API
      </Button>
      {/* <Link
        href={"#"}
        style={{textDecoration: "none"}}
      > */}
      <Typography
        fontSize={13}
        fontWeight={400}
        color={"primary.main"}
      >
        Learn more about API
      </Typography>
      {/* </Link> */}

      {isModalOpen && (
        <ApiAccessModal
          onClose={() => setIsModalOpen(false)}
          templateData={template}
        />
      )}
    </Stack>
  );
};
