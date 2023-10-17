import Storage from "@/common/storage";
import { useDispatch } from "react-redux";
import { updateUser } from "@/core/store/userSlice";
import { redirectToPath } from "@/common/helpers";

const useLogout = () => {
  const dispatch = useDispatch();

  return async () => {
    return new Promise(async resolve => {
      Storage.remove("token");
      Storage.remove("currentUser");

      dispatch(updateUser(null));
      redirectToPath("/");
      resolve(true);
    });
  };
};

export default useLogout;
