import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { BaseQueryFn } from "@reduxjs/toolkit/dist/query";

import useToken from "@/hooks/useToken";
import RetryRequestError from "./errors/RetryRequestError";
import type { ResponseType } from "./dto/templates";

const IGNORED_RESPONSE_STATUS_CODES = [401, 403, 404];

export const axiosBaseQuery =
  (
    { baseUrl, maxRetries = 3 }: { baseUrl: string; maxRetries?: number } = {
      baseUrl: "",
    },
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
  async ({ url, method, data, params, headers = {}, responseType }) => {
    const token = useToken();

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
        const _err = error as AxiosError;

        if (_err.response?.status && IGNORED_RESPONSE_STATUS_CODES.includes(_err.response.status)) {
          throw error;
        }

        if (attempt < maxRetries) {
          return attemptRequest(attempt + 1);
        }

        throw new RetryRequestError("Request failed after all retry attempts.");
      }
    };

    try {
      return await attemptRequest();
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      const isRetryRequestError = err instanceof RetryRequestError;

      return {
        error: {
          status: err.response?.status || err.status,
          data: {
            message: err.response?.data || err.message,
            retryRequestError: isRetryRequestError,
          },
        },
      };
    }
  };
