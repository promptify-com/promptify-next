import { useEffect, useState } from "react";
import Api from "@mui/icons-material/Api";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";

import { theme } from "@/theme";
import { ApiAccessIcon } from "@/assets/icons/ApiAccess";
import { templatesApi, useSetTemplateEnableApiMutation } from "@/core/api/templates";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setTemplateApiStatus } from "@/core/store/templatesSlice";
import type { Templates } from "@/core/api/dto/templates";

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
    if (tempateApiStatus.data) return;
    await getTempalteEnable(template.id)
      .unwrap()
      .then(data => dispatch(setTemplateApiStatus({ data, isLoading: false })))
      .catch(_err => dispatch(setTemplateApiStatus({ data: null, isLoading: false })));
  };
  useEffect(() => {
    getTempalteApiStatus();
  }, []);

  const handleEnableApi = () => {
    setIsModalOpen(true);
    if (!isTemplateApiEnabled) {
      enableApi(template.id);
      dispatch(setTemplateApiStatus({ data: { is_api_enabled: true }, isLoading: false }));
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
          ":disabled": {
            bgcolor: "surface.5",
            color: "onSurface",
            opacity: 0.4,
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
    </Stack>
  );
};

export default ApiAccess;
