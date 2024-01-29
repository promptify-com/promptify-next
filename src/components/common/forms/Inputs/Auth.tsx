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
import { useAppSelector } from "@/hooks/useStore";
import type { ICredentialsProperty } from "@/components/Automation/types";
import type { IPromptInput } from "@/common/types/prompt";

interface AuthProps {
  input: IPromptInput;
}

interface FormValues {
  [key: string]: string;
}

function Auth({ input }: AuthProps) {
  const [openModal, setOpenModal] = useState(false);
  const [credentialProperties, setCredentialProperties] = useState<ICredentialsProperty[]>([]);

  const authCredentials = useAppSelector(state => state.chat.authCredentials);

  useEffect(() => {
    const credential = authCredentials.find(cred => cred.displayName === input.fullName);
    if (credential) {
      setCredentialProperties(credential.properties);
    }
  }, [authCredentials]);

  const initialValues: FormValues = credentialProperties.reduce<FormValues>((acc, prop) => {
    acc[prop.name] = "";
    return acc;
  }, {});

  const validationSchema = object().shape(
    credentialProperties.reduce<Record<string, any>>((acc, prop) => {
      acc[prop.name] = string().required(`${prop.displayName} is Required`);
      return acc;
    }, {}),
  );

  const handleSubmit = (values: FormValues) => {
    console.log("Form Values", values);
  };

  return (
    <>
      <BaseButton
        size="small"
        onClick={() => setOpenModal(true)}
        color="custom"
        variant="text"
        sx={{
          border: "1px solid",
          borderRadius: "8px",
          borderColor: "secondary.main",
          color: "secondary.main",
          p: "3px 12px",
          fontSize: { xs: 12, md: 14 },
          ":hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        {"Insert Credentials"}
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
                          required={true}
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

export default Auth;
