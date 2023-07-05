import React, {  } from 'react';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';

interface IModal {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function TemplateImportModal({ open, setOpen }: IModal) {

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box>Import JSON</Box>
    </Modal>
  );
}