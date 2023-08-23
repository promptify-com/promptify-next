import { BaseQueryFn } from "@reduxjs/toolkit/query";

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import useToken from "@/hooks/useToken";

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" },
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    // If access token exists send the Authorization header
    const token = useToken();
    headers = headers || {};

    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    if (!headers?.["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
