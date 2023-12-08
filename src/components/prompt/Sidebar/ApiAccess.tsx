import { useEffect, useState } from "react";
import ApiAccessModal from "@/components/modals/ApiAccessModal";
import { Templates } from "@/core/api/dto/templates";
import { Button, Stack, Typography, alpha } from "@mui/material";
import { ApiAccessIcon } from "@/assets/icons/ApiAccess";
import { theme } from "@/theme";
import { Api } from "@mui/icons-material";
import { templatesApi, useSetTemplateEnableApiMutation } from "@/core/api/templates";
import { useAppSelector } from "@/hooks/useStore";
import { useDispatch } from "react-redux";
import { setTemplateApiStatus } from "@/core/store/templatesSlice";

interface ApiAccessProps {
  template: Templates;
}

export const ApiAccess: React.FC<ApiAccessProps> = ({ template }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiStatus = useAppSelector(state => state.template.templateApiStatus);

  const dispatch = useDispatch();
  const [enableApi, { isLoading }] = useSetTemplateEnableApiMutation();
  const [getApiStatus] = templatesApi.endpoints.getTemplateApiStatus.useLazyQuery();

  useEffect(() => {
    if (apiStatus.data) return;
    getApiStatus(template.id)
      .unwrap()
      .then(data => dispatch(setTemplateApiStatus({ data, isLoading: false })))
      .catch(_err => dispatch(setTemplateApiStatus({ data: null, isLoading: false })));
  }, []);

  const handleEnableApi = () => {
    setIsModalOpen(true);
    if (!isApiEnabled) {
      enableApi(template.id)
        .unwrap()
        .then(_ => dispatch(setTemplateApiStatus({ data: { is_api_enabled: true }, isLoading: false })))
        .catch(_err => dispatch(setTemplateApiStatus({ data: null, isLoading: false })));
    }
  };

  const isApiEnabled = template.is_api_enabled || apiStatus.data?.is_api_enabled;

  return (
    <Stack
      alignItems={"center"}
      gap={3}
      p={"24px"}
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
        onClick={handleEnableApi}
        disabled={apiStatus.isLoading || isLoading}
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
          ":disabled": {
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
            opacity: 0.7,
          },
        }}
      >
        {isApiEnabled ? "Use API" : "Enable API"}
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
