import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";

import BaseButton from "@/components/base/BaseButton";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import Storage from "@/common/storage";
import { useCreateCredentialsMutation } from "@/core/api/workflows";
import { setToast } from "@/core/store/toastSlice";
import type { ICredentialProperty } from "@/components/Automation/types";
import type { IPromptInput } from "@/common/types/prompt";
import { setCredentialsStored } from "@/core/store/chatSlice";

interface Props {
  input: IPromptInput;
}

interface FormValues {
  [key: string]: string;
}

function Credentials({ input }: Props) {
  const dispatch = useAppDispatch();
  const [createCredentials] = useCreateCredentialsMutation();
  const credentials = useAppSelector(state => state.chat.credentials);

  const storedCredentials = Storage.get("credentials") || {};

  const credential = credentials.find(cred => cred.displayName === input.fullName);
  const areCredentialsStored = storedCredentials && !!storedCredentials[credential?.name!];

  const [openModal, setOpenModal] = useState(false);
  const [credentialProperties, setCredentialProperties] = useState<ICredentialProperty[]>([]);

  useEffect(() => {
    dispatch(setCredentialsStored(areCredentialsStored));
  }, [JSON.stringify(storedCredentials)]);

  useEffect(() => {
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
    const data: Record<string, string> = {};
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        data[key] = values[key];
      }
    }
    const payload = {
      name: `${credential?.displayName} Credentials` || "Unnamed Credential",
      type: credential?.name!,
      data: data,
    };
    try {
      const response = await createCredentials(payload).unwrap();

      storedCredentials[credential?.name!] = {
        name: response.name,
        id: response.id,
        createdAt: response.createdAt,
      };
      Storage.set("credentials", JSON.stringify(storedCredentials));

      setOpenModal(false);
      dispatch(setToast({ message: "Credential is successfully created", severity: "success" }));
    } catch (error) {
      console.error("Error:", error);
      dispatch(setToast({ message: "Credential was not created, please try again.", severity: "error" }));
    }
  };

  return (
    <>
      <BaseButton
        size="small"
        onClick={() => setOpenModal(true)}
        disabled={areCredentialsStored}
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
        {areCredentialsStored ? "Credentials added" : "Insert Credentials"}
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
