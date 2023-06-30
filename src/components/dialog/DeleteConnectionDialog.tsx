import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IConnection } from '../../common/types';

interface IProps {
    open: boolean;
    handleDeleteConnection: Function;
    typeConnection: IConnection | null;
    setOpen: Function
}

const DeleteConnectionDialog: React.FC<IProps> = ({
    open,
    handleDeleteConnection,
    typeConnection,
    setOpen
}) => (
    <div>
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Delete Connection"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {` Are you sure you wanna remove the ${typeConnection?.provider} connection`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    sx={{
                        '&:hover': {
                            background: "#5a58cb24",
                        }
                    }}
                    onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button
                    onClick={() => handleDeleteConnection(typeConnection)}
                    sx={{
                        '&:hover': {
                            background: "#5a58cb24",
                        }
                    }}
                >
                    Remove
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);

export default DeleteConnectionDialog;