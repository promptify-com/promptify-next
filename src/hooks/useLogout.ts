import Storage from "@/common/storage";
import { useDispatch } from "react-redux";
import { updateUser } from "@/core/store/userSlice";
import { redirectToPath } from "@/common/helpers";

const useLogout = () => {
  const dispatch = useDispatch();

  return async () => {
    return new Promise(async resolve => {
      dispatch(updateUser(null));

      Storage.clear();

      redirectToPath("/");
      resolve(true);
    });
  };
};

export default useLogout;
