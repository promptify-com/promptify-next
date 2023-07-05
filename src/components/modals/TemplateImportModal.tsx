import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { createTemplate } from '@/hooks/api/templates';
import { AxiosError } from 'axios';
  
const templateExample = {
  "title": "Template",
  "description": "Template description",
  "duration": "1",
  "difficulty": "BEGINNER",
  "is_visible": true,
  "language": "en-us",
  "category": 1,
  "thumbnail": "https://thumbnailpath.com/image675676"
}

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  refetchTemplates: () => void;
}

export default function TemplateImportModal({ open, setOpen, refetchTemplates }: Props) {
  const [errors, setErrors] = useState<string[]>([])

  const ValidationSchema = yup.object().shape({
    json: yup.string().required('Please enter a valid JSON template schema')
  })

  const formik = useFormik({
    initialValues: {
      json: ''
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      setErrors([]);
      
      try {
        const json = JSON.parse(values.json);

        // JSON schema validator
        // const requires = [ 'title', 'description', 'duration', 'difficulty', 'is_visible', 'language', 'category', 'thumbnail', 'example', 'prompts_list' ]
        // const misses = requires.filter((property) => !(property in json));
        // if(misses.length > 0) {
        //   formik.setErrors({ json: 'Please enter a valid JSON template schema' })
        //   return
        // }

        createTemplate({...json})
          .then(data => {
            setOpen(false);
            refetchTemplates();
            formik.resetForm();
            window.open(window.location.origin + `/builder/${data.id}`, '_blank');
          })
          .catch((err: AxiosError) => {
            if (err.response?.status === 400) {
              const errorData = err.response?.data as any;
              let resErrors: string[] = [];
              Object.entries(errorData).map(([property, msg]) => {
                resErrors.push(`${property}: ${msg}`);
              })
              setErrors(resErrors)
            } else {
              formik.setErrors({ json: 'Something went wrong. Please try again later' })
            }
            return
          })

      } catch (error) {
        formik.setErrors({ json: 'Please enter a valid JSON template schema' })
        return
      }
    },
  });

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxHeight: '70vh',
          width: '600px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          overflow: 'auto'
        }}
      >
        <TextField
          placeholder={JSON.stringify(templateExample, null, 3)}
          multiline
          rows={10}
          name='json'
          fullWidth
          value={formik.values.json}
          onChange={formik.handleChange}
          error={formik.touched.json && Boolean(formik.errors.json)}
          helperText={formik.touched.json && formik.errors.json}
          sx={{ '.MuiInputBase-input': { overscrollBehavior: 'contain' } }}
          InputProps={{
            sx: {
              fontFamily: 'monospace',
              fontSize: 14,
              bgcolor: 'grey.100',
              p: '10px',
            },
          }}
          variant="outlined"
        />
        {(errors.length > 0) && (
          <Box sx={{ m: '5px 14px' }}>
            {errors.map((errMsg, i) => (
              <Box key={i} 
                sx={{ 
                  fontSize: 12, 
                  color: 'error.main', 
                  mb: '8px'
                }}
              >
                {errMsg}
              </Box>
            ))}
          </Box>
        )
        }
        <Stack sx={{
            direction: 'row', 
            justifyContent: 'center', 
            mt: 2
          }}
        >
          <Button
            variant='contained'
            sx={{
              width: 'fit-content',
              m: 'auto',
              px: 4
            }}
            onClick={formik.submitForm}
          >
            Import
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}