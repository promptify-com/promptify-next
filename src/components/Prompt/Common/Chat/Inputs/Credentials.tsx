import { useEffect, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Storage from "@/common/storage";
import { useCreateCredentialsMutation, useUpdateWorkflowMutation } from "@/core/api/workflows";
import { setToast } from "@/core/store/toastSlice";
import { attachCredentialsToNode, checkAllCredsStored } from "@/components/Automation/helpers";
import { setAreCredentialsStored } from "@/core/store/chatSlice";
import type { ICredentialProperty, IWorkflowCreateResponse } from "@/components/Automation/types";
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

  const { credentials } = useAppSelector(state => state.chat);

  const [openModal, setOpenModal] = useState(false);
  const [credentialProperties, setCredentialProperties] = useState<ICredentialProperty[]>([]);

  useEffect(() => {
    const credential = credentials.find(cred => cred.displayName === input.fullName);
    if (credential) {
      setCredentialProperties(credential.properties);
    }
  }, [credentials]);

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
    const credential = credentials.find(cred => cred.displayName === input.fullName);
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

      const storedWorkflows = Storage.get("workflows") || {};
      const storedCredentials = Storage.get("credentials") || {};

      storedCredentials[credential?.name!] = {
        name: response.name,
        id: response.id,
        createdAt: response.createdAt,
      };
      Storage.set("credentials", JSON.stringify(storedCredentials));

      const workflow = storedWorkflows[workflowId].workflow as IWorkflowCreateResponse;

      workflow.nodes.forEach(node => {
        attachCredentialsToNode(node, storedCredentials);
      });

      const areAllCredentialsStored = checkAllCredsStored(credentials);
      dispatch(setAreCredentialsStored(areAllCredentialsStored));

      Storage.set("workflows", JSON.stringify(storedWorkflows));

      if (areAllCredentialsStored) {
        try {
          await updateWorkflow({
            workflowId: parseInt(workflowId),
            data: workflow,
          }).unwrap();
        } catch (error) {
          console.error("Error updating workflow:", error);
          dispatch(setToast({ message: "Failed to update workflow", severity: "error" }));
        }
      }
      setOpenModal(false);
      dispatch(setToast({ message: "Credential was successfully created", severity: "success" }));
    } catch (error) {
      console.error("Error:", error);
      dispatch(setToast({ message: "Credential was not created, please try again.", severity: "error" }));
    }
  };

  const checkCredentialInserted = () => {
    const storedCredentials = Storage.get("credentials") || {};
    const credential = credentials.find(cred => cred.displayName === input.fullName);
    return !!storedCredentials[credential?.name!];
  };

  const isCredentialInserted = checkCredentialInserted();

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
                  <DialogContent>
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
