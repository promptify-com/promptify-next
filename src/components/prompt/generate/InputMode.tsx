import React from "react";
import { Box, Button, CircularProgress, Stack, Typography, alpha, useTheme } from "@mui/material";
import { AllInclusive, Close, InfoOutlined } from "@mui/icons-material";

import { GeneratePromptForm } from "@/core/api/dto/prompts";
import useToken from "@/hooks/useToken";
import { GeneratorInput } from "./GeneratorInput";
import { GeneratorParam } from "./GeneratorParam";
import { Templates } from "@/core/api/dto/templates";
import { LogoApp } from "@/assets/icons/LogoApp";
import TabsAndFormPlaceholder from "@/components/placeholders/TabsAndFormPlaceholder";
import { InputsErrors } from ".";

interface InputModeProps extends GeneratePromptForm {
  errors: InputsErrors;
  templateData: Templates;
}

export const InputMode: React.FC<InputModeProps> = ({
  templateData,
  inputs,
  params,
  nodeInputs,
  setNodeInputs,
  errors,
  generate,
  isGenerating,
  isFormFilled,
  onReset,
  allowReset,
  nodeParams,
  setNodeParams,
}) => {
  const { palette } = useTheme();
  const token = useToken();

  return (
    <Stack
      sx={{
        minHeight: { xs: "100%", md: "40svh" },
        bgcolor: "surface.1",
        borderRadius: "16px",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ p: "16px 8px 16px 24px" }}
      >
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 500,
            color: "onSurface",
            opacity: 0.8,
          }}
        >
          Inputs
        </Typography>
        <Button
          variant="text"
          startIcon={<Close />}
          sx={{
            display: allowReset ? "inline-flex" : "none",
            border: `1px solid ${alpha(palette.primary.main, 0.15)}`,
            bgcolor: "surface.1",
            color: "onSurface",
            fontSize: 13,
            fontWeight: 500,
            p: "4px 12px",
            svg: {
              fontSize: "18px !important",
            },
          }}
          onClick={onReset}
        >
          Reset
        </Button>
      </Stack>

      <Stack
        gap={1}
        sx={{
          flex: 1,
          p: "16px",
          pb: { xs: 0, md: "16px" },
        }}
      >
        <Box
          sx={{
            flex: 1,
            bgcolor: "surface.2",
            borderRadius: "16px",
            position: "relative",
          }}
        >
          {!inputs || !params ? (
            <TabsAndFormPlaceholder form={true} />
          ) : inputs.length === 0 && params.length === 0 ? (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                textAlign: "center",
                color: "onSurface",
                fontSize: 14,
              }}
            >
              No parameters available for this template
            </Box>
          ) : (
            <React.Fragment>
              {inputs.map((input, i) => (
                <GeneratorInput
                  key={i}
                  promptId={input.prompt}
                  inputs={[input]}
                  nodeInputs={nodeInputs}
                  setNodeInputs={setNodeInputs}
                  errors={errors}
                />
              ))}
              {params.map((param, i) => (
                <GeneratorParam
                  key={i}
                  params={[param.param]}
                  promptId={param.prompt}
                  nodeParams={nodeParams}
                  setNodeParams={setNodeParams}
                />
              ))}
            </React.Fragment>
          )}
        </Box>

        <Stack
          sx={{
            position: "sticky",
            bottom: 0,
            m: { xs: "0 -16px -3px", md: "0" },
            bgcolor: { xs: "surface.1", md: "initial" },
            color: { xs: "onSurface", md: "initial" },
            boxShadow: {
              xs: "0px -8px 40px 0px rgba(93, 123, 186, 0.09), 0px -8px 10px 0px rgba(98, 98, 107, 0.03)",
              md: "none",
            },
            borderRadius: "24px 24px 0 0",
            zIndex: 999,
            borderBottom: { xs: `1px solid ${palette.surface[5]}`, md: "none" },
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            p={"16px 8px 16px 16px"}
          >
            <Button
              variant={"contained"}
              startIcon={
                token ? (
                  <LogoApp
                    width={18}
                    color="white"
                  />
                ) : null
              }
              sx={{
                p: "10px 25px",
                fontWeight: 500,
                borderColor: "primary.main",
                borderRadius: "999px",
                bgcolor: "primary.main",
                color: "onPrimary",
                whiteSpace: "pre-line",
                ":hover": {
                  bgcolor: "surface.1",
                  color: "primary.main",
                },
                ":disabled": {
                  bgcolor: "surface.4",
                  color: "onTertiary",
                  borderColor: "transparent",
                },
              }}
              disabled={!token ? false : isGenerating ? true : !isFormFilled}
              onClick={generate}
            >
              {token ? (
                <React.Fragment>
                  <Typography sx={{ ml: 2, color: "inherit", fontSize: 15 }}>Generate</Typography>
                  <Typography sx={{ display: { md: "none" }, ml: "auto", color: "inherit", fontSize: 12 }}>
                    ~360s
                  </Typography>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    gap={0.5}
                    sx={{ display: { xs: "none", md: "flex" }, ml: "auto", color: "inherit", fontSize: 12 }}
                  >
                    {templateData.executions_limit === -1 ? (
                      <AllInclusive
                        fontSize="small"
                        sx={{
                          ml: 4,
                        }}
                      />
                    ) : (
                      <>
                        {templateData.executions_limit - templateData.executions_count} of{" "}
                        {templateData.executions_limit} left
                        <InfoOutlined sx={{ fontSize: 16 }} />
                      </>
                    )}
                  </Stack>
                </React.Fragment>
              ) : (
                <Typography
                  ml={2}
                  color={"inherit"}
                >
                  Sign in or Create an account
                </Typography>
              )}
            </Button>
            <Box
              sx={{
                position: "relative",
                display: { xs: "inline-flex", md: "none" },
              }}
            >
              <CircularProgress
                variant="determinate"
                value={100}
                sx={{ position: "absolute", color: "grey.400" }}
              />
              <CircularProgress
                variant="determinate"
                value={templateData.executions_limit === -1 ? 100 : templateData.executions_count}
              />
              <Box
                sx={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  position: "absolute",
                  width: 26,
                  height: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.main",
                  color: "onPrimary",
                  borderRadius: 99,
                  fontSize: 12,
                }}
              >
                {templateData.executions_limit === -1 ? (
                  <AllInclusive fontSize="small" />
                ) : (
                  templateData.executions_count
                )}
              </Box>
            </Box>
          </Stack>
        </Stack>

        {Object.keys(errors).length > 0 && (
          <Typography
            color={"error.main"}
            sx={{
              textAlign: "center",
            }}
          >
            Fill all the inputs
          </Typography>
        )}

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: "15px",
            color: "grey.600",
            fontSize: 14,
            fontWeight: 400,
            my: "20px",
          }}
        >
          Repeat last:
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Box
              style={keysStyle}
              sx={{ fontSize: 12, fontWeight: 600 }}
            >
              SHIFT
            </Box>
            +
            <Box
              style={keysStyle}
              sx={{ fontSize: 12, fontWeight: 600 }}
            >
              R
            </Box>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

const keysStyle = {
  padding: "2px 4px",
  letterSpacing: "1px",
  border: "1px solid #E1E2EC",
  borderRadius: "4px",
  boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.12)",
};
