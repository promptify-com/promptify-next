import { baseApi } from "./api";
import { UploadFileResponse } from "@/common/types/prompt";

export const uploadFileApi = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      uploadFile: builder.mutation<UploadFileResponse, File>({
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
