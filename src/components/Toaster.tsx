import { forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { type AlertProps } from "@mui/material/Alert";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { clearToast } from "@/core/store/toastSlice";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
    />
  );
});

function Toaster() {
  const dispatch = useAppDispatch();
  const { open, message, severity, duration = 6000, position } = useAppSelector(state => state.toast);
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={(_event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        dispatch(clearToast());
      }}
      anchorOrigin={position}
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );
}

export default Toaster;
