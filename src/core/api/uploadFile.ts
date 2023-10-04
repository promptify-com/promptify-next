import { baseApi } from "./api";

// import { authClient } from "@/common/axios";

// export const uploadFile = async (data: File) => {
//   const file = new FormData();
//   file.append("file", data);
//   return await authClient.post("/api/upload/", file).then(response => {
//     return response.data.file_url;
//   });
// };

export const uploadFileApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      uploadFile: builder.mutation<string, File>({
        query: file => {
          const formData = new FormData();
          formData.append("file", file);
          return {
            url: "/api/upload/",
            method: "post",
            data: formData,
            formData: true,
            headers: {
              "Content-Type": "multipart/form-data;",
            },
          };
        },
      }),
    };
  },
});

export const { useUploadFileMutation } = uploadFileApi;
