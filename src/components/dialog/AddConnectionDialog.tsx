import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { IContinueWithSocialMediaResponse } from "@/common/types";
import { AddConnectionButtons } from "../login/AddConnectionButtons";

interface IProps {
  openAdd: boolean;
  setOpenAdd: Function;
  preLogin: () => void;
  postLogin: (data: IContinueWithSocialMediaResponse | null) => void;
  authConnection: string[];
}

const AddConnectionDialog: React.FC<IProps> = ({ openAdd, setOpenAdd, preLogin, postLogin, authConnection }) => (
  <Dialog
    open={openAdd}
    onClose={() => setOpenAdd(false)}
    disableScrollLock
  >
    <DialogTitle>Add New Connection</DialogTitle>
    <DialogContent>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
        <AddConnectionButtons
          preLogin={preLogin}
          postLogin={postLogin}
          authConnection={authConnection}
          setOpenAdd={setOpenAdd}
        />
      </GoogleOAuthProvider>
    </DialogContent>
  </Dialog>
);

export default AddConnectionDialog;
