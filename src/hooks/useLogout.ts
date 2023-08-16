import { useRouter } from "next/router";
import Storage from "@/common/storage";
import { useDispatch } from "react-redux";
import { updateUser } from "@/core/store/userSlice";

const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  return async () => {
    return new Promise(async (resolve) => {
      Storage.remove("token");
      Storage.remove("currentUser");

      dispatch(updateUser(null));

      await router.push("/");

      resolve(true);
    })
  };
};

export default useLogout;
