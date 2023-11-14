import Storage from "@/common/storage";

const getToken = () => {
  let token = null;

  if (typeof window !== "undefined") {
    token = Storage.get("token");
  }

  return token;
};

const useToken = () => getToken();

export default useToken;
