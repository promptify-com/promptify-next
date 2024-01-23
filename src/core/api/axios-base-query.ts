import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { BaseQueryFn } from "@reduxjs/toolkit/dist/query";

import useToken from "@/hooks/useToken";
import type { ResponseType } from "./dto/templates";

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
      responseType?: ResponseType;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers, responseType }) => {
    const token = useToken();
    headers = headers || {};

    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    if (!headers?.["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const attemptRequest = async (attempt = 0): Promise<{ data: any } | { error: any }> => {
      try {
        const properUrl = url.endsWith("/") || url.includes("?") ? url : `${url}/`;
        const axiosReq: AxiosRequestConfig = {
          url: baseUrl + properUrl,
          method,
          data,
          params,
          headers,
        };
        if (responseType) {
          axiosReq.responseType = responseType;
        }
        const result = await axios(axiosReq);
        return { data: result.data };
      } catch (error) {
        if (attempt < 3) {
          // Retry up to 3 times
          return attemptRequest(attempt + 1);
        }
        throw error;
      }
    };

    try {
      return await attemptRequest();
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
