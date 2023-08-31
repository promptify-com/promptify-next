import { BaseQueryFn } from "@reduxjs/toolkit/query";

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import useToken from "@/hooks/useToken";
import { ResponseType } from "./dto/templates";

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
