import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { IContinueWithSocialMediaResponse } from "../../common/types";
// import { AddConnectionButtons } from '../../pages/Login/components/AddConnectionButtons';

interface IProps {
  openAdd: boolean;
  setOpenAdd: Function;
  setTypeAlert: Function;
  preLogin: () => void;
  postLogin: (data: IContinueWithSocialMediaResponse | null) => void;
  authConnection: string[];
}

const AddConnectionDialog: React.FC<IProps> = ({
  openAdd,
  setOpenAdd,
  preLogin,
  postLogin,
  authConnection,
  setTypeAlert,
}) => (
  <div>
    <Dialog
      open={openAdd}
      onClose={() => setOpenAdd(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Add New Connection"}</DialogTitle>
      <DialogContent>
        <GoogleOAuthProvider
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
        >
          {/* <AddConnectionButtons
            setTypeAlert={setTypeAlert}
            preLogin={preLogin}
            postLogin={postLogin}
            authConnection={authConnection}
            setOpenAdd={setOpenAdd}
          /> */}
        </GoogleOAuthProvider>
      </DialogContent>
    </Dialog>
  </div>
);

export default AddConnectionDialog;
