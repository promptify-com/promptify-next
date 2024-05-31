import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { Formik, Form, Field } from "formik";
import { StringSchema, object, string } from "yup";

interface FormValues {
  [key: string]: string;
}

interface IInput {
  name: string;
  displayName: string;
  type: string;
  required: boolean;
}

interface Props {
  title: string;
  inputs: IInput[];
  onSubmit(data: Record<string, string>): void;
  onClose(): void;
}

function FormModal({ title, inputs, onSubmit, onClose }: Props) {
  const [open, setOpen] = useState(true);

  function getRequiredFields() {
    let requiredFields = inputs.filter(input => input.required).map(input => input.name);

    if (requiredFields.length === 0) {
      requiredFields = inputs.map(input => input.name);
    }
    return requiredFields;
  }

  const requiredFields = useMemo(() => getRequiredFields(), [inputs]);

  const initialValues: FormValues = inputs.reduce<FormValues>((acc, input) => {
    acc[input.name] = "";
    return acc;
  }, {});

  const validationSchema = object().shape(
    inputs.reduce<Record<string, StringSchema>>((acc, input) => {
      if (requiredFields.includes(input.name)) {
        acc[input.name] = string().required(`${input.displayName} is required`);
      } else {
        acc[input.name] = string();
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

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      maxWidth={"md"}
      fullWidth
      disableScrollLock
      onClose={handleClose}
    >
      <DialogTitle>{title}</DialogTitle>
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
                {inputs.map((input, index) => (
                  <FormControl
                    fullWidth
                    margin="dense"
                    key={index}
                  >
                    <Field
                      as={TextField}
                      autoFocus={index === 0}
                      required={requiredFields.includes(input.name)}
                      label={input.displayName}
                      name={input.name}
                      type={input.type}
                      variant="outlined"
                      fullWidth
                      helperText={touched[input.name] && errors[input.name]}
                      error={touched[input.name] && Boolean(errors[input.name])}
                    />
                  </FormControl>
                ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
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

export default FormModal;
