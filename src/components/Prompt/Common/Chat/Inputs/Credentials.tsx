import { useEffect, useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import { object, string } from "yup";

import BaseButton from "@/components/base/BaseButton";
import { useAppDispatch } from "@/hooks/useStore";
import Storage from "@/common/storage";
import {
  useCreateCredentialsMutation,
  useDeleteCredentialMutation,
  useUpdateWorkflowMutation,
  workflowsApi,
} from "@/core/api/workflows";
import { setToast } from "@/core/store/toastSlice";
import { attachCredentialsToNode } from "@/components/Automation/helpers";
import { setAreCredentialsStored } from "@/core/store/chatSlice";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import type { ICredentialProperty, IWorkflowCreateResponse } from "@/components/Automation/types";
import type { IPromptInput } from "@/common/types/prompt";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

interface Props {
  input: IPromptInput;
}

interface FormValues {
  [key: string]: string;
}

function Credentials({ input }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const workflowId = router.query.workflowId as string;

  const [updateWorkflow] = useUpdateWorkflowMutation();
  const [createCredentials] = useCreateCredentialsMutation();
  const [deleteCredential] = useDeleteCredentialMutation();

  const { credentialsInput, updateCredentials, checkAllCredentialsStored, checkCredentialInserted, removeCredential } =
    useCredentials();

  const [openModal, setOpenModal] = useState(false);
  const credential = credentialsInput.find(cred => cred.displayName === input.fullName);
  const credentialProperties = credential?.properties || [];
  const isOauthCredential = credential?.name.includes("OAuth2");
  const urlToCopy = `${window.location.origin}/oauth2/callback`;
  const [copy, result] = useCopyToClipboard();
  const [getAuthUrl] = workflowsApi.endpoints.getAuthUrl.useLazyQuery();

  useEffect(() => {
    if (result) {
      if (result?.state === "success") {
        dispatch(
          setToast({
            message: "Redirect URL copied to clipboard!",
            severity: "success",
            position: { vertical: "bottom", horizontal: "right" },
          }),
        );
      } else {
        dispatch(
          setToast({
            message: "Failed to copy URL",
            severity: "error",
            position: { vertical: "bottom", horizontal: "right" },
          }),
        );
      }
    }
  }, [result]);

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

  const updateWorkflowAndStorage = async () => {
    const storedWorkflows = Storage.get("workflows") || {};

    const workflow = storedWorkflows[workflowId].workflow as IWorkflowCreateResponse;

    if (workflow && workflow.nodes) {
      workflow.nodes.forEach(node => attachCredentialsToNode(node));

      const areAllCredentialsStored = checkAllCredentialsStored(credentialsInput);
      dispatch(setAreCredentialsStored(areAllCredentialsStored));

      Storage.set("workflows", JSON.stringify(storedWorkflows));

      if (areAllCredentialsStored) {
        try {
          await updateWorkflow({
            workflowId: parseInt(workflowId),
            data: workflow,
          });
        } catch (error) {
          console.error("Error updating workflow:", error);
        }
      }
    }
  };

  const handleSubmit = async (values: FormValues) => {
    const credential = credentialsInput.find(cred => cred.displayName === input.fullName);
    const data: Record<string, string> = {};

    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        data[key] = values[key];
      }
    }
    const payload = {
      name: `${credential?.displayName} Credentials`,
      type: credential?.name!,
      data: data,
    };
    try {
      const response = await createCredentials(payload).unwrap();
      updateCredentials(response);

      if (isOauthCredential && response) {
        return response.id;
      }

      updateWorkflowAndStorage();

      setOpenModal(false);
      dispatch(setToast({ message: "Credential was successfully created", severity: "success" }));
    } catch (error) {
      console.error("Error:", error);
      dispatch(setToast({ message: "Credential was not created, please try again.", severity: "error" }));
    }
  };

  const handleOauthConnect = async (values: FormValues) => {
    const credentialId = await handleSubmit(values);
    if (!credentialId) {
      return;
    }

    try {
      const { authUri } = await getAuthUrl({
        id: credentialId,
        redirectUri: `${window.location.origin}/oauth2/callback`,
      }).unwrap();

      if (!authUri) {
        return;
      }

      const params =
        "scrollbars=no,resizable=yes,status=no,titlebar=no,location=no,toolbar=no,menubar=no,width=500,height=700,popup=true";
      const oauthPopup = window.open(authUri, "OAuth2 Authorization", params);

      let checkPopupInterval: number | undefined;

      const clearPopupCheck = () => {
        if (checkPopupInterval) {
          clearInterval(checkPopupInterval);
        }
        window.removeEventListener("message", receiveMessage, false);
      };

      const receiveMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data.status === "success") {
          clearPopupCheck();
          updateWorkflowAndStorage();
          setOpenModal(false);
          dispatch(setToast({ message: event.data.message, severity: event.data.status }));
        } else {
          dispatch(setToast({ message: event.data.message, severity: event.data.status }));
          await deleteCredential(credentialId);
          removeCredential(credentialId);
        }
        if (oauthPopup) {
          oauthPopup.close();
        }
      };

      window.addEventListener("message", receiveMessage, false);

      checkPopupInterval = setInterval(async () => {
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
        }
      }, 1000) as unknown as number;
    } catch (error) {
      console.error("Error during OAuth authorization:", error);
      await deleteCredential(credentialId);
      removeCredential(credentialId);
    }
  };

  const isCredentialInserted = checkCredentialInserted(credential!);

  return (
    <>
      <BaseButton
        size="small"
        onClick={() => setOpenModal(true)}
        disabled={isCredentialInserted}
        color="custom"
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
      </BaseButton>

      {openModal && (
        <Dialog
          open
          maxWidth={"md"}
          fullWidth
        >
          <DialogTitle>{input.fullName} Credentials</DialogTitle>
          <DialogContent>
            {isOauthCredential && (
              <Tooltip
                title="Copy URL"
                placement="top-end"
              >
                <Box
                  onClick={() => copy(urlToCopy)}
                  sx={{
                    m: "0 5px",
                    p: "15px",
                    border: "1px solid #c4c4c4",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {urlToCopy}
                </Box>
              </Tooltip>
            )}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values }) => (
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
                  {isOauthCredential && values.clientId && values.clientSecret && (
                    <Button
                      onClick={() => {
                        handleOauthConnect(values);
                      }}
                      sx={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "4px",
                        bgcolor: "secondary.main",
                        ml: "10px",
                        color: "white",
                        ":hover": {
                          bgcolor: "action.hover",
                          color: "inherit",
                        },
                      }}
                    >
                      Connect My Account
                    </Button>
                  )}
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
    </>
  );
}

export default Credentials;
