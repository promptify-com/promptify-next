import { useRouter } from "next/router";

const useLogout = () => {
  const router = useRouter();

  return () => {
    localStorage.removeItem("token");
    router.push("/");
  };
};

export default useLogout;
