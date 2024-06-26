import Check from "@mui/icons-material/Check";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import BaseButton from "../base/BaseButton";

interface Props {
  onClose: () => void;
  onUpdate: (title: string) => void;
  title: string;
  label?: string;
}

function UpdateTextInputModal({ title: originalTitle, onClose, onUpdate, label = "Rename Document" }: Props) {
  const [title, setTitle] = useState(originalTitle);

  return (
    <Dialog open>
      <Grid
        width={"318px"}
        padding={"16px"}
        display={"flex"}
        flexDirection={"column"}
        gap={"8px"}
      >
        <TextField
          defaultValue={title}
          onChange={e => setTitle(e.target.value)}
          id="standard-basic"
          label={label}
          variant="standard"
          fullWidth
          color="secondary"
        />
        <Grid
          display={"flex"}
          gap={"8px"}
          paddingY={"8px"}
          alignItems={"center"}
        >
          <BaseButton
            onClick={() => {
              onUpdate(title);
            }}
            color="custom"
            variant="contained"
            size="small"
            sx={{
              height: "30px",
              px: 0,
              bgcolor: "primary.main",
              border: "none",
              "&:hover": {
                bgcolor: "surface.5",
              },
            }}
          >
            <Check sx={{ fontSize: "16px", mr: "2px" }} />
            Ok
          </BaseButton>
          <BaseButton
            onClick={() => onClose()}
            color="primary"
            variant="outlined"
            size="small"
            sx={{
              height: "30px",
              px: 0,
            }}
          >
            Cancel
          </BaseButton>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default UpdateTextInputModal;
