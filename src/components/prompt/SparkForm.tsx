import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { createSpark, createSparkWithExecution } from '@/hooks/api/executions';

interface Props {
   isOpen: boolean,
   close: () => void,
   templateId?: number,
   executionId?: number,
   onSparkCreated: () => void,
}

const SparkForm: React.FC<Props> = ({
   isOpen,
   close,
   templateId,
   executionId,
   onSparkCreated,
}) => {

   const [sparkTitle, setSparkTitle] = React.useState("");

   const closeTitleModal = () => {
     close();
     setSparkTitle("");
   };
   
   const saveNewSpark = async () => {
      if (sparkTitle.length) {
         // If executionId is passed, create a spark with execution_id, otherwise create a empty spark with templateId
         // TODO: Handle error
         if (executionId) {
            try {
               await createSparkWithExecution({
                  title: sparkTitle,
                  execution_id: executionId,
               });
            } catch (err) {
               console.error(err);
            }

         } else {
            try {
               await createSpark({
                  initial_title: sparkTitle,
                  template: templateId,
               });
            } catch (err) {
               console.error(err);
            }
         }
   
         onSparkCreated();
         close();
         setSparkTitle("");
      }
   };

   return (
      <Dialog
         open={isOpen}
         PaperProps={{
            sx: { bgcolor: "surface.1" },
         }}
      >
      <DialogTitle sx={{ fontSize: 16, fontWeight: 400 }}>
         Enter a title for your new spark:
      </DialogTitle>
      <DialogContent>
         <TextField
            sx={{
            ".MuiInputBase-input": {
               p: 0,
               color: "onSurface",
               fontSize: 48,
               fontWeight: 400,
               "&::placeholder": { color: "grey.600" },
            },
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
            ".MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
               border: 0,
            },
            }}
            placeholder={"Title..."}
            onChange={(e) => setSparkTitle(e.target.value)}
         />
      </DialogContent>
      <DialogActions sx={{ p: "16px", gap: 2 }}>
         <Button
            sx={{ minWidth: "auto", p: 0, color: "grey.600" }}
            onClick={closeTitleModal}
         >
            Skip
         </Button>
         <Button
            sx={{
            ":disabled": { color: "grey.600" },
            ":hover": { bgcolor: "action.hover" },
            }}
            disabled={!sparkTitle.length}
            onClick={saveNewSpark}
         >
            Save
         </Button>
      </DialogActions>
      </Dialog>
   )
}

export default SparkForm