import React, {useContext} from "react";
import {UserContext} from "@/contexts";
import {IUser} from "@/common/types";


const useUser = (): IUser | null => {
  return useContext(UserContext);
}

export default useUser;