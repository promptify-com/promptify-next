import React, {  } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Button, Stack, TextField } from '@mui/material';

interface IModal {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function TemplateImportModal({ open, setOpen }: IModal) {
  const placeholder = {
    title: 'Template',
    description: 'Template description',
    duration: '1',
    difficulty: 'BEGINNER',
    is_visible: 'true',
    language: 'en-us',
    category: '1',
    thumbnail: 'https://thumbnailpath.com/image675676',
    example: 'Template example',
    prompts_list: []
  }

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
          placeholder={JSON.stringify(placeholder, null, 3)}
          multiline
          rows={10}
          fullWidth
          // value={formik.values.description}
          // onChange={formik.handleChange}
          // error={formik.touched.description && formik.values.description === ''}
        />
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
            onClick={() => {
              // formik.submitForm();
            }}
          >
            Import
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}