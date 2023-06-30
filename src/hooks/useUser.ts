import React from "react";
import {UserContext} from "../contexts";
import {IUser} from "../common/types";


const useUser = (): IUser | null => {
  return React.useContext(UserContext);
}

export default useUser;