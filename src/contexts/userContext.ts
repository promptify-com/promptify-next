import React from 'react';
import { IUser } from "../common/types";

export const UserContext = React.createContext<IUser | null>(null);
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export const SetUserContext = React.createContext((user: IUser | null) => { });
