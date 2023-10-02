import { authClient } from "@/common/axios";

export const uploadFile = async (data: File) => {
  const file = new FormData();
  file.append("file", data);
  return await authClient.post("/api/upload/", file).then(response => {
    return response.data.file_url;
  });
};
