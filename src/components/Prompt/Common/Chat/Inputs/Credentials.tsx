import { useState } from "react";
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
import { useCreateCredentialsMutation, useUpdateWorkflowMutation } from "@/core/api/workflows";
import { setToast } from "@/core/store/toastSlice";
import { attachCredentialsToNode } from "@/components/Automation/helpers";
import { setAreCredentialsStored } from "@/core/store/chatSlice";
import useCredentials from "@/components/Automation/Hooks/useCredentials";
import type { ICredentialProperty, INode, IWorkflowCreateResponse } from "@/components/Automation/types";
import type { IPromptInput } from "@/common/types/prompt";

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

  const { credentialsInput, credentials, updateCredentials, checkAllCredentialsStored, checkCredentialInserted } =
    useCredentials();

  const [openModal, setOpenModal] = useState(false);
  const credential = credentialsInput.find(cred => cred.displayName === input.fullName);
  const credentialProperties = credential?.properties || [];

  function getRequiredFields(credentialProperties: ICredentialProperty[]) {
    let requiredFields = credentialProperties.filter(prop => prop.required).map(prop => prop.name);

    if (requiredFields.length === 0) {
      requiredFields = credentialProperties.map(prop => prop.name);
    }
    return requiredFields;
  }

  const requiredFields = getRequiredFields(credentialProperties);

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

      const storedWorkflows = Storage.get("workflows") || {};

      const workflow = storedWorkflows[workflowId].workflow as IWorkflowCreateResponse;

      const updatedNodes = workflow.nodes.map(node => attachCredentialsToNode(node));
      storedWorkflows[workflowId].workflow = { ...workflow, nodes: updatedNodes };

      const areAllCredentialsStored = checkAllCredentialsStored(credentialsInput);
      dispatch(setAreCredentialsStored(areAllCredentialsStored));

      Storage.set("workflows", JSON.stringify(storedWorkflows));

      if (areAllCredentialsStored) {
        try {
          await updateWorkflow({
            workflowId: parseInt(workflowId),
            data: { ...workflow, nodes: updatedNodes as INode[] },
          });
        } catch (error) {
          console.error("Error updating workflow:", error);
        }
      }
      setOpenModal(false);
      dispatch(setToast({ message: "Credential was successfully created", severity: "success" }));
    } catch (error) {
      console.error("Error:", error);
      dispatch(setToast({ message: "Credential was not created, please try again.", severity: "error" }));
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
    </>
  );
}

export default Credentials;
