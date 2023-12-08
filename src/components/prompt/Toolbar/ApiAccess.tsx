import { useEffect, useState } from "react";
import ApiAccessModal from "@/components/modals/ApiAccessModal";
import { Templates } from "@/core/api/dto/templates";
import { Button, Stack, Typography, alpha } from "@mui/material";
import { ApiAccessIcon } from "@/assets/icons/ApiAccess";
import { theme } from "@/theme";
import { Api } from "@mui/icons-material";
import Link from "next/link";
import { templatesApi, useSetTemplateEnableApiMutation } from "@/core/api/templates";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setTemplateApiStatus } from "@/core/store/templatesSlice";

interface ApiAccessProps {
  template: Templates;
}

export const ApiAccess: React.FC<ApiAccessProps> = ({ template }) => {
  const [enableApi, { isLoading }] = useSetTemplateEnableApiMutation();
  const [getTempalteEnable] = templatesApi.endpoints.getTemplateApiStatus.useLazyQuery();

  const dispatch = useAppDispatch();
  const tempateApiStatus = useAppSelector(state => state.template.templateApiStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isTemplateApiEnabled = template.is_api_enabled || tempateApiStatus.data?.is_api_enabled;

  const getTempalteApiStatus = async () => {
    await getTempalteEnable(template.id)
      .unwrap()
      .then(data => dispatch(setTemplateApiStatus({ data, isLoading: false })))
      .catch(_err => dispatch(setTemplateApiStatus({ data: null, isLoading: false })));
  };
  useEffect(() => {
    getTempalteApiStatus();
  }, [isLoading]);

  const handleEnableApi = () => {
    setIsModalOpen(true);
    if (!isTemplateApiEnabled) {
      enableApi(template.id);
    }
  };

  return (
    <Stack
      gap={2}
      p={"0px 24px"}
      textAlign={"center"}
      alignItems={"center"}
    >
      <ApiAccessIcon />

      <Typography
        fontSize={22}
        fontWeight={500}
        color={"text.primary"}
      >
        Access to this template through Promptify API
      </Typography>
      <Typography
        fontSize={14}
        fontWeight={400}
        color={alpha(theme.palette.text.secondary, 0.8)}
      >
        Unlock the power of generated content on your site
      </Typography>

      <Button
        onClick={handleEnableApi}
        startIcon={<Api />}
        disabled={tempateApiStatus.isLoading || isLoading}
        sx={{
          p: "8px 22px",
          borderRadius: "100px",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          ":hover": {
            bgcolor: "action.hover",
            color: "text.primary",
          },
        }}
      >
        {isTemplateApiEnabled ? "Use API" : "Enable API"}
      </Button>
      <Link
        href={"#"}
        style={{ textDecoration: "none" }}
      >
        <Typography
          fontSize={13}
          fontWeight={400}
          color={"primary.main"}
        >
          Learn more about API
        </Typography>
      </Link>

      {isModalOpen && (
        <ApiAccessModal
          onClose={() => setIsModalOpen(false)}
          templateData={template}
        />
      )}
    </Stack>
  );
};
