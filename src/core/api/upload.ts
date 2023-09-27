import { baseApi } from "./api";

export const uploadFile = baseApi.injectEndpoints({
  endpoints: builder => {
    return {
      uploadFile: builder.mutation({
        query: file => {
          console.log("From Injection: ", file);
          return {
            url: `/api/upload`,
            method: "post",
            file,
          };
        },
      }),
    };
  },
});

export const { useUploadFileMutation } = uploadFile;
