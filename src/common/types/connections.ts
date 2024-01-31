import { AlertColor } from "@mui/material";

export interface IConnection {
  provider: string;
  uid: string;
  // eslint-disable-line @typescript-eslint/no-explicit-any
  extra_data?: any;
  id: number;
}
