import { useRouter } from "next/router";

const useLogout = () => {
  const router = useRouter();

  return async () => {
    return new Promise(resolve => {
      localStorage.removeItem("token");
      router.push("/");
      resolve(true);
    })
  };
};

export default useLogout;
