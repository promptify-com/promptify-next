import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { createSparkWithExecution } from '@/hooks/api/executions';

interface Props {
   isOpen: boolean,
   close: () => void,
   execution_id?: number,
   onSparkCreated: () => void,
}

const SparkForm: React.FC<Props> = ({
   isOpen,
   close,
   execution_id,
   onSparkCreated,
}) => {

   const [sparkTitle, setSparkTitle] = React.useState("");

   const closeTitleModal = () => {
     close();
     setSparkTitle("");
     onSparkCreated();
   };
   
   const saveSparkTitle = async () => {
      if (sparkTitle.length) {
         if (execution_id) {
            try {
               await createSparkWithExecution({
                  title: sparkTitle,
                  execution_id: execution_id,
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
            onClick={saveSparkTitle}
         >
            Save
         </Button>
      </DialogActions>
      </Dialog>
   )
}

export default SparkForm