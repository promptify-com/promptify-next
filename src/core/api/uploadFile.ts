import { baseApi } from "./api";

interface UploadResponse {
  file_url: string;
}

export const uploadFileApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      uploadFile: builder.mutation<UploadResponse, File>({
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
