import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import type { ICredentialInput, ICredentialProperty } from "@/components/Automation/types";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";

interface FormValues {
  [key: string]: string;
}

interface Props {
  credentialInput: ICredentialInput;
  onSubmit(data: Record<string, string>): void;
}

function CredentialsForm({ credentialInput, onSubmit }: Props) {
  const [open, setOpen] = useState(true);

  const credentialProperties = credentialInput.properties || [];

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

  const handleSubmit = async (values: FormValues = {}) => {
    const data: Record<string, string> = {};

    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        data[key] = values[key];
      }
    }

    onSubmit(data);
  };

  return (
    <Dialog
      open={open}
      maxWidth={"md"}
      fullWidth
      disableScrollLock
    >
      <DialogTitle>{credentialInput?.displayName} Credentials</DialogTitle>
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
                <Button onClick={() => setOpen(false)}>Cancel</Button>
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
  );
}

export default CredentialsForm;
