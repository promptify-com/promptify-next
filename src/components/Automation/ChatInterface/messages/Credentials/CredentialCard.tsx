"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import IconButton from "@mui/material/IconButton";
import Refresh from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setAreCredentialsStored, setSelectedApp } from "@/core/store/chatSlice";
import { attachCredentialsToNode } from "@/components/Automation/helpers";
import {
  useCreateCredentialsMutation,
  useDeleteCredentialMutation,
  useUpdateWorkflowMutation,
  workflowsApi,
} from "@/core/api/workflows";
import { setToast } from "@/core/store/toastSlice";
import type { ICredentialInput, ICredentialProperty, IWorkflowCreateResponse } from "@/components/Automation/types";
import useCredentials from "@/components/Automation/app/hooks/useCrendentials";

interface Props {
  input: ICredentialInput;
}

interface FormValues {
  [key: string]: string;
}

function CredentialCard({ input }: Props) {
  const dispatch = useAppDispatch();
  const { credentialsInput, selectedApp } = useAppSelector(state => state.chat);
  const [updateWorkflow] = useUpdateWorkflowMutation();
  const [createCredentials] = useCreateCredentialsMutation();
  const [deleteCredential] = useDeleteCredentialMutation();

  const {
    updateCredentials,
    checkAllCredentialsStored,
    checkCredentialInserted,
    removeCredential,
    updateWorkflowAfterCredentialsDeletion,
    credentials,
  } = useCredentials();

  const credential = credentialsInput?.find(cred => cred.displayName === input.displayName);

  const [getAuthUrl] = workflowsApi.endpoints.getAuthUrl.useLazyQuery();

  const credentialProperties = credential?.properties || [];
  const isOauthCredential = credential?.name.includes("OAuth2");

  const isCredentialInserted = checkCredentialInserted(input);

  const [openModal, setOpenModal] = useState(false);
  const [, setOAuthConnected] = useState(isOauthCredential && isCredentialInserted ? true : false);

  const [isConnecting, setIsConnecting] = useState(false);

  const checkPopupIntervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (checkPopupIntervalRef.current) {
        clearInterval(checkPopupIntervalRef.current);
        checkPopupIntervalRef.current = undefined;
      }
    }, 120000);
    return () => {
      if (checkPopupIntervalRef.current) {
        clearInterval(checkPopupIntervalRef.current);
        checkPopupIntervalRef.current = undefined;
      }
      clearTimeout(timeoutId);
    };
  }, []);

  function getRequiredFields(credentialProperties: ICredentialProperty[]) {
    let requiredFields = credentialProperties.filter(prop => prop.required).map(prop => prop.name);

    if (requiredFields.length === 0) {
      requiredFields = credentialProperties.map(prop => prop.name);
    }
    return requiredFields;
  }

  const requiredFields = useMemo(() => getRequiredFields(credentialProperties), [credentialProperties]);

  const initialValues: FormValues = credentialProperties.reduce<FormValues>((acc, prop) => {
    acc[prop.name] = "";
    return acc;
  }, {});

  const validationSchema = object().shape(
    credentialProperties.reduce<Record<string, any>>((acc, prop) => {
      if (requiredFields.includes(prop.name)) {
        acc[prop.name] = string().required(`${prop.displayName} is required`);
      } else {
        acc[prop.name] = string();
      }
      return acc;
    }, {}),
  );

  const _updateWorkflow = async () => {
    if (!selectedApp || !credentialsInput?.length) {
      return;
    }

    const areAllCredentialsStored = checkAllCredentialsStored(credentialsInput);

    if (areAllCredentialsStored) {
      const _updatedApp = structuredClone(selectedApp);
      _updatedApp.nodes.forEach(node => attachCredentialsToNode(node));

      try {
        updateWorkflow({
          workflowId: _updatedApp.id,
          data: _updatedApp as unknown as IWorkflowCreateResponse,
        });
        dispatch(setSelectedApp(_updatedApp));
      } catch (error) {
        console.error("Error updating workflow:", error);
      }
    }
    dispatch(setAreCredentialsStored(areAllCredentialsStored));
  };

  const handleSubmit = async (values: FormValues = {}) => {
    const credential = credentialsInput?.find(cred => cred.displayName === input.displayName);

    if (!credential) {
      console.error("Credential was not found, please try again.");

      return;
    }

    const data: Record<string, string> = {};

    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        data[key] = values[key];
      }
    }
    if (!credentialsInput?.length) {
      return;
    }
    const areAllCredentialsStored = checkAllCredentialsStored(credentialsInput);

    if (!areAllCredentialsStored) {
      setAreCredentialsStored(false);
    } else {
      setAreCredentialsStored(true);
    }

    const payload = {
      name: `${credential.displayName} Credentials`,
      type: credential.name,
      data: data,
    };

    try {
      const response = await createCredentials(payload);

      if ("data" in response) {
        updateCredentials(response.data);
        if (isOauthCredential && response) {
          return response.data.id;
        }
      }

      _updateWorkflow();

      setOpenModal(false);

      dispatch(
        setToast({
          message: "Credential was successfully created",
          severity: "success",
        }),
      );
    } catch (error) {
      console.error("Error:", error);

      dispatch(
        setToast({
          message: "Credential was not created, please try again.",
          severity: "error",
        }),
      );
    }
  };

  const handleOauthConnect = async () => {
    setIsConnecting(true);

    const credentialId = await handleSubmit();

    if (!credentialId) {
      setIsConnecting(false);
      return;
    }

    try {
      const { authUri } = await getAuthUrl({
        id: credentialId,
        redirectUri: `${window.location.origin}/oauth2/callback`,
      }).unwrap();

      if (!authUri) {
        setIsConnecting(false);
        return;
      }
      const params =
        "scrollbars=no,resizable=yes,status=no,titlebar=no,location=no,toolbar=no,menubar=no,width=500,height=700,popup=true";
      const oauthPopup = window.open(authUri, "OAuth2 Authorization", params);

      const clearPopupCheck = () => {
        if (checkPopupIntervalRef.current) {
          clearInterval(checkPopupIntervalRef.current);
          checkPopupIntervalRef.current = undefined;
        }
        window.removeEventListener("message", receiveMessage, false);
      };

      const receiveMessage = async (event: MessageEvent) => {
        if (!event.data.action || event.data.action !== "oauth2callback") {
          return;
        }

        if (event.origin !== window.location.origin) {
          clearPopupCheck();
          return;
        }

        if (event.data.status === "success") {
          clearPopupCheck();
          _updateWorkflow();
          setOpenModal(false);
          dispatch(
            setToast({
              message: "Credential Added successfully.",
              severity: "success",
            }),
          );
          setOAuthConnected(true);
          setIsConnecting(false);

          const remainingCredentials = credentialsInput?.filter(cred => cred.displayName !== input.displayName);

          if (!remainingCredentials?.length) {
            setAreCredentialsStored(true);
          }
        } else {
          dispatch(
            setToast({
              message: event.data.message,
              severity: event.data.status,
            }),
          );
          await deleteCredential(credentialId);
          removeCredential(credentialId);
          clearPopupCheck();
          setOAuthConnected(false);
          setIsConnecting(false);
        }
        if (oauthPopup) {
          oauthPopup.close();
        }
      };

      window.addEventListener("message", receiveMessage, false);

      let elapsedSeconds = 0;
      checkPopupIntervalRef.current = setInterval(async () => {
        if (oauthPopup?.closed) {
          clearPopupCheck();
          dispatch(
            setToast({
              message:
                "OAuth authorization was cancelled. There may have been an issue with the authorization process.",
              severity: "error",
            }),
          );

          await deleteCredential(credentialId);
          removeCredential(credentialId);
          setIsConnecting(false);
        } else {
          elapsedSeconds++;
          if (elapsedSeconds >= 120) {
            clearPopupCheck();
          }
        }
      }, 1000) as unknown as number;
    } catch (error) {
      console.error("Error during OAuth authorization:", error);
      await deleteCredential(credentialId);
      removeCredential(credentialId);
      setIsConnecting(false);
    }
  };

  const _credential = credentials.find(cred => cred.type === credential?.name);
  return (
    <Stack>
      <>
        {isCredentialInserted && _credential && !isConnecting ? (
          <Stack
            direction={"row"}
            gap={1}
            alignItems={"center"}
          >
            <CheckIcon sx={{ fontSize: 14, color: "#499A2C" }} />
            <IconButton
              size="small"
              sx={{
                border: "none",
                bgcolor: "primary.main",
                ":hover": {
                  bgcolor: "primary.main",
                  opacity: 0.8,
                },
              }}
              onClick={async e => {
                e.preventDefault();
                deleteCredential(_credential?.id);
                await updateWorkflowAfterCredentialsDeletion(_credential.type, false);
                dispatch(
                  setToast({
                    message: "Credential was successfully deleted.",
                    severity: "info",
                  }),
                );

                removeCredential(_credential.id);
                setOAuthConnected(false);
                handleOauthConnect();
              }}
            >
              <Refresh sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
        ) : isOauthCredential ? (
          <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              onClick={handleOauthConnect}
              variant="contained"
              sx={BtnStyle}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
          </Stack>
        ) : (
          <Button
            size="small"
            onClick={() => setOpenModal(true)}
            disabled={isCredentialInserted}
            variant="text"
            sx={{
              border: "1px solid",
              borderRadius: "8px",
              borderColor: "secondary.main",
              color: "secondary.main",
              p: "3px 12px",
              fontSize: { xs: 11, md: 14 },
              ":hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            {isCredentialInserted ? "Credentials added" : "Insert Credentials"}
          </Button>
        )}
      </>

      {openModal && (
        <Dialog
          open
          maxWidth={"md"}
          fullWidth
          disableScrollLock
        >
          <DialogTitle>{input.displayName} Credentials</DialogTitle>
          <DialogContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <DialogContent
                    sx={{
                      p: "16px 8px",
                    }}
                  >
                    {credentialProperties.map((prop, index) => (
                      <FormControl
                        fullWidth
                        margin="dense"
                        key={index}
                      >
                        <Field
                          as={TextField}
                          autoFocus={index === 0}
                          required={requiredFields.includes(prop.name)}
                          label={prop.displayName}
                          name={prop.name}
                          type={prop.typeOptions?.password ? "password" : prop.type}
                          variant="outlined"
                          fullWidth
                          helperText={touched[prop.name] && errors[prop.name]}
                          error={touched[prop.name] && Boolean(errors[prop.name])}
                        />
                      </FormControl>
                    ))}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                    <Button
                      type="submit"
                      sx={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "4px",
                        bgcolor: "secondary.main",
                        color: "white",
                        ":hover": {
                          bgcolor: "action.hover",
                          color: "inherit",
                        },
                      }}
                    >
                      Save
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      )}
    </Stack>
  );
}

export const BtnStyle = {
  bgcolor: "primary.main",
  color: "common.white",
  fontSize: 13,
  fontWeight: 500,
  p: "6px 24px",
  borderRadius: "99px",
  ":disabled": {
    borderColor: "transparent",
  },
};

export default CredentialCard;
