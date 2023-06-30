import React from "react";
import { SetUserContext } from "@/contexts";
import { IUser } from "../common/types";

const useUser = () => {
  return React.useContext<(u: IUser | null) => void>(SetUserContext);
};

export default useUser;
